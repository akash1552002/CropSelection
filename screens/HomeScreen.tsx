import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { CameraView, useCameraPermissions } from "expo-camera";

const API_KEY = "49a307152c0bc597234983d212525161"; // Replace with your OpenWeather API key

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchWeather(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      alert("Error fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  // 📸 Handle Camera Permissions & Open Camera
  const handleOpenCamera = async () => {
    if (!cameraPermission?.granted) {
      const permissionResponse = await requestCameraPermission();
      if (!permissionResponse.granted) {
        Alert.alert("Permission Denied", "Camera access is required to scan plants.");
        return;
      }
    }
    setIsCameraOpen(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>👋 Welcome, Farmer!</Text>
      <Text style={styles.subtitle}>Select your crop and start monitoring</Text>

      {/* 🌤️ Weather Section */}
      <View style={styles.weatherContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : weather ? (
          <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.weatherBox}>
            <Ionicons name="sunny" size={40} color="white" />
            <Text style={styles.weatherLocation}>📍 {weather.name}, {weather.sys.country}</Text>
            <Text style={styles.weatherTemp}>🌡️ {weather.main.temp}°C</Text>
            <Text style={styles.weatherDesc}>⛅ {weather.weather[0].description}</Text>
          </LinearGradient>
        ) : (
          <Text style={styles.error}>Could not fetch weather</Text>
        )}
      </View>

      {/* 📸 Scan Plant Section */}
      <TouchableOpacity style={styles.scanButton} onPress={handleOpenCamera}>
        <Ionicons name="camera" size={24} color="white" />
        <Text style={styles.scanButtonText}>Scan Plant</Text>
      </TouchableOpacity>

      {/* 📷 Show Camera if Open */}
      {isCameraOpen && (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing="back">
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsCameraOpen(false)}
            >
              <Ionicons name="close-circle" size={40} color="white" />
            </TouchableOpacity>
          </CameraView>
        </View>
      )}

      {/* 🚀 Crop Selection Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CropSelectionScreen")}>
        <Ionicons name="leaf" size={24} color="white" />
        <Text style={styles.buttonText}>Select Crop</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F8E8", alignItems: "center", justifyContent: "center" },
  welcome: { fontSize: 26, fontWeight: "bold", color: "#2E7D32", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#4CAF50", marginBottom: 20, textAlign: "center" },

  // 🌤️ Weather Styles
  weatherContainer: { width: "90%", alignItems: "center", marginVertical: 20 },
  weatherBox: {
    width: "100%",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  weatherLocation: { fontSize: 18, fontWeight: "bold", color: "white", marginTop: 10 },
  weatherTemp: { fontSize: 24, fontWeight: "bold", color: "#FFEB3B", marginVertical: 5 },
  weatherDesc: { fontSize: 16, fontStyle: "italic", color: "white" },
  error: { fontSize: 16, color: "red" },

  // 📸 Scan Button
  scanButton: {
    flexDirection: "row",
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  scanButtonText: { color: "white", fontSize: 18, marginLeft: 10, fontWeight: "bold" },

  // 📷 Camera Styles
  cameraContainer: { width: "90%", height: 300, borderRadius: 10, overflow: "hidden", marginVertical: 10 },
  camera: { flex: 1, justifyContent: "center", alignItems: "center" },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    padding: 5,
  },

  // 🚀 Button Styles
  button: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: { color: "white", fontSize: 18, marginLeft: 10, fontWeight: "bold" },
});

export default HomeScreen;
