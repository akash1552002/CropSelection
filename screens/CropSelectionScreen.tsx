import React from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import cropData from "../assets/updated_combined_crop_data (3).json"; // Ensure the correct path

const CropSelection = () => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={Object.values(cropData)}
      keyExtractor={(item) => item.crop_name}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.crop_name}</Text>
          <Text style={styles.duration}>Duration: {item.growth_cycle?.growthDuration || "N/A"}</Text>

          {/* View Details Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("PlantScreen", { crop: item })}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  duration: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CropSelection;
