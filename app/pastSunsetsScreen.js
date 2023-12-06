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

export default function Page() {
  const params = useLocalSearchParams();

  const { darkMode } = useDarkMode();
  const [sunsetImages, setSunsetImages] = useState([]);

  useEffect(() => {
    const fetchSunsetImages = async () => {
      try {
        const { data, error } = await supabase
          .from("sunset-images")
          .select("*");
        if (error) {
          console.error("Error fetching sunset images:", error);
        } else {
          setSunsetImages(data);
          //   console.log(data);
        }
      } catch (error) {
        console.error("Error fetching sunset images:", error.message);
      }
    };
    fetchSunsetImages();
  }, []);

  const renderSunsetImage = ({ item }) => {
    const date = new Date(item.date_created);
    const month = date
      .toLocaleString("en-us", {
        month: "short",
      })
      .toLocaleLowerCase();
    const day = date.getDate();
    const dateString = `${month} ${day}`;
    return (
      <View style={styles.quiltTile}>
        <Image source={{ uri: item.image_uri }} style={styles.imageItem} />
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
    fontFamily: "sans-serif",
    marginBottom: 20,
  },
  imageItem: {
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 30,
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
