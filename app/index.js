import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  Dimensions,
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

const deviceMap = {
  [Device.DeviceType.PHONE]: "phone",
  [Device.DeviceType.TABLET]: "tablet",
  [Device.DeviceType.UNKNOWN]: "unknown",
  [Device.DeviceType.DESKTOP]: "desktop",
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Header = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 40,
        width: "100%",
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
          <Text>{darkMode ? "Light Mode" : "Dark Mode"}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default function Page() {
  const { darkMode } = useDarkMode();
  const [weatherData, setWeatherData] = useState(null);

  // Device type
  const [deviceType, setDeviceType] = useState(null);

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

  return (
    <LinearGradient
      colors={darkMode ? Themes.light.colors : Themes.dark.colors}
      style={styles.container}
    >
      <StatusBar barStyle={"light-content"} />
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>welcome to sky quilt.</Text>
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
              },
            }}
          >
            <Text>post a sunset</Text>
          </Link>
          <Link
            href={{
              pathname: "/pastSunsetsScreen",
              params: {
                isTablet: isTablet,
              },
            }}
          >
            <Text>past sunsets</Text>
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 20,
  },
  button: {
    borderRadius: 90,
    backgroundColor: "white",
  },
});
