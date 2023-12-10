import React from "react";
import { View, Pressable } from "react-native";
import { useDarkMode } from "../assets/Themes/DarkModeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const Header = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 40,
        width: "100%",
        // borderColor: "blue",
        // borderWidth: 5,
      }}
    >
      <Pressable onPress={toggleDarkMode}>
        <View
          style={{
            padding: 10,
            backgroundColor: darkMode ? "#555" : "#ddd",
            borderRadius: 8,
          }}
        >
          <Ionicons
            name="apps-outline"
            color="white"
            size={60}
            // style={styles.icon}
          />
          {/* <Text>{darkMode ? "Light Mode" : "Dark Mode"}</Text> */}
        </View>
      </Pressable>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     // borderColor: "blue",
//     // borderWidth: 5,
//   },
// });

export default Header;
