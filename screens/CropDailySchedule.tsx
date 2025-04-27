import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import cropScheduleData from "../assets/full_crop_daily_schedule.json"; // ensure the correct path
import cropImages from "../assets/cropImage"; // optional: local crop images

const CropDailySchedule = ({ route }) => {
  const { cropName } = route.params;
  const crop = cropScheduleData.find((item) => item.crop_name === cropName);

  if (!crop) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No schedule found for {cropName}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.header}>
        {cropImages[cropName] && (
          <Image source={cropImages[cropName]} style={styles.cropIcon} />
        )}
        <Text style={styles.headerText}>{crop.crop_name} - Daily Growth Schedule</Text>
      </LinearGradient>

      <FlatList
        data={crop.daily_schedule}
        keyExtractor={(item) => item.day.toString()}
        renderItem={({ item }) => (
          <Animatable.View animation="fadeInUp" duration={600} style={styles.card}>
            <Text style={styles.day}>📅 Day {item.day}</Text>
            <Text style={styles.task}>🧪 Task: {item.task}</Text>
            <Text style={styles.category}>📂 Category: {item.category}</Text>
          </Animatable.View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  header: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  cropIcon: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  day: {
    fontSize: 18,
    fontWeight: "bold",
  },
  task: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  category: {
    fontSize: 15,
    color: "#607d8b",
    marginTop: 5,
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
});

export default CropDailySchedule;
