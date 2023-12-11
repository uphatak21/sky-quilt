import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
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

  useEffect(() => {
    const fetchSunsetImages = async () => {
      try {
        const { data, error } = await supabase.storage
          .from("sunset-bucket")
          .list(userId);
        setSunsetImages(
          data
            .filter(
              (entry) =>
                entry.name != userId && entry.name != ".emptyFolderPlaceholder"
            )
            .map((image) => image.name)
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchSunsetImages();
  }, []);

  const renderSunsetImage = ({ item }) => {
    const itemDate = item.slice(0, -4);
    const date = new Date(itemDate);
    // CITATION: https://stackoverflow.com/questions/59310560/date-formatting-in-react-native
    const month = date
      .toLocaleString("en-us", {
        month: "short",
      })
      .toLocaleLowerCase();
    const day = date.getDate() + 1;
    // CITATION: https://stackoverflow.com/questions/59101544/how-to-get-last-2-digits-of-year-from-javascript-date
    const year = date.getFullYear() % 100;
    const dateString = `${month} ${day}, '${year}`;
    const { data } = supabase.storage
      .from(`sunset-bucket/${userId}`)
      .getPublicUrl(item);
    return (
      <View style={styles.quiltTile}>
        <Image
          source={{ uri: data.publicUrl }}
          style={styles.imageItem}
          defaultSource={defaultImage}
        />
        <Text
          style={[
            styles.caption,
            darkMode
              ? { color: Themes.dark.text }
              : { color: Themes.light.text },
          ]}
        >
          {dateString}
        </Text>
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
            keyExtractor={(item) => item}
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
    marginBottom: 20,
  },
  imageItem: {
    width: windowWidth * 0.3,
    height: windowWidth * 0.3,
    margin: 5,
    borderRadius: 30,
  },
  caption: {
    fontSize: windowWidth * 0.04,
  },
  quiltTile: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
