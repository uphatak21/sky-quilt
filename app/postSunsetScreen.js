import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import supabase from "./Supabase";
import { useDarkMode } from "../assets/Themes/DarkModeContext";
import { Themes } from "../assets/Themes";
import { useLocalSearchParams } from "expo-router";
import { decode } from "base64-arraybuffer";

// const testing = false;

export default function Page() {
  const { isTablet, userId } = useLocalSearchParams();

  const { darkMode } = useDarkMode();
  const [selectedImage, setSelectedImage] = useState(null);

  const defaultImage = require("../assets/defaultImage.png");

  useEffect(() => {
    // Check if a sunset image has been uploaded for the current day
    const checkExistingSunsetImage = async () => {
      try {
        const currentDate = new Date().toISOString().slice(0, 10);
        console.log("current date: ", currentDate);

        const { data, error } = await supabase.storage
          .from("sunset-bucket")
          .list(userId);

        if (error) {
          console.error(
            "First error checking existing sunset image:",
            error.message
          );
        } else {
          const filteredEntries = data.filter((entry) =>
            entry.name.includes(currentDate)
          );
          if (filteredEntries.length > 0) {
            console.log("TRUE");
            const { data } = supabase.storage
              .from(`sunset-bucket/${userId}`)
              .getPublicUrl(`${currentDate}.png`);
            console.log("public url", data);
            setSelectedImage(data.publicUrl);
          }
        }
      } catch (error) {
        console.error(
          "Second error checking existing sunset image:",
          error.message
        );
      }
    };
    checkExistingSunsetImage();
  }, []);

  // add some kinf of loading indicator

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const getPermissionAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access media library is required!");
    }
  };

  const pickAndUploadImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });
      if (result.canceled) {
        return;
      }

      Alert.alert(
        "Confirm Image",
        "Do you want to upload this image?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => uploadImage(result.assets[0].base64),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error picking and uploading image:", error);
    }
  };

  const uploadImage = async (base64) => {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      // console.log("date: ", currentDate);

      const { data, error } = await supabase.storage
        .from("sunset-bucket")
        .upload(`${userId}/${currentDate}.png`, decode(base64), {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("First error uploading image:", error);
      } else {
        console.log("Image uploaded successfully:", data);
        setSelectedImage(base64);
      }
    } catch (error) {
      console.error("Second error uploading image:", error.message);
    }
  };

  return (
    <LinearGradient
      colors={darkMode ? Themes.dark.colors : Themes.light.colors}
      style={styles.container}
    >
      <SafeAreaView>
        <StatusBar barStyle={"light-content"} />
        <View style={styles.container}>
          <Text style={styles.title}>sky quilt</Text>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {selectedImage ? (
              <View style={styles.body}>
                <Text style={styles.bodyText}>
                  one of the only constants in life is that the sun rises and
                  sets.
                </Text>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.imagePreview}
                  defaultSource={defaultImage}
                />
              </View>
            ) : (
              <Button
                title="what did your sunset look like today?"
                onPress={pickAndUploadImage}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    // fontFamily: "sans-serif",
    marginBottom: 20,
  },
  body: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  bodyText: {
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 30,
  },
});
