import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    icon?: keyof typeof Ionicons.glyphMap;
    initiallyOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, icon, initiallyOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);

    const toggleOpen = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={toggleOpen} activeOpacity={0.7}>
                <View style={styles.titleContainer}>
                    {icon && <Ionicons name={icon} size={20} color="#2E7D32" style={styles.icon} />}
                    <Text style={styles.title}>{title}</Text>
                </View>
                <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#666" />
            </TouchableOpacity>
            {isOpen && <View style={styles.content}>{children}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 10,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#fff", // ensure background color for shadow
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginRight: 10
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2E7D32",
    },
    content: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        backgroundColor: "#fafafa"
    },
});

export default AccordionItem;
