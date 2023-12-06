import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import supabase from "./Supabase";
import { useDarkMode } from "../assets/Themes/DarkModeContext";
import { Themes } from "../assets/Themes";

// const testing = false;

export default function Page() {
  const params = useLocalSearchParams();

  const { darkMode } = useDarkMode();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Check if a sunset image has been uploaded for the current day
    const checkExistingSunsetImage = async () => {
      try {
        const currentDate = new Date().toISOString().slice(0, 10);
        // console.log(currentDate);

        const { data, error } = await supabase
          .from("sunset-images")
          .select("image_uri")
          .eq("date_created", currentDate);

        if (error) {
          console.error(
            "First error checking existing sunset image:",
            error.message
          );
        } else if (data.length > 0) {
          // If one image exists for today, use that.
          setSelectedImage(data[0].image_uri);
          // if (!testing) {
          //   setSelectedImage(data.image_uri);
          // }
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
            onPress: () => uploadImage(result.assets),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error picking and uploading image:", error);
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      const currentDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // Upload image to supabase
      const { data, error } = await supabase.from("sunset-images").insert({
        date_created: currentDate,
        image_uri: imageUri.toString(),
      });

      if (error) {
        console.error("Error uploading image:", error);
      } else {
        console.log("Image uploaded successfully:", data);
        setSelectedImage(imageUri);
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
    }
  };

  return (
    <LinearGradient
      colors={darkMode ? Themes.light.colors : Themes.dark.colors}
      style={styles.container}
    >
      <SafeAreaView>
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
    fontFamily: "sans-serif",
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
