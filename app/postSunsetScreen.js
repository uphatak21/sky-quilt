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
import { useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

// const testing = false;

// const uploadToSupabase = async (base64Image, imageExtension, bucketName) => {
//   try {
//     const base64Str = base64Image.includes("base64,")
//       ? base64Image.substring(base64Image.indexOf("base64,") + "base64,".length)
//       : base64Image;
//     const res = decode(base64Str);

//     if (!(res.byteLength > 0)) {
//       console.error("[uploadToSupabase] ArrayBuffer is null");
//       return null;
//     }

//     const { data, error } = await supabaseClient.storage
//       .from(bucketName)
//       .upload(`${nanoid()}.${imageExtension}`, res, {
//         contentType: `image/${imageExtension}`,
//       });
//     if (!data) {
//       console.error("[uploadToSupabase] Data is null");
//       return null;
//     }

//     if (error) {
//       console.error("[uploadToSupabase] upload: ", error);
//       return null;
//     }
//     const { publicURL, error: urlError } = supabaseClient.storage
//       .from(bucketName)
//       .getPublicUrl(data.Key.replace(`${bucketName}/`, ""));

//     if (urlError) {
//       console.error("[uploadToSupabase] PublicURL: ", urlError);
//       return null;
//     }

//     if (!publicURL) {
//       console.error("[uploadToSupabase] publicURL is null");
//       return null;
//     }

//     return publicURL;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

export default function Page() {
  const params = useLocalSearchParams();

  const { darkMode } = useDarkMode();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState(null);

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

        // const { data, error } = await supabase.storage
        //   .from("sunset-bucket")
        //   .list();

        // console.log("bucket contents:", data[1]);

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
        base64: true,
      });

      console.log(result);

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
            onPress: () => uploadImage(result),
            // onPress: () => {
            //   setImagePath(`data:${result.mime};base64,${result.data}`);
            //   console.log(
            //     "image path: ",
            //     `data:${result.mime};base64,${result.data}`
            //   );
            //   console.log(result);
            //   uploadToSupabase(imagePath, "jpg", "sunset-bucket");
            //   // const imageUrl = await uploadToSupabase(imagePath, "jpg", "posts");
            // },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error picking and uploading image:", error);
    }
  };

  const uploadImage = async (result) => {
    try {
      const currentDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // Upload image to supabase
      // const { data, error } = await supabase.from("images").insert({
      //   date_created: currentDate,
      //   image_uri: imageUri,
      // });
      // const toUpload = await FileSystem.readAsStringAsync(
      //   result.assets[0].uri,
      //   {
      //     encoding: "base64",
      //   }
      // );

      const { data, error } = await supabase.storage
        .from("sunset-bucket")
        .upload("image4.png", decode(result.assets[0].base64), {
          cacheControl: "3600",
          upsert: false,
        });

      // const { data, error } = await supabase.storage
      //   .from("sunset-bucket")
      //   .list();

      console.log(data);

      if (error) {
        console.error("First error uploading image:", error);
      } else {
        console.log("Image uploaded successfully:", data);
        setSelectedImage(result.assets[0].base64);
      }
    } catch (error) {
      console.error("Second error uploading image:", error.message);
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
