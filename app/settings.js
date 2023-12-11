import supabase from "./Supabase";
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Button, Text } from "react-native-elements";
import { useLocalSearchParams, router } from "expo-router";
import { Themes } from "../assets/Themes";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkMode } from "../assets/Themes/DarkModeContext";

const windowWidth = Dimensions.get("window").width;

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
          <View style={[styles.verticallySpaced]}>
            <Text style={styles.bodyText}>Your email: {email}</Text>
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
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  verticallySpaced: {
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: "stretch",
  },
  bodyText: {
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    fontSize: windowWidth * 0.04,
    // fontWeight: "bold",
  },
});
