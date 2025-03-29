import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import irrigationData from "../assets/irrigation_data_detailed.json"; // Ensure correct path

const PlantScreen = ({ route }) => {
  const { crop } = route.params || {}; // Ensure crop exists

  if (!crop) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: No crop data found.</Text>
      </View>
    );
  }

  // Fetch irrigation details based on the crop name
  const irrigationInfo = irrigationData[crop.crop_name]?.irrigation || {
    water_requirements: "No data available",
    irrigation_method: "No data available",
    recommended_frequency: "No data available",
    seasonal_adjustments: "No data available",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Crop Image */}
      <Image source={{ uri: crop.image }} style={styles.image} />
      <Text style={styles.title}>{crop.crop_name}</Text>

      {/* Crop Basic Info */}
      <Text style={styles.text}>🌍 Best Regions: {crop.best_regions?.join(", ") || "N/A"}</Text>
      <Text style={styles.text}>☀️ Sunlight: {crop.sunlight || "N/A"}</Text>
      <Text style={styles.text}>💧 Water Needs: {crop.water_needs || "N/A"}</Text>
      <Text style={styles.text}>🌱 Soil Type: {crop.soil_type?.join(", ") || "N/A"}</Text>
      <Text style={styles.text}>⚖️ pH Level: {crop.ph_level || "N/A"}</Text>
      <Text style={styles.text}>🌡️ Temperature: {crop.temperature || "N/A"}</Text>

      {/* Market Data */}
      <Text style={styles.sectionTitle}>📈 Market Information</Text>
      <Text style={styles.text}>💰 Market Price: {crop.market_price || "N/A"}</Text>
      <Text style={styles.text}>🔥 Demand: {crop.demand || "N/A"}</Text>
      <Text style={styles.text}>🚢 Export Countries: {crop.export_countries?.join(", ") || "N/A"}</Text>

      {/* Pests & Diseases */}
      <Text style={styles.sectionTitle}>🐛 Pests</Text>
      <Text style={styles.text}>{crop.pests?.join(", ") || "None"}</Text>

      <Text style={styles.sectionTitle}>🦠 Diseases</Text>
      {crop.diseases?.map((disease, index) => (
        <View key={index} style={styles.diseaseCard}>
          <Text style={styles.diseaseTitle}>{disease.name} ({disease.type})</Text>
          <Text style={styles.text}>🩺 Symptoms: {disease.symptoms.join(", ")}</Text>
          <Text style={styles.text}>🛡️ Prevention: {disease.prevention.join(", ")}</Text>
        </View>
      ))}

      {/* Growth Cycle */}
      <Text style={styles.sectionTitle}>🌾 Growth Cycle</Text>
      <Text style={styles.text}>⏳ Duration: {crop.growth_cycle?.growthDuration || "N/A"} days</Text>
      {crop.growth_cycle?.growthStages?.map((stage, index) => (
        <View key={index} style={styles.stageCard}>
          <Text style={styles.stageTitle}>{stage.stage}</Text>
          <Text style={styles.text}>📅 Day {stage.day}: {stage.activity}</Text>
          <Text style={styles.alertText}>🔔 {stage.alert}</Text>
        </View>
      ))}

      {/* Farming Tips */}
      <Text style={styles.sectionTitle}>🌾 Farming Tips</Text>
      {crop.farming_tips?.map((tip, index) => (
        <Text key={index} style={styles.text}>✔️ {tip}</Text>
      ))}

      {/* Irrigation Info */}
      <Text style={styles.sectionTitle}>💦 Irrigation</Text>
      <Text style={styles.text}><Text style={styles.bold}>Water Requirements:</Text> {irrigationInfo.water_requirements}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Irrigation Method:</Text> {irrigationInfo.irrigation_method}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Recommended Frequency:</Text> {irrigationInfo.recommended_frequency}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Seasonal Adjustments:</Text> {irrigationInfo.seasonal_adjustments}</Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  diseaseCard: {
    backgroundColor: "#ffcccc",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  diseaseTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stageCard: {
    backgroundColor: "#e6f7ff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  alertText: {
    color: "#d9534f",
    fontWeight: "bold",
  },
});

export default PlantScreen;
