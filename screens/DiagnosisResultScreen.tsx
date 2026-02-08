import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

import { diagnosePlant, DiagnosisResult } from "../services/PlantDiagnosisService";

const DiagnosisResultScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { imageUri } = route.params;

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<DiagnosisResult | null>(null);

    useEffect(() => {
        analyzeImage();
    }, []);

    const analyzeImage = async () => {
        try {
            const diagnosis = await diagnosePlant(imageUri);
            setResult(diagnosis);
        } catch (error) {
            Alert.alert("Error", "Could not analyze image.");
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Image source={{ uri: imageUri }} style={styles.loadingImage} blurRadius={10} />
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.analyzingText}>Analyzing Leaf for Diseases...</Text>
                    <Text style={styles.waitText}>Checking AI Database...</Text>
                </View>
            </View>
        );
    }

    if (!result) return null;

    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUri }} style={styles.headerImage} />

            <Animatable.View animation="slideInUp" duration={500} style={styles.resultContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Header Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: result.isHealthy ? '#E8F5E9' : '#FFEBEE' }]}>
                        <Ionicons
                            name={result.isHealthy ? "checkmark-circle" : "alert-circle"}
                            size={24}
                            color={result.isHealthy ? "#2E7D32" : "#D32F2F"}
                        />
                        <Text style={[styles.statusText, { color: result.isHealthy ? "#2E7D32" : "#D32F2F" }]}>
                            {result.isHealthy ? "Healthy Plant" : "Disease Detected"}
                        </Text>
                    </View>

                    {/* Disease Name */}
                    <Text style={styles.diseaseTitle}>{result.diseaseName}</Text>
                    <Text style={styles.confidenceText}>Confidence: {Math.round(result.confidence * 100)}%</Text>

                    {/* Description */}
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.description}>{result.description}</Text>

                    {/* Treatments */}
                    <Text style={styles.sectionTitle}>Recommended Action</Text>
                    <View style={styles.treatmentBox}>
                        {result.treatment.map((step, index) => (
                            <View key={index} style={styles.treatmentItem}>
                                <View style={styles.bulletPoint} />
                                <Text style={styles.treatmentText}>{step}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.doneBtn}
                        onPress={() => navigation.navigate("Home" as never)}
                    >
                        <Text style={styles.doneBtnText}>Back to Dashboard</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Animatable.View>

            {/* Floating Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingImage: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.6
    },
    loadingOverlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 30,
        borderRadius: 20
    },
    analyzingText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20
    },
    waitText: {
        color: '#CCC',
        marginTop: 5
    },
    headerImage: {
        width: '100%',
        height: 350,
        resizeMode: 'cover'
    },
    resultContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: -40,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingTop: 30
    },
    scrollContent: {
        paddingBottom: 40
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 15
    },
    statusText: {
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 14
    },
    diseaseTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 5
    },
    confidenceText: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 10
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        marginBottom: 15
    },
    treatmentBox: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 15
    },
    treatmentItem: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-start'
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4CAF50',
        marginTop: 8,
        marginRight: 10
    },
    treatmentText: {
        fontSize: 15,
        color: '#424242',
        flex: 1,
        lineHeight: 22
    },
    doneBtn: {
        backgroundColor: '#1B5E20',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 30
    },
    doneBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default DiagnosisResultScreen;
