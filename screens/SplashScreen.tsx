import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
};

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home"); // Navigate to Home screen
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* 🔥 Lottie Animation */}
      <LottieView
        source={require("../assets/loader2.json")} // Your animation file
        autoPlay
        loop
        style={styles.animation}
      />

      {/* 🌟 App Name & Tagline */}
      <Text style={styles.title}>Crop Selection App</Text>
      <Text style={styles.tagline}>Empowering Farmers, Transforming Agriculture</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50", // Solid Green Background
  },
  animation: {
    width: width * 0.6,
    height: width * 0.6,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
  tagline: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
});
