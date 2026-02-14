
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, FlatList, Dimensions, StatusBar, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";

// Custom Services
import { fetchWeatherData } from "../services/weatherService";
import { fetchMarketPrices } from "../services/marketPriceService";

// Import crop data
import cropScheduleDataRaw from "../assets/full_crop_daily_schedule.json";

// Types
interface ActiveCrop {
  cropName: string;
  sowingDate: Date;
  currentDay: number;
  currentWeek: number;
  growthDuration: number;
}

const { width } = Dimensions.get('window');

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

import { useTranslation } from "react-i18next";
import "../services/i18n"; // Ensure i18n is initialized
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchPrices } from '../store/marketSlice';

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { prices: marketPrices, loading: loadingMarket } = useSelector((state: RootState) => state.market);

  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [username, setUsername] = useState<string | null>("Farmer");
  const [activeCrops, setActiveCrops] = useState<ActiveCrop[]>([]);

  useEffect(() => {
    (async () => {
      // 1. Get Location and Weather
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoadingWeather(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      loadWeather(location.coords.latitude, location.coords.longitude);

      // 2. Load Market Prices (Redux)
      if (marketPrices.length === 0) {
        dispatch(fetchPrices());
      }
    })();
  }, [dispatch]); // Added dispatch to dependency array

  useFocusEffect(
    useCallback(() => {
      loadActiveCrops();
    }, [])
  );

  const loadActiveCrops = async () => {
    try {
      const loadedCrops: ActiveCrop[] = [];
      for (const cropData of cropScheduleDataRaw) {
        const storedDate = await AsyncStorage.getItem(`sowingDate_${cropData.crop_name} `);
        if (storedDate) {
          const sowingDate = new Date(storedDate);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - sowingDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const currentWeek = Math.ceil(diffDays / 7);
          loadedCrops.push({
            cropName: cropData.crop_name,
            sowingDate: sowingDate,
            currentDay: diffDays,
            currentWeek: currentWeek,
            growthDuration: cropData.growthDuration
          });
        }
      }
      setActiveCrops(loadedCrops);
    } catch (e) {
      console.log("Error loading active crops:", e);
    }
  };

  const loadWeather = async (lat: number, lon: number) => {
    const data = await fetchWeatherData(lat, lon);
    setWeather(data);
    setLoadingWeather(false);
  };

  // Removed loadMarketPrices function as it is replaced by Redux

  const handleOpenCamera = async () => {
    navigation.navigate("ScanPlant");
  };

  const renderHeader = () => (
    <LinearGradient colors={["#1B5E20", "#4CAF50"]} style={styles.headerGradient}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
          <Text style={styles.greetingText}>{t('greeting')}, {username}</Text>
          <Text style={styles.subtitle}>{t('welcome_subtitle')}</Text>
        </View>
        <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>

      {/* Weather Snapshot */}
      {weather && (
        <TouchableOpacity onPress={() => navigation.navigate("Weather")} style={styles.weatherSnapshot}>
          <View style={styles.weatherInfo}>
            <Ionicons name={weather.weather[0].main === 'Rain' ? "rainy" : "partly-sunny"} size={24} color="#FFF" />
            <Text style={styles.weatherTemp}>{Math.round(weather.main.temp)}°C</Text>
            <Text style={styles.weatherDesc}>{weather.weather[0].main}</Text>
          </View>
          <View style={styles.weatherLocation}>
            <Ionicons name="location-sharp" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.locationText}>{weather.name}</Text>
          </View>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );

  const renderQuickActions = () => (
    <View style={styles.actionsGrid}>
      <TouchableOpacity style={styles.actionItem} onPress={handleOpenCamera}>
        <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
          <MaterialCommunityIcons name="camera-iris" size={28} color="#2E7D32" />
        </View>
        <Text style={styles.actionLabel}>{t('scan_plant')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("CropSelectionScreen")}>
        <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
          <MaterialCommunityIcons name="sprout" size={28} color="#1565C0" />
        </View>
        <Text style={styles.actionLabel}>{t('new_crop')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("ExpenseManager")}>
        <View style={[styles.actionIcon, { backgroundColor: '#FFEBEE' }]}>
          <MaterialCommunityIcons name="finance" size={28} color="#D32F2F" />
        </View>
        <Text style={styles.actionLabel}>{t('finances')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("MarketPrices")}>
        <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
          <MaterialCommunityIcons name="chart-line" size={28} color="#E65100" />
        </View>
        <Text style={styles.actionLabel}>{t('markets')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("Calculator")}>
        <View style={[styles.actionIcon, { backgroundColor: '#E1F5FE' }]}>
          <MaterialCommunityIcons name="calculator-variant" size={28} color="#0288D1" />
        </View>
        <Text style={styles.actionLabel}>{t('calculator')}</Text>
      </TouchableOpacity>


    </View>
  );

  const renderActiveCrops = () => {
    if (activeCrops.length === 0) return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>{t('start_farming')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CropSelectionScreen")} style={styles.emptyStateBtn}>
          <Text style={styles.emptyStateBtnText}>{t('select_crop')}</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('my_crops')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("CropSelectionScreen")}>
            <Text style={styles.seeAllText}>Add +</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={activeCrops}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
          keyExtractor={item => item.cropName}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cropCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("CropDailySchedule", { cropName: item.cropName })}
            >
              <Image source={cropImages[item.cropName]} style={styles.cropImage} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.cropOverlay}>
                <Text style={styles.cropName}>{item.cropName}</Text>
                <View style={styles.cropProgressRow}>
                  <Text style={styles.cropProgressText}>Day {item.currentDay}</Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(100, (item.currentDay / item.growthDuration) * 100)}%` }]} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

      {/* Main Scroll Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {renderHeader()}

        {/* Overlapping Content Container */}
        <View style={styles.contentContainer}>
          {renderQuickActions()}
          {renderActiveCrops()}

          {/* Market Snapshot */}
          <View style={styles.marketSection}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.sectionTitle}>{t('market_trends')}</Text>
                <View style={{ backgroundColor: '#FFEBEE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 10, borderWidth: 1, borderColor: '#FFCDD2' }}>
                  <Text style={{ color: '#D32F2F', fontSize: 10, fontWeight: 'bold' }}>LIVE 🔴</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("MarketPrices")}>
                <Text style={styles.seeAllText}>{t('see_all')}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
              {loadingMarket ? (
                <ActivityIndicator size="small" color="#4CAF50" style={{ marginLeft: 20 }} />
              ) : (
                marketPrices.slice(0, 5).map((item: any, index: number) => (
                  <View key={index} style={styles.marketCard}>
                    <View style={styles.marketIcon}>
                      <Text style={{ fontSize: 18 }}>{item.trend === 'up' ? '📈' : '📉'}</Text>
                    </View>
                    <View>
                      <Text style={styles.marketCrop}>{item.crop}</Text>
                      <Text style={styles.marketPrice}>₹{item.price}</Text>
                    </View>
                    <Text style={[styles.marketChange, { color: item.trend === 'up' ? '#4CAF50' : '#F44336' }]}>
                      {item.change}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Camera Modal Overlay Removed - Using ScanPlantScreen instead */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 80, // Extra padding for overlap
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 5
  },
  dateText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  profileIcon: {
    opacity: 0.9
  },
  weatherSnapshot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
    marginRight: 8
  },
  weatherDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500'
  },
  weatherLocation: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 4
  },
  contentContainer: {
    marginTop: -50, // Overlap effect
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#424242'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121'
  },
  seeAllText: {
    color: '#4CAF50',
    fontWeight: '600'
  },
  cropCard: {
    width: 200,
    height: 250,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eee',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  cropImage: {
    width: '100%',
    height: '100%'
  },
  cropOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'flex-end',
    padding: 15
  },
  cropName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  cropProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cropProgressText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600'
  },
  progressBarBg: {
    width: 80,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2
  },
  marketSection: {
    marginTop: 25
  },
  marketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 160,
    elevation: 2,
    marginBottom: 10
  },
  marketIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  marketCrop: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  marketPrice: {
    fontSize: 12,
    color: '#757575'
  },
  marketChange: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: 'bold'
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  emptyStateText: {
    color: '#757575',
    marginBottom: 10
  },
  emptyStateBtn: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  emptyStateBtnText: {
    color: '#2E7D32',
    fontWeight: 'bold'
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 100
  },
  camera: {
    flex: 1
  },
  closeCameraBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25
  }
});

export default HomeScreen;
