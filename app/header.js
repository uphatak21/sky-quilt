import React from "react";
import { View, StyleSheet } from "react-native";
import ToggleSwitch from "./toggleSwitch";

const Header = ({ isEnabled, toggleSwitch }) => {
  return (
    <View style={styles.header}>
      <ToggleSwitch isEnabled={isEnabled} toggleSwitch={toggleSwitch} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 40,
    width: "95%",
  },
});

export default Header;
