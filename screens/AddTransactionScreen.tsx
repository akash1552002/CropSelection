import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TransactionService } from "../services/TransactionService";

const CATEGORIES = {
    EXPENSE: ["Seeds", "Fertilizer", "Pesticides", "Labor", "Equipment", "Water", "Other"],
    INCOME: ["Crop Sale", "Subsidies", "Other"]
};

const AddTransactionScreen = () => {
    const navigation = useNavigation();
    const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Other");
    const [note, setNote] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

    const handleSave = async () => {
        if (!amount || isNaN(parseFloat(amount))) {
            Alert.alert("Error", "Please enter a valid amount");
            return;
        }

        try {
            await TransactionService.addTransaction({
                type,
                amount: parseFloat(amount),
                category,
                date,
                note
            });
            Alert.alert("Success", "Transaction added successfully", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert("Error", "Could not save transaction");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Transaction</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Type Toggle */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, type === 'EXPENSE' && styles.expenseActive]}
                        onPress={() => { setType('EXPENSE'); setCategory("Other"); }}
                    >
                        <Text style={[styles.toggleText, type === 'EXPENSE' && styles.activeText]}>Expense 💸</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleBtn, type === 'INCOME' && styles.incomeActive]}
                        onPress={() => { setType('INCOME'); setCategory("Other"); }}
                    >
                        <Text style={[styles.toggleText, type === 'INCOME' && styles.activeText]}>Income 💰</Text>
                    </TouchableOpacity>
                </View>

                {/* Amount Input */}
                <Text style={styles.label}>Amount (₹)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                {/* Category Selection */}
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryContainer}>
                    {(type === 'EXPENSE' ? CATEGORIES.EXPENSE : CATEGORIES.INCOME).map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryChip, category === cat && styles.categoryActive]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text style={[styles.categoryText, category === cat && styles.categoryActiveText]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Date Input */}
                <Text style={styles.label}>Date</Text>
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={date}
                    onChangeText={setDate}
                />

                {/* Note Input */}
                <Text style={styles.label}>Note (Optional)</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Details about this transaction..."
                    multiline
                    value={note}
                    onChangeText={setNote}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Transaction</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    backButton: {
        padding: 5
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    content: {
        padding: 20
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        padding: 4,
        marginBottom: 25
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8
    },
    expenseActive: {
        backgroundColor: '#FF5252'
    },
    incomeActive: {
        backgroundColor: '#4CAF50'
    },
    toggleText: {
        fontWeight: 'bold',
        color: '#757575'
    },
    activeText: {
        color: 'white'
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 8,
        marginLeft: 4
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top'
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20
    },
    categoryChip: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 8,
        marginBottom: 8
    },
    categoryActive: {
        backgroundColor: '#2E7D32',
        borderColor: '#2E7D32'
    },
    categoryText: {
        color: '#555',
        fontSize: 13
    },
    categoryActiveText: {
        color: 'white',
        fontWeight: 'bold'
    },
    saveButton: {
        backgroundColor: '#2E7D32',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default AddTransactionScreen;
