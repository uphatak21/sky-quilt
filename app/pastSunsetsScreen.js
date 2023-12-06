import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import supabase from "./Supabase";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkMode } from "../assets/Themes/DarkModeContext";
import { Themes } from "../assets/Themes";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
  const params = useLocalSearchParams();

  const { darkMode } = useDarkMode();
  const [sunsetImages, setSunsetImages] = useState([]);

  useEffect(() => {
    const fetchSunsetImages = async () => {
      const { data, error } = await supabase.storage
        .from("sunset-bucket")
        .list();
      setSunsetImages(
        data
          .filter((entry) => entry.name != ".emptyFolderPlaceholder")
          .map((image) => image.name)
      );
      console.log("images: ", sunsetImages);
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
    console.log(month);
    const day = date.getDate();
    const dateString = `${month} ${day}`;
    const { data } = supabase.storage.from("sunset-bucket").getPublicUrl(item);
    return (
      <View style={styles.quiltTile}>
        <Image source={{ uri: data.publicUrl }} style={styles.imageItem} />
        <Text style={styles.caption}>{dateString}</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={darkMode ? Themes.light.colors : Themes.dark.colors}
      style={styles.container}
    >
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.title}>past sunsets</Text>

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
    fontSize: 32,
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
  },
  quiltTile: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
