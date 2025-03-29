import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import Screens
import SplashScreen from "../screens/SplashScreen";
import TabNavigator from "./TabNavigator"; // Import the TabNavigator

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Tabs" component={TabNavigator} /> {/* ✅ Register Tabs properly */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
