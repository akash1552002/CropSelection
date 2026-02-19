import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Platform, UIManager, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { fetchIrrigationData, getImageUrl } from "../services/api";

// Custom Components
import InfoCard from "../components/InfoCard";
import AccordionItem from "../components/AccordionItem";

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PlantScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { crop } = route.params || {};
  const [irrigationInfo, setIrrigationInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (crop) {
      loadIrrigationData();
    }
  }, [crop]);

  const loadIrrigationData = async () => {
    try {
      const data = await fetchIrrigationData(crop.crop_name);
      setIrrigationInfo(data);
    } catch (error) {
      console.log("Error loading irrigation data", error);
    } finally {
      setLoading(false);
    }
  };

  if (!crop) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={50} color="#e53935" />
        <Text style={styles.errorText}>Error: No crop data found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fallback if data not found or loading
  const finalIrrigation = irrigationInfo || (loading ? {
    water_requirements: "Loading...",
    irrigation_method: "Loading...",
    recommended_frequency: "Loading...",
    seasonal_adjustments: "Loading...",
  } : {
    water_requirements: "No data available",
    irrigation_method: "No data available",
    recommended_frequency: "No data available",
    seasonal_adjustments: "No data available",
  });

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <Image source={{ uri: getImageUrl(crop.image) || undefined }} style={styles.heroImage} />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{crop.crop_name}</Text>
          <Text style={styles.subtitle}>{crop.scientific_name}</Text>

          {/* Quick Info Grid */}
          <View style={styles.gridContainer}>
            <InfoCard label="Sunlight" value={crop.sunlight || "N/A"} icon="sunny" color="#FBC02D" />
            <InfoCard label="Water" value={crop.water_needs || "N/A"} icon="water" color="#039BE5" />
            <InfoCard label="Temperature" value={crop.temperature || "N/A"} icon="thermometer" color="#F4511E" />
            <InfoCard label="Soil Type" value={crop.soil_type?.join(", ") || "N/A"} icon="layers" color="#795548" />
            <InfoCard label="pH Level" value={crop.ph_level || "N/A"} icon="flask" color="#8E24AA" />
            <InfoCard label="Seasons" value={crop.best_regions?.join(", ") || "N/A"} icon="earth" color="#43A047" />
          </View>

          {/* Collapsible Sections */}
          <AccordionItem title="📈 Market Information" icon="trending-up">
            <Text style={styles.textLabel}>💰 Market Price: <Text style={styles.textValue}>{crop.market_price || "N/A"}</Text></Text>
            <Text style={styles.textLabel}>🔥 Demand: <Text style={styles.textValue}>{crop.demand || "N/A"}</Text></Text>
            <Text style={styles.textLabel}>🚢 Export: <Text style={styles.textValue}>{crop.export_countries?.join(", ") || "N/A"}</Text></Text>
          </AccordionItem>

          <AccordionItem title="🌾 Growth Cycle" icon="hourglass">
            <Text style={styles.textLabel}>⏳ Duration: {crop.growth_cycle?.growthDuration || "N/A"} days</Text>
            {crop.growth_cycle?.growthStages?.map((stage: any, index: number) => (
              <View key={index} style={styles.stageItem}>
                <View style={styles.stageHeader}>
                  <Text style={styles.stageTitle}>{stage.stage}</Text>
                  <Text style={styles.stageDay}>Day {stage.day}</Text>
                </View>
                <Text style={styles.textValue}>{stage.activity}</Text>
                {stage.alert && <Text style={styles.alertText}>🔔 {stage.alert}</Text>}
              </View>
            ))}
          </AccordionItem>

          <AccordionItem title="💦 Irrigation Details" icon="water">
            <Text style={styles.textLabel}>Method: <Text style={styles.textValue}>{finalIrrigation.irrigation_method}</Text></Text>
            <Text style={styles.textLabel}>Frequency: <Text style={styles.textValue}>{finalIrrigation.recommended_frequency}</Text></Text>
            <Text style={styles.textLabel}>Adjustments: <Text style={styles.textValue}>{finalIrrigation.seasonal_adjustments}</Text></Text>
          </AccordionItem>

          <AccordionItem title="🐛 Pests & Diseases" icon="bug">
            <Text style={styles.subHeader}>Pests</Text>
            <Text style={styles.textValue}>{crop.pests?.join(", ") || "None"}</Text>

            <Text style={[styles.subHeader, { marginTop: 10 }]}>Diseases</Text>
            {crop.diseases?.map((disease: any, index: number) => (
              <View key={index} style={styles.diseaseItem}>
                <Text style={styles.diseaseName}>{disease.name}</Text>
                <Text style={styles.textSmall}>🩺 {disease.symptoms.join(", ")}</Text>
                <Text style={styles.textSmall}>🛡️ {disease.prevention.join(", ")}</Text>
              </View>
            ))}
          </AccordionItem>

          <AccordionItem title="🌿 Farming Tips" icon="bulb">
            {crop.farming_tips?.map((tip: string, index: number) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={{ marginTop: 2 }} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </AccordionItem>

          {/* Space for the bottom button */}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={() => navigation.navigate("CropDailySchedule", { cropName: crop.crop_name })}
        >
          <Ionicons name="calendar" size={24} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.scheduleButtonText}>Select For Cropping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontSize: 18,
    color: "#e53935",
    marginTop: 10
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2E7D32",
    borderRadius: 8
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold"
  },
  heroImage: {
    width: "100%",
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
    marginTop: -20, // Overlap the image slightly
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 20
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  textLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontWeight: "bold"
  },
  textValue: {
    color: "#333",
    fontWeight: "normal",
    fontSize: 14
  },
  stageItem: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#2E7D32"
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  stageTitle: {
    fontWeight: 'bold',
    color: "#2E7D32"
  },
  stageDay: {
    color: "#666",
    fontSize: 12
  },
  alertText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic'
  },
  subHeader: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2E7D32",
    marginBottom: 5
  },
  diseaseItem: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#ffebee", // lighter red bg
    borderRadius: 6
  },
  diseaseName: {
    fontWeight: 'bold',
    color: "#c62828",
    marginBottom: 2
  },
  textSmall: {
    fontSize: 13,
    color: "#444",
    marginBottom: 2
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  tipText: {
    marginLeft: 10,
    color: "#333",
    fontSize: 14,
    flex: 1
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 10
  },
  scheduleButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PlantScreen;
