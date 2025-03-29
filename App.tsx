import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Icons for the bottom tab

// Import Screens
import SplashScreen from "./screens/SplashScreen";
import HomeScreen from "./screens/HomeScreen";
import CropSelectionScreen from "./screens/CropSelectionScreen";
import WeatherScreen from "./screens/WeatherScreen";
import MarketPricesScreen from "./screens/MarketPriceScreen";
import CropHealthScreen from "./screens/CropHealthScreen";
import PlantScreen from "./screens/PlantScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CropSelectionScreen" component={CropSelectionScreen} />
        <Stack.Screen name="Weather" component={WeatherScreen} />
        <Stack.Screen name="MarketPrices" component={MarketPricesScreen} />
        <Stack.Screen name="CropHealth" component={CropHealthScreen} />
        <Stack.Screen name="PlantScreen" component={PlantScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
