import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface WeatherCardProps {
    weather: any;
    loading: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, loading }) => {
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    if (!weather) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Could not fetch weather</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.weatherBox}>
                <Ionicons name="sunny" size={40} color="white" />
                <Text style={styles.weatherLocation}>
                    📍 {weather.name}, {weather.sys.country}
                </Text>
                <Text style={styles.weatherTemp}>🌡️ {weather.main.temp}°C</Text>
                <Text style={styles.weatherDesc}>
                    ⛅ {weather.weather[0].description}
                </Text>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "90%",
        alignItems: "center",
        marginVertical: 20,
    },
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
    weatherLocation: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginTop: 10,
    },
    weatherTemp: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFEB3B",
        marginVertical: 5,
    },
    weatherDesc: {
        fontSize: 16,
        fontStyle: "italic",
        color: "white",
        textTransform: "capitalize",
    },
    error: {
        fontSize: 16,
        color: "red",
    },
});

export default WeatherCard;
