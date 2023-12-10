import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkMode } from "../assets/Themes/DarkModeContext";
import { Link } from "expo-router/";
import * as Device from "expo-device";
import { Themes } from "../assets/Themes";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "./header";
import Auth from "./auth";
import supabase from "./Supabase";

// add safe area view?

const deviceMap = {
  [Device.DeviceType.PHONE]: "phone",
  [Device.DeviceType.TABLET]: "tablet",
  [Device.DeviceType.UNKNOWN]: "unknown",
  [Device.DeviceType.DESKTOP]: "desktop",
};
const windowWidth = Dimensions.get("window").width;

export default function Page() {
  const { darkMode } = useDarkMode();
  const [weatherData, setWeatherData] = useState(null);
  // Device type
  const [deviceType, setDeviceType] = useState(null);
  const [session, setSession] = useState(null);
  // console.log("session in index", session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    Device.getDeviceTypeAsync().then((deviceType) => {
      setDeviceType(deviceMap[deviceType]);
    });
  }, []);
  const isTablet = deviceType === "tablet";

  useEffect(() => {
    // Expo docs for Location
    const fetchWeatherData = async () => {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await getCurrentPositionAsync({});
      //   console.log("location: ", location);
      const apiKey = "d18f6d6eefcef4b3a33f7f1511ae4d76";
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setWeatherData(data);
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWeatherData();
  }, []);

  if (session && session.user) {
    return (
      <LinearGradient
        colors={darkMode ? Themes.light.colors : Themes.dark.colors}
        style={styles.container}
      >
        <StatusBar barStyle={"light-content"} />
        <SafeAreaView>
          <Header />
          <Text style={styles.title}>welcome to sky quilt.</Text>
          <View style={styles.container}>
            {/* <Text style={styles.title}>welcome to sky quilt.</Text> */}
            {weatherData ? (
              <>
                <Text style={styles.city}>{weatherData.name}</Text>
                <Text style={styles.temperature}>{`${(
                  weatherData.main.temp * 1.8 +
                  32
                ).toFixed(2)} °F`}</Text>
                <Text style={styles.description}>
                  {weatherData.weather[0].description}
                </Text>
              </>
            ) : (
              <Text style={styles.city}>fetching weather data...</Text>
            )}
            <View style={styles.buttonContainer}>
              <Link
                href={{
                  pathname: "/postSunsetScreen",
                  params: {
                    isTablet: isTablet,
                    userId: session.user.id,
                    session: session,
                  },
                }}
              >
                <View style={styles.button}>
                  <Ionicons
                    name="image-outline"
                    color="white"
                    size={60}
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>post today's sunset</Text>
                </View>
              </Link>
              <Link
                href={{
                  pathname: "/pastSunsetsScreen",
                  params: {
                    isTablet: isTablet,
                    userId: session.user.id,
                    session: session,
                  },
                }}
              >
                <View style={styles.button}>
                  <Ionicons
                    name="apps-outline"
                    color="white"
                    size={60}
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>my quilt</Text>
                </View>
              </Link>
              <Link
                href={{
                  pathname: "/settings",
                  params: {
                    isTablet: isTablet,
                    email: session.user.email,
                  },
                }}
              >
                <View style={styles.button}>
                  <Ionicons
                    name="settings"
                    color="white"
                    size={60}
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>settings</Text>
                </View>
              </Link>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  } else {
    return (
      <LinearGradient
        colors={darkMode ? Themes.light.colors : Themes.dark.colors}
        style={styles.container}
      >
        <StatusBar barStyle={"light-content"} />
        <Header />
        <Text style={styles.title}>
          {session ? "make your account." : "welcome to sky quilt."}
        </Text>
        <Auth />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "blue",
    // borderWidth: 5,
  },
  title: {
    fontSize: windowWidth * 0.072,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  city: {
    fontSize: windowWidth * 0.06,
    marginBottom: 10,
    color: "white",
  },
  temperature: {
    fontSize: windowWidth * 0.05,
    marginBottom: 5,
    color: "white",
  },
  description: {
    fontSize: windowWidth * 0.05,
    color: "white",
  },
  buttonContainer: {
    marginTop: 60,
    // borderColor: "yellow",
    // borderWidth: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // height: "20%",
    // flex: 1,
  },
  buttonText: {
    color: "white",
  },
  button: {
    // borderRadius: 90,
    // backgroundColor: "white",
    // flexDirection: "column",
    // flex: 1,
    // width: "40%",
    // borderColor: "blue",
    // borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    // borderRadius: 50,
    // borderColor: "blue",
    // borderWidth: 5,
    // resizeMode: "contain",
  },
  // container: {
  //   marginTop: 40,
  //   padding: 12,
  // },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
