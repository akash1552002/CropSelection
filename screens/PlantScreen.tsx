// import React from "react";
// import { View, Text, Image, ScrollView, StyleSheet, SafeAreaView } from "react-native";
// import irrigationData from "../assets/irrigation_data_detailed.json";

// const PlantScreen = ({ route }) => {
//   const { crop } = route.params || {};
//   const cropImages: { [key: string]: any } = {
//     Wheat: require("../assets/wheat1.jpeg"),
//     Rice: require("../assets/rice1.jpg"),
//     Maize: require("../assets/maize1.webp"),
//     Sugarcane: require("../assets/sugarcane1.jpg"),
//     Cotton: require("../assets/cotton.jpg"),
//     Barley: require("../assets/barley.jpg"),
//     Soybean: require("../assets/soybean.webp"),
//     Groundnut: require("../assets/groundnut.webp"),
//     Millets: require("../assets/millets.jpg"),
//     Chickpeas: require("../assets/chickpeas.jpg"),
//     Mustard: require("../assets/mustard.jpg"),
//     Banana: require("../assets/banana.jpg"),
//     Mango: require("../assets/Mangoes.webp"),
//     Tomato: require("../assets/tomato.jpeg"),
//     Potato: require("../assets/potato.webp"),
//     Onion: require("../assets/onion.jpg"),
//   };

//   if (!crop) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Error: No crop data found.</Text>
//       </View>
//     );
//   }

//   const irrigationInfo = irrigationData[crop.crop_name]?.irrigation || {
//     water_requirements: "No data available",
//     irrigation_method: "No data available",
//     recommended_frequency: "No data available",
//     seasonal_adjustments: "No data available",
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Image source={cropImages[crop.crop_name]} style={styles.image} />
//         <Text style={styles.title}>{crop.crop_name}</Text>

//         <View style={styles.section}>
//           <Text style={styles.label}>🌍 Best Regions:</Text>
//           <Text style={styles.text}>{crop.best_regions?.join(", ") || "N/A"}</Text>
//         </View>
//         <Text style={styles.text}>☀️ Sunlight: {crop.sunlight || "N/A"}</Text>
//         <Text style={styles.text}>💧 Water Needs: {crop.water_needs || "N/A"}</Text>
//         <Text style={styles.text}>🌱 Soil Type: {crop.soil_type?.join(", ") || "N/A"}</Text>
//         <Text style={styles.text}>⚖️ pH Level: {crop.ph_level || "N/A"}</Text>
//         <Text style={styles.text}>🌡️ Temperature: {crop.temperature || "N/A"}</Text>

//         <Text style={styles.sectionTitle}>📈 Market Information</Text>
//         <Text style={styles.text}>💰 Market Price: {crop.market_price || "N/A"}</Text>
//         <Text style={styles.text}>🔥 Demand: {crop.demand || "N/A"}</Text>
//         <Text style={styles.text}>🚢 Export Countries: {crop.export_countries?.join(", ") || "N/A"}</Text>

//         <Text style={styles.sectionTitle}>🐛 Pests</Text>
//         <Text style={styles.text}>{crop.pests?.join(", ") || "None"}</Text>

//         <Text style={styles.sectionTitle}>🦠 Diseases</Text>
//         {crop.diseases?.map((disease, index) => (
//           <View key={index} style={styles.diseaseCard}>
//             <Text style={styles.diseaseTitle}>{disease.name} ({disease.type})</Text>
//             <Text style={styles.text}>🩺 Symptoms: {disease.symptoms.join(", ")}</Text>
//             <Text style={styles.text}>🛡️ Prevention: {disease.prevention.join(", ")}</Text>
//           </View>
//         ))}

//         <Text style={styles.sectionTitle}>🌾 Growth Cycle</Text>
//         <Text style={styles.text}>⏳ Duration: {crop.growth_cycle?.growthDuration || "N/A"} days</Text>
//         {crop.growth_cycle?.growthStages?.map((stage, index) => (
//           <View key={index} style={styles.stageCard}>
//             <Text style={styles.stageTitle}>{stage.stage}</Text>
//             <Text style={styles.text}>📅 Day {stage.day}: {stage.activity}</Text>
//             <Text style={styles.alertText}>🔔 {stage.alert}</Text>
//           </View>
//         ))}

//         <Text style={styles.sectionTitle}>🌿 Farming Tips</Text>
//         {crop.farming_tips?.map((tip, index) => (
//           <Text key={index} style={styles.text}>✔️ {tip}</Text>
//         ))}

