import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import Screens
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import CropSelectionScreen from "../screens/CropSelectionScreen";
import WeatherScreen from "../screens/WeatherScreen";
import MarketPricesScreen from "../screens/MarketPriceScreen";
import CropHealthScreen from "../screens/CropHealthScreen";
import PlantScreen from "../screens/PlantScreen";
import CropDailySchedule from "../screens/CropDailySchedule";
import ScanPlantScreen from "../screens/ScanPlantScreen";
import DiagnosisResultScreen from "../screens/DiagnosisResultScreen";
import ExpenseManagerScreen from "../screens/ExpenseManagerScreen";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import CalculatorScreen from "../screens/CalculatorScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CropSelectionScreen" component={CropSelectionScreen} />
        <Stack.Screen name="Weather" component={WeatherScreen} />
        <Stack.Screen name="MarketPrices" component={MarketPricesScreen} />
        <Stack.Screen name="CropHealth" component={CropHealthScreen} />
        <Stack.Screen name="PlantScreen" component={PlantScreen} />
        <Stack.Screen name="CropDailySchedule" component={CropDailySchedule} />
        <Stack.Screen name="ScanPlant" component={ScanPlantScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DiagnosisResult" component={DiagnosisResultScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ExpenseManager" component={ExpenseManagerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
