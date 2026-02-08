import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ScrollViewBase } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { CalculatorService, Unit, Stage, FertilizerResult } from "../services/CalculatorService";

const CROPS = ["Wheat", "Rice", "Maize", "Sugarcane", "Cotton", "Tomato", "Potato"];
const STAGES: Stage[] = ['Basal (Sowing)', 'Vegetative (20-40 Days)', 'Flowering', 'Fruiting'];

import { useTranslation } from "react-i18next";
import "../services/i18n";

const CalculatorScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [crop, setCrop] = useState("Wheat");
    const [landSize, setLandSize] = useState("");
    const [unit, setUnit] = useState<Unit>("Acre");
    const [stage, setStage] = useState<Stage>("Basal (Sowing)");
    const [result, setResult] = useState<{ fert: FertilizerResult; water: string } | null>(null);

    const handleCalculate = () => {
        if (!landSize) return;
        const size = parseFloat(landSize);
        if (isNaN(size)) return;

        const fert = CalculatorService.calculateFertilizer(crop, size, unit);
        const water = CalculatorService.getWaterAdvice(crop, stage);
        setResult({ fert, water });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={["#0288D1", "#03A9F4"]} style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('calculator')}</Text>
                    <View style={{ width: 24 }} />
                </View>
                <Text style={styles.headerSubtitle}>{t('estimator_subtitle')}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Input Card */}
                <View style={styles.card}>
                    <Text style={styles.label}>{t('select_crop')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                        {CROPS.map(c => (
                            <TouchableOpacity
                                key={c}
                                style={[styles.chip, crop === c && styles.activeChip]}
                                onPress={() => { setCrop(c); setResult(null); }}
                            >
                                <Text style={[styles.chipText, crop === c && styles.activeChipText]}>{c}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={styles.label}>{t('land_size')}</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="e.g. 2.5"
                            value={landSize}
                            onChangeText={setLandSize}
                        />
                        <View style={styles.unitToggle}>
                            <TouchableOpacity
                                style={[styles.unitBtn, unit === 'Acre' && styles.activeUnit]}
                                onPress={() => setUnit('Acre')}
                            >
                                <Text style={[styles.unitText, unit === 'Acre' && styles.activeUnitText]}>Acre</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.unitBtn, unit === 'Hectare' && styles.activeUnit]}
                                onPress={() => setUnit('Hectare')}
                            >
                                <Text style={[styles.unitText, unit === 'Hectare' && styles.activeUnitText]}>Hectare</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.label}>{t('crop_stage')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                        {STAGES.map(s => (
                            <TouchableOpacity
                                key={s}
                                style={[styles.chip, stage === s && styles.activeChip]}
                                onPress={() => { setStage(s); setResult(null); }}
                            >
                                <Text style={[styles.chipText, stage === s && styles.activeChipText]}>{s.split(' ')[0]}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.calcBtn} onPress={handleCalculate}>
                        <Text style={styles.calcBtnText}>{t('calculate')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Results Section */}
                {result && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.sectionTitle}>{t('recommended_dosage')}</Text>

                        <View style={styles.fertilizerGrid}>
                            <View style={styles.fertItem}>
                                <View style={[styles.circle, { backgroundColor: '#E3F2FD' }]}>
                                    <Text style={styles.fertValue}>{result.fert.urea} kg</Text>
                                </View>
                                <Text style={styles.fertLabel}>Urea (N)</Text>
                            </View>
                            <View style={styles.fertItem}>
                                <View style={[styles.circle, { backgroundColor: '#FFF3E0' }]}>
                                    <Text style={styles.fertValue}>{result.fert.dap} kg</Text>
                                </View>
                                <Text style={styles.fertLabel}>DAP (P)</Text>
                            </View>
                            <View style={styles.fertItem}>
                                <View style={[styles.circle, { backgroundColor: '#FFKEY' }]}>
                                    <Text style={styles.fertValue}>{result.fert.mop} kg</Text>
                                </View>
                                <Text style={styles.fertLabel}>MOP (K)</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>{t('water_management')}</Text>
                        <View style={styles.waterCard}>
                            <Ionicons name="water" size={24} color="#0288D1" />
                            <Text style={styles.waterText}>{result.water}</Text>
                        </View>
                    </View>
                )}

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA"
    },
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        marginTop: 5,
        marginLeft: 40
    },
    content: {
        padding: 20
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 10,
        marginTop: 10
    },
    chipRow: {
        flexDirection: 'row',
        marginBottom: 10
    },
    chip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    activeChip: {
        backgroundColor: '#E1F5FE',
        borderColor: '#0288D1'
    },
    chipText: {
        color: '#555'
    },
    activeChipText: {
        color: '#0288D1',
        fontWeight: 'bold'
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    input: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#EEE',
        marginRight: 10
    },
    unitToggle: {
        flexDirection: 'row',
        backgroundColor: '#EEE',
        borderRadius: 10,
        padding: 2
    },
    unitBtn: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8
    },
    activeUnit: {
        backgroundColor: 'white',
        elevation: 1
    },
    unitText: {
        fontSize: 12,
        color: '#777'
    },
    activeUnitText: {
        color: '#333',
        fontWeight: 'bold'
    },
    calcBtn: {
        backgroundColor: '#0288D1',
        borderRadius: 15,
        padding: 16,
        alignItems: 'center',
        marginTop: 20
    },
    calcBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    resultContainer: {
        marginTop: 25
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15
    },
    fertilizerGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25
    },
    fertItem: {
        alignItems: 'center',
        flex: 1
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    fertValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    fertLabel: {
        fontSize: 14,
        color: '#555'
    },
    waterCard: {
        backgroundColor: '#E1F5FE',
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    waterText: {
        marginLeft: 10,
        color: '#0277BD',
        flex: 1,
        lineHeight: 20
    }
});

export default CalculatorScreen;