//         <Text style={styles.sectionTitle}>💦 Irrigation</Text>
//         <Text style={styles.text}><Text style={styles.bold}>Water Requirements:</Text> {irrigationInfo.water_requirements}</Text>
//         <Text style={styles.text}><Text style={styles.bold}>Irrigation Method:</Text> {irrigationInfo.irrigation_method}</Text>
//         <Text style={styles.text}><Text style={styles.bold}>Recommended Frequency:</Text> {irrigationInfo.recommended_frequency}</Text>
//         <Text style={styles.text}><Text style={styles.bold}>Seasonal Adjustments:</Text> {irrigationInfo.seasonal_adjustments}</Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#e9f5ea",
//     paddingTop:40,
//   },
//   container: {
//     flexGrow: 1,
//     padding: 20,
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     borderRadius: 15,
//     marginBottom: 15,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 15,
//     textAlign: "center",
//     color: "#2e7d32",
//   },
//   section: {
//     marginBottom: 10,
//   },
//   label: {
//     fontWeight: "bold",
//     fontSize: 16,
//     marginBottom: 2,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginTop: 20,
//     marginBottom: 8,
//     color: "#1b5e20",
//   },
//   text: {
//     fontSize: 16,
//     marginBottom: 6,
//     color: "#424242",
//   },
//   bold: {
//     fontWeight: "bold",
//   },
//   diseaseCard: {
//     backgroundColor: "#ffebee",
//     padding: 12,
//     borderRadius: 10,
//     marginVertical: 6,
//   },
//   diseaseTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 4,
//     color: "#c62828",
//   },
//   stageCard: {
//     backgroundColor: "#e3f2fd",
//     padding: 12,
//     borderRadius: 10,
//     marginVertical: 6,
//   },
//   stageTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 4,
//     color: "#1565c0",
//   },
//   alertText: {
//     color: "#d32f2f",
//     fontWeight: "bold",
//   },
// });

// export default PlantScreen;
import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import irrigationData from "../assets/irrigation_data_detailed.json"; // Ensure correct path
import { useNavigation } from "@react-navigation/native";

const PlantScreen = ({ route }) => {
  const navigation = useNavigation();
  const { crop } = route.params || {}; // Ensure crop exists
  const cropImages = {
    Wheat: require("../assets/wheat1.jpeg"),
    Rice: require("../assets/rice1.jpg"),
    Maize: require("../assets/maize1.webp"),
    Sugarcane: require("../assets/sugarcane1.jpg"),
    Cotton: require("../assets/cotton.jpg"),
    Barley: require("../assets/barley.jpg"),
    Soybean: require("../assets/soybean.webp"),
    Groundnut: require("../assets/groundnut.webp"),
    Millets: require("../assets/millets.jpg"),
    Chickpeas: require("../assets/chickpeas.jpg"),
    Mustard: require("../assets/mustard.jpg"),
    Banana: require("../assets/banana.jpg"),
    Mango: require("../assets/Mangoes.webp"),
    Tomato: require("../assets/tomato.jpeg"),
    Potato: require("../assets/potato.webp"),
    Onion: require("../assets/onion.jpg"),
  };

  if (!crop) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: No crop data found.</Text>
      </View>
    );
  }

  const irrigationInfo = irrigationData[crop.crop_name]?.irrigation || {
    water_requirements: "No data available",
    irrigation_method: "No data available",
    recommended_frequency: "No data available",
    seasonal_adjustments: "No data available",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={cropImages[crop.crop_name]} style={styles.image} />
      <Text style={styles.title}>{crop.crop_name}</Text>

      <Text style={styles.text}>🌍 Best Regions: {crop.best_regions?.join(", ") || "N/A"}</Text>
      <Text style={styles.text}>☀️ Sunlight: {crop.sunlight || "N/A"}</Text>
      <Text style={styles.text}>💧 Water Needs: {crop.water_needs || "N/A"}</Text>
      <Text style={styles.text}>🌱 Soil Type: {crop.soil_type?.join(", ") || "N/A"}</Text>
      <Text style={styles.text}>⚖️ pH Level: {crop.ph_level || "N/A"}</Text>
      <Text style={styles.text}>🌡️ Temperature: {crop.temperature || "N/A"}</Text>

      <Text style={styles.sectionTitle}>📈 Market Information</Text>
      <Text style={styles.text}>💰 Market Price: {crop.market_price || "N/A"}</Text>
      <Text style={styles.text}>🔥 Demand: {crop.demand || "N/A"}</Text>
      <Text style={styles.text}>🚢 Export Countries: {crop.export_countries?.join(", ") || "N/A"}</Text>

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

      <Text style={styles.sectionTitle}>🌾 Growth Cycle</Text>
      <Text style={styles.text}>⏳ Duration: {crop.growth_cycle?.growthDuration || "N/A"} days</Text>
      {crop.growth_cycle?.growthStages?.map((stage, index) => (
        <View key={index} style={styles.stageCard}>
          <Text style={styles.stageTitle}>{stage.stage}</Text>
          <Text style={styles.text}>📅 Day {stage.day}: {stage.activity}</Text>
          <Text style={styles.alertText}>🔔 {stage.alert}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>🌾 Farming Tips</Text>
      {crop.farming_tips?.map((tip, index) => (
        <Text key={index} style={styles.text}>✔️ {tip}</Text>
      ))}

      <Text style={styles.sectionTitle}>💦 Irrigation</Text>
      <Text style={styles.text}><Text style={styles.bold}>Water Requirements:</Text> {irrigationInfo.water_requirements}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Irrigation Method:</Text> {irrigationInfo.irrigation_method}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Recommended Frequency:</Text> {irrigationInfo.recommended_frequency}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Seasonal Adjustments:</Text> {irrigationInfo.seasonal_adjustments}</Text>

      <TouchableOpacity
        style={styles.scheduleButton}
        onPress={() => navigation.navigate("CropDailySchedule", { cropName: crop.crop_name })}
      >
        <Text style={styles.scheduleButtonText}>📅 Select For Cropping</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    paddingTop: 40,
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
  scheduleButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PlantScreen;
