// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, StatusBar, Dimensions } from "react-native";
// import {
//   requestForegroundPermissionsAsync,
//   getCurrentPositionAsync,
// } from "expo-location";
// import { LinearGradient } from "expo-linear-gradient";
// import { useDarkMode } from "../assets/Themes/DarkModeContext";
// import { Link } from "expo-router/";
// import * as Device from "expo-device";
// import { Themes } from "../assets/Themes";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import Header from "./header";
// import Auth from "./auth";
// import supabase from "./Supabase";
// import Account from "./account";

// <View style={styles.container}>
//   {/* <Text style={styles.title}>welcome to sky quilt.</Text> */}
//   {weatherData ? (
//     <>
//       <Text style={styles.city}>{weatherData.name}</Text>
//       <Text style={styles.temperature}>{`${(
//         weatherData.main.temp * 1.8 +
//         32
//       ).toFixed(2)} °F`}</Text>
//       <Text style={styles.description}>
//         {weatherData.weather[0].description}
//       </Text>
//     </>
//   ) : (
//     <Text style={styles.city}>fetching weather data...</Text>
//   )}
//   <View style={styles.buttonContainer}>
//     <Link
//       href={{
//         pathname: "/postSunsetScreen",
//         params: {
//           isTablet: isTablet,
//         },
//       }}
//     >
//       <View style={styles.button}>
//         <Ionicons
//           name="image-outline"
//           color="white"
//           size={60}
//           style={styles.icon}
//         />
//         <Text style={styles.buttonText}>post today's sunset</Text>
//       </View>
//     </Link>
//     <Link
//       href={{
//         pathname: "/pastSunsetsScreen",
//         params: {
//           isTablet: isTablet,
//         },
//       }}
//     >
//       <View style={styles.button}>
//         <Ionicons
//           name="apps-outline"
//           color="white"
//           size={60}
//           style={styles.icon}
//         />
//         <Text style={styles.buttonText}>past sunsets</Text>
//       </View>
//     </Link>
//     <Link
//       href={{
//         pathname: "/settings",
//         params: {
//           isTablet: isTablet,
//         },
//       }}
//     >
//       <View style={styles.button}>
//         <Ionicons
//           name="apps-outline"
//           color="white"
//           size={60}
//           style={styles.icon}
//         />
//         <Text style={styles.buttonText}>past sunsets</Text>
//       </View>
//     </Link>
//   </View>
// </View>;
