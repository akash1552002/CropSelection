import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity, RefreshControl, StatusBar } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { fetchMarketPrices } from "../services/marketPriceService";
import { useTranslation } from "react-i18next";
import "../services/i18n";

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchPrices } from '../store/marketSlice';

type FilterType = "All" | "Gainers" | "Losers";

export default function MarketPriceScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { prices, loading, lastUpdated } = useSelector((state: RootState) => state.market);

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  useEffect(() => {
    if (prices.length === 0) {
      dispatch(fetchPrices());
    }
  }, [dispatch, prices.length]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchPrices()).then(() => setRefreshing(false));
  };

  const filteredPrices = useMemo(() => {
    let result = prices;

    // 1. Search Filter
    if (searchQuery) {
      result = result.filter(p => p.crop.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 2. Category Filter
    if (activeFilter === "Gainers") {
      result = result.filter(p => p.trend === "up");
    } else if (activeFilter === "Losers") {
      result = result.filter(p => p.trend === "down");
    }

    // 3. Sort by magnitude of change (optional, keeps most volatile at top)
    return result.sort((a, b) => parseFloat(b.change) - parseFloat(a.change));
  }, [prices, searchQuery, activeFilter]);

  const renderHeader = () => (
    <LinearGradient colors={["#1B5E20", "#388E3C"]} style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('market_trends')}</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#rgba(255,255,255,0.7)" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('search_placeholder') || "Search crop..."}
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {(["All", "Gainers", "Losers"] as FilterType[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {lastUpdated && (
        <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
      )}
    </LinearGradient>
  );

  const renderItem = ({ item }: { item: any }) => {
    const isUp = item.trend === "up";
    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconPlaceholder, { backgroundColor: isUp ? '#E8F5E9' : '#FFEBEE' }]}>
            <Text style={styles.iconText}>{item.crop.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.cropName}>{item.crop}</Text>
            <Text style={styles.marketName}>Mandi Price</Text>
          </View>
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.price}>₹{item.price}</Text>
          <View style={[styles.changeBadge, { backgroundColor: isUp ? '#E8F5E9' : '#FFEBEE' }]}>
            <Ionicons name={isUp ? "caret-up" : "caret-down"} size={12} color={isUp ? "#2E7D32" : "#D32F2F"} />
            <Text style={[styles.changeText, { color: isUp ? "#2E7D32" : "#D32F2F" }]}>
              {item.change}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      {renderHeader()}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <FlatList
          data={filteredPrices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2E7D32"]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No crops found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "white", flex: 1 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5252',
    marginRight: 4
  },
  liveText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: 'white', fontSize: 16 },

  filterRow: { flexDirection: 'row', marginBottom: 10 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  activeFilterChip: { backgroundColor: 'white' },
  filterText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  activeFilterText: { color: '#2E7D32', fontWeight: 'bold' },

  lastUpdated: { color: 'rgba(255,255,255,0.6)', fontSize: 10, textAlign: 'right', marginTop: 5 },

  list: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  iconPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  iconText: { fontSize: 20, fontWeight: 'bold', color: '#555' },
  cropName: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 2 },
  marketName: { fontSize: 12, color: "#999" },

  cardRight: { alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  changeText: { fontSize: 12, fontWeight: "bold", marginLeft: 2 },

  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 16 }
});
