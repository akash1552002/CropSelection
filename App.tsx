import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/SplashScreen";
//import OnboardingScreen from "./src/screens/OnboardingScreen";
import HomeScreen from "./screens/HomeScreen";
// import MarketPriceScreen from "./screens/MarketPriceScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} /> */}
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Market" component={MarketPriceScreen} /> */}
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}
