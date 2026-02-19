import { Alert } from "react-native";

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

export const fetchWeatherData = async (lat: number, lon: number) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        Alert.alert("Error", "Could not fetch weather data.");
        return null;
    }
};
