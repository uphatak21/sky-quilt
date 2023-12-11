import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import ToggleSwitch from "./toggleSwitch";

const windowWidth = Dimensions.get("window").width;

const Header = ({ isEnabled, toggleSwitch }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 40,
        width: "95%",
        // borderColor: "blue",
        // borderWidth: 5,
      }}
    >
      <ToggleSwitch
        // style={styles.switch}
        isEnabled={isEnabled}
        toggleSwitch={toggleSwitch}
      />
      {/* <Text style={styles.title}>welcome to sky quilt.</Text> */}
    </View>
  );
};

// const styles = StyleSheet.create({
//   //   container: {
//   //     flex: 1,
//   //     justifyContent: "center",
//   //     alignItems: "center",
//   //     // borderColor: "blue",
//   //     // borderWidth: 5,
//   //   },
//   title: {
//     // marginTop: windowHeight * 0.1,
//     fontSize: windowWidth * 0.072,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "white",
//     textAlign: "center",
//     // borderColor: "blue",
//     // borderWidth: 5,
//   },
// });

export default Header;
