import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import supabase from "./Supabase";
import { useDarkMode } from "../assets/Themes/DarkModeContext";
import { Themes } from "../assets/Themes";
import { useLocalSearchParams } from "expo-router";
import { decode } from "base64-arraybuffer";

const windowWidth = Dimensions.get("window").width;

export default function Page() {
  const { isTablet, userId } = useLocalSearchParams();
  const { darkMode } = useDarkMode();
  const [selectedImage, setSelectedImage] = useState(null);
  const defaultImage = require("../assets/defaultImage.png");

  // CITATION: https://zuhairnaqi.medium.com/react-native-conversion-of-date-timezone-8fec3f76c1a5
  const convertUTCToLocalTime = (dateString) => {
    let date = new Date(dateString);
    const milliseconds = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    const localTime = new Date(milliseconds);
    return localTime;
  };

  useEffect(() => {
    const checkExistingSunsetImage = async () => {
      try {
        const currentDate = convertUTCToLocalTime(new Date().toISOString())
          .toISOString()
          .slice(0, 10);

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
            const { data } = supabase.storage
              .from(`sunset-bucket/${userId}`)
              .getPublicUrl(`${currentDate}.png`);
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
            onPress: () =>
              uploadImage(result.assets[0].base64, result.assets[0].uri),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error picking and uploading image:", error);
    }
  };

  const uploadImage = async (base64, uri) => {
    try {
      const currentDate = convertUTCToLocalTime(new Date().toISOString())
        .toISOString()
        .slice(0, 10);

      // CITATION: https://stackoverflow.com/questions/72300047/uploading-base64-images-to-supabase
      const { data, error } = await supabase.storage
        .from("sunset-bucket")
        .upload(`${userId}/${currentDate}.png`, decode(base64), {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("First error uploading image:", error);
      } else {
        setSelectedImage(uri);
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
          <Text style={styles.title}>today's sunset</Text>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {selectedImage ? (
              <View style={styles.body}>
                <Text style={[styles.bodyText, styles.bodyComponent]}>
                  one of the only constants in life is that the sun rises and
                  sets.
                </Text>
                <Image
                  source={{ uri: selectedImage }}
                  style={[styles.imagePreview, styles.bodyComponent]}
                  defaultSource={defaultImage}
                />
              </View>
            ) : (
              <Button title="post my sunset" onPress={pickAndUploadImage} />
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
    marginBottom: 20,
    fontSize: windowWidth * 0.072,
  },
  body: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  bodyComponent: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  bodyText: {
    textAlign: "center",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    fontSize: windowWidth * 0.04,
  },
  imagePreview: {
    width: windowWidth * 0.6,
    height: windowWidth * 0.6,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 30,
  },
});
