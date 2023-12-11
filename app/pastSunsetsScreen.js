import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import supabase from "./Supabase";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkMode } from "../assets/Themes/DarkModeContext";
import { Themes } from "../assets/Themes";
import { useLocalSearchParams } from "expo-router";

const windowWidth = Dimensions.get("window").width;

export default function Page() {
  const defaultImage = require("../assets/defaultImage.png");
  const { isTablet, userId } = useLocalSearchParams();

  const { darkMode } = useDarkMode();
  const [sunsetImages, setSunsetImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // add a try catch here?

  useEffect(() => {
    const fetchSunsetImages = async () => {
      const { data, error } = await supabase.storage
        .from("sunset-bucket")
        .list(userId);
      console.log("data", data.length);
      setSunsetImages(
        data
          .filter(
            (entry) =>
              entry.name != userId && entry.name != ".emptyFolderPlaceholder"
          )
          .map((image) => image.name)
      );
      setLoading(false);
      // console.log("images: ", sunsetImages);
      // console.log("images 2: ", data);
    };
    fetchSunsetImages();
  }, []);

  const renderSunsetImage = ({ item }) => {
    const itemDate = item.slice(0, -4);
    const date = new Date(itemDate);
    const month = date
      .toLocaleString("en-us", {
        month: "short",
      })
      .toLocaleLowerCase();
    console.log(date);
    const day = date.getDate() + 1;
    const dateString = `${month} ${day}`;
    const { data } = supabase.storage
      .from(`sunset-bucket/${userId}`)
      .getPublicUrl(item);
    return (
      <View style={styles.quiltTile}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Image
            source={{ uri: data.publicUrl }}
            style={styles.imageItem}
            defaultSource={defaultImage}
          />
        )}

        <Text style={styles.caption}>{dateString}</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={darkMode ? Themes.dark.colors : Themes.light.colors}
      style={styles.container}
    >
      <SafeAreaView>
        <StatusBar barStyle={"light-content"} />
        <View style={styles.container}>
          <Text style={styles.title}>my quilt</Text>

          <FlatList
            data={sunsetImages}
            keyExtractor={(item) => item.name}
            renderItem={renderSunsetImage}
            numColumns={3}
          />
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
    paddingTop: 30,
  },
  title: {
    fontSize: windowWidth * 0.072,
    fontWeight: "bold",
    color: "white",
    // fontFamily: "sans-serif",
    marginBottom: 20,
  },
  imageItem: {
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 30,
    // borderWidth: 5,
    // borderColor: "blue",
  },
  caption: {
    color: "white",
    fontSize: windowWidth * 0.03,
  },
  quiltTile: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
