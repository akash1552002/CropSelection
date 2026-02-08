import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MarketPrice {
    id: string;
    crop: string;
    price: number;
    unit: string;
    trend: string;
    change: string;
}

interface MarketPriceComponentProps {
    prices: MarketPrice[];
    loading: boolean;
    onSeeAll?: () => void;
}

const MarketPriceComponent: React.FC<MarketPriceComponentProps> = ({ prices, loading, onSeeAll }) => {
    const renderItem = ({ item }: { item: MarketPrice }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.cropName}>{item.crop}</Text>
                <Ionicons
                    name={item.trend === "up" ? "trending-up" : item.trend === "down" ? "trending-down" : "remove"}
                    size={20}
                    color={item.trend === "up" ? "green" : item.trend === "down" ? "red" : "gray"}
                />
            </View>
            <Text style={styles.price}>₹{item.price}/{item.unit}</Text>
            <Text style={[styles.change, { color: item.trend === "up" ? "green" : item.trend === "down" ? "red" : "gray" }]}>
                {item.change}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.title}>📈 Live Market Prices</Text>
                {onSeeAll && (
                    <TouchableOpacity onPress={onSeeAll}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <Text>Loading prices...</Text>
            ) : (
                <FlatList
                    data={prices}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginVertical: 15,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2E7D32",
    },
    seeAll: {
        color: "#4CAF50",
        fontWeight: "bold",
    },
    list: {
        paddingRight: 20,
    },
    card: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 12,
        marginRight: 10,
        width: 140,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    cropName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2E7D32",
    },
    change: {
        fontSize: 14,
        marginTop: 2,
        fontWeight: "600",
    },
});

export default MarketPriceComponent;
