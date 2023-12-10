import React from "react";
import { View } from "react-native";
import ToggleSwitch from "./toggleSwitch";

const Header = ({ isEnabled, toggleSwitch }) => {
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
      <ToggleSwitch isEnabled={isEnabled} toggleSwitch={toggleSwitch} />
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
