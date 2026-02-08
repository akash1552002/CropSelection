import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    iconName?: keyof typeof Ionicons.glyphMap;
    backgroundColor?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    iconName,
    backgroundColor = "#4CAF50",
    style,
    textStyle,
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }, style]}
            onPress={onPress}
        >
            {iconName && <Ionicons name={iconName} size={24} color="white" style={styles.icon} />}
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    icon: {
        marginRight: 10,
    },
    text: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default CustomButton;
