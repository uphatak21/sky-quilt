import React from "react";
import { Stack, Tabs } from "expo-router";
import { DarkModeProvider } from "../assets/Themes/DarkModeContext";

export default function Layout() {
  return (
    <DarkModeProvider>
      <Stack>
        <Stack.Screen options={{ headerShown: false }} name="index" />
        <Stack.Screen
          options={{
            headerTransparent: true,
            title: "",
            headerTintColor: "white",
          }}
          name="postSunsetScreen"
        />
        <Stack.Screen
          options={{
            headerTransparent: true,
            title: "",
            headerTintColor: "white",
          }}
          name="pastSunsetsScreen"
        />
        <Stack.Screen
          options={{
            headerTransparent: true,
            title: "",
            headerTintColor: "white",
          }}
          name="settings"
        />
      </Stack>
    </DarkModeProvider>
  );
}
