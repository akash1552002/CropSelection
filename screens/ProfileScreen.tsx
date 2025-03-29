import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const PlantScreen = () => {
  const route = useRoute();
  const { crop } = route.params; // Get the crop details

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: crop.image }} style={styles.image} />
      <Text style={styles.title}>{crop.crop_name}</Text>
      <Text style={styles.subtitle}>Growth Duration: {crop.growth_cycle.growthDuration}</Text>

      {/* Display all details dynamically */}
      {Object.entries(crop).map(([key, value]) => (
        <View key={key} style={styles.detailContainer}>
          <Text style={styles.detailKey}>{key.replace(/_/g, " ")}:</Text>
          <Text style={styles.detailValue}>{JSON.stringify(value, null, 2)}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  detailContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 1,
  },
  detailKey: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailValue: {
    fontSize: 14,
    color: "#555",
  },
});

export default PlantScreen;
