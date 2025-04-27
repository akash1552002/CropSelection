import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import cropData from "../assets/updated_combined_crop_data (3).json";

const { width } = Dimensions.get("window");

const CropSelection = () => {
  const navigation = useNavigation();
  const cropImages: { [key: string]: any } = {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>🌿 Select Your Crop</Text>
      <FlatList
        data={Object.values(cropData)}
        numColumns={2}
        keyExtractor={(item) => item.crop_name}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={cropImages[item.crop_name]}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.name}>{item.crop_name}</Text>
            <Text style={styles.duration}>
              ⏳ {item.growth_cycle?.growthDuration || "N/A"} Days
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("PlantScreen", { crop: item })
              }
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const CARD_WIDTH = width / 2 - 30;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f8f5",
    paddingTop: 40, 

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 15,
    textAlign: "center",
    color: "#2E7D32",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    margin: 10,
    padding: 15,
    width: CARD_WIDTH,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  duration: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default CropSelection;
