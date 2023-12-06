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
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "./Supabase";
import Ionicons from "@expo/vector-icons/Ionicons";

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
          <Ionicons
            name="apps-outline"
            color="white"
            size={60}
            style={styles.icon}
          />
          {/* <Text>{darkMode ? "Light Mode" : "Dark Mode"}</Text> */}
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
  const [session, setSession] = useState(null);

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     console.log(session);
  //     setSession(session);
  //   });

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     setSession(session);
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  // Sign Up
  const signUp = async (email, password) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    return { user, error };
  };

  // Sign In
  const signIn = async (email, password) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    return { user, error };
  };

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Check Authentication Status
  const checkAuthStatus = () => {
    const user = supabase.auth.user();
    return user;
  };

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

  // if (!session) {
  //   return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  // }

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
              <Text style={styles.buttonText}>past sunsets</Text>
            </View>
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
});
