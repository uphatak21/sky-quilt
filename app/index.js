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

// CITATION: Ed post, Assignment 2 (https://edstem.org/us/courses/47955/discussion/3616064)
const deviceMap = {
  [Device.DeviceType.PHONE]: "phone",
  [Device.DeviceType.TABLET]: "tablet",
  [Device.DeviceType.UNKNOWN]: "unknown",
  [Device.DeviceType.DESKTOP]: "desktop",
};
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Page() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [weatherData, setWeatherData] = useState(null);
  const [deviceType, setDeviceType] = useState(null);
  const [session, setSession] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const isTablet = deviceType === "tablet";

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    toggleDarkMode();
  };

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

  useEffect(() => {
    const fetchWeatherData = async () => {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      const location = await getCurrentPositionAsync({});
      const apiKey = "d18f6d6eefcef4b3a33f7f1511ae4d76";
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${apiKey}&units=imperial`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWeatherData();
  }, []);

  if (session && session.user) {
    return (
      <LinearGradient
        colors={darkMode ? Themes.dark.colors : Themes.light.colors}
        style={styles.container}
      >
        <SafeAreaView>
          <StatusBar barStyle={"light-content"} />
          <Header isEnabled={isEnabled} toggleSwitch={toggleSwitch} />
          <Text style={styles.title}>welcome to sky quilt.</Text>
          <View style={styles.smallContainer}>
            {weatherData ? (
              <>
                <Text style={styles.city}>{weatherData.name}</Text>
                <Text
                  style={styles.temperature}
                >{`${weatherData.main.temp} °F`}</Text>
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
                  pathname: "/pastSunsetsScreen",
                  params: {
                    isTablet: isTablet,
                    userId: session.user.id,
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
                  pathname: "/postSunsetScreen",
                  params: {
                    isTablet: isTablet,
                    userId: session.user.id,
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
                  <Text style={styles.buttonText}>today's sunset</Text>
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
        colors={darkMode ? Themes.dark.colors : Themes.light.colors}
        style={styles.container}
      >
        <StatusBar barStyle={"light-content"} />
        <Header isEnabled={isEnabled} toggleSwitch={toggleSwitch} />
        <Text style={styles.title}>welcome to sky quilt.</Text>
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
  },
  smallContainer: {
    justifyContent: "flex-start",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: windowHeight * 0.1,
    fontSize: windowWidth * 0.072,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
    textAlign: "center",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: windowHeight * 0.2,
  },
  buttonText: {
    color: "white",
    fontSize: windowWidth * 0.04,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: "100%",
    width: windowWidth * 0.3,
    flex: 1,
  },
});
