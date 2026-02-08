import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  StatusBar,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

import cropData from "../assets/updated_combined_crop_data (3).json";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 25;

const CropSelection = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCrops, setFilteredCrops] = useState(Object.values(cropData));

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

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = Object.values(cropData).filter((item) =>
        item.crop_name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCrops(filtered);
    } else {
      setFilteredCrops(Object.values(cropData));
    }
  };

  const renderHeader = () => (
    <LinearGradient colors={["#1B5E20", "#4CAF50"]} style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Crop</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
        <TextInput
          placeholder="Search crops..."
          placeholderTextColor="#9E9E9E"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      delay={index * 100}
      useNativeDriver
      style={styles.cardContainer}
    >
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("PlantScreen", { crop: item })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={cropImages[item.crop_name]}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={12} color="white" />
            <Text style={styles.durationText}>{item.growth_cycle?.growthDuration} Days</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.crop_name}</Text>
          <TouchableOpacity style={styles.arrowButton}>
            <Ionicons name="arrow-forward-circle" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      {renderHeader()}

      <FlatList
        data={filteredCrops}
        numColumns={2}
        keyExtractor={(item) => item.crop_name}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No crops found. Try a different search.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  backButton: {
    padding: 4
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    margin: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  durationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4
  },
  cardContent: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1
  },
  arrowButton: {
    padding: 2
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 10
  }
});

export default CropSelection;
