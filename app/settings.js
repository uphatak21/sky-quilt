import { useState, useEffect } from "react";
import supabase from "./Supabase";
import { StyleSheet, View, SafeAreaView, StatusBar } from "react-native";
import { Button, Text } from "react-native-elements";
import { useLocalSearchParams, router } from "expo-router";
import { Themes } from "../assets/Themes";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkMode } from "../assets/Themes/DarkModeContext";

export default function Page() {
  const { isTablet, email } = useLocalSearchParams();
  const { darkMode } = useDarkMode();

  return (
    <LinearGradient
      colors={darkMode ? Themes.dark.colors : Themes.light.colors}
      style={styles.container}
    >
      <SafeAreaView>
        <StatusBar barStyle={"light-content"} />
        <View style={styles.container}>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Text>Your email: {email}</Text>
          </View>

          <View style={styles.verticallySpaced}>
            <Button
              title="Sign Out"
              onPress={() => {
                supabase.auth.signOut();
                router.replace("/");
              }}
            />
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
    paddingTop: 30,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
