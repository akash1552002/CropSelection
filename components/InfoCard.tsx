import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InfoCardProps {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    color?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, icon, color = "#4CAF50" }) => {
    return (
        <View style={styles.card}>
            <Ionicons name={icon} size={24} color={color} style={styles.icon} />
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value} numberOfLines={2}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        width: "48%", // 2 items per row with gap
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    icon: {
        marginBottom: 5,
    },
    label: {
        fontSize: 12,
        color: "#666",
        marginBottom: 2,
        textAlign: "center",
    },
    value: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
});

export default InfoCard;
