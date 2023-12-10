import { useState, useEffect } from "react";
import supabase from "./Supabase";
import { StyleSheet, View, SafeAreaView, StatusBar } from "react-native";
import { Button, Text } from "react-native-elements";
import { useLocalSearchParams, router } from "expo-router";
import { Themes } from "../assets/Themes";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkMode } from "../assets/Themes/DarkModeContext";
import Auth from "./auth";

export default function Page() {
  // const [signedOut, setSignedOut] = useState(false);
  const params = useLocalSearchParams();
  const session = params.session;
  // const setSession = params.setSession;

  // useEffect(() => {
  //   try {
  //     supabase.auth.getSession().then(({ data: { session } }) => {
  //       setSession(session);
  //     });

  //     supabase.auth.onAuthStateChange((_event, session) => {
  //       setSession(session);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  console.log("params: ", params);
  console.log(params.session != null ? "session: true" : "session: false");
  const email = params.email;
  const { darkMode } = useDarkMode();
  // console.log(supabase.auth.user());
  if (session) {
    return <Auth />;
  } else {
    return (
      <LinearGradient
        colors={darkMode ? Themes.light.colors : Themes.dark.colors}
        style={styles.container}
      >
        <StatusBar barStyle={"light-content"} />
        <SafeAreaView>
          <View style={styles.container}>
            <View style={[styles.verticallySpaced, styles.mt20]}>
              <Text>Your email: {email}</Text>
            </View>

            <View style={styles.verticallySpaced}>
              <Button
                title="Sign Out"
                onPress={() => {
                  // console.log("before press: ", params.session);
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
