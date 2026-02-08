import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    StatusBar,
    Alert
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TransactionService, Transaction } from "../services/TransactionService";

const ExpenseManagerScreen = () => {
    const navigation = useNavigation<any>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netProfit: 0 });

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        const data = await TransactionService.getTransactions();
        const financialSummary = await TransactionService.getFinancialSummary();
        setTransactions(data);
        setSummary(financialSummary);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this entry?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await TransactionService.deleteTransaction(id);
                        loadData();
                    }
                }
            ]
        );
    };

    const renderHeader = () => (
        <LinearGradient colors={["#1B5E20", "#2E7D32"]} style={styles.header}>
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Farm Finances</Text>
                <TouchableOpacity onPress={() => navigation.navigate("AddTransaction")} style={styles.addBtnHeader}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Net Profit</Text>
                <Text style={[styles.summaryValue, { color: summary.netProfit >= 0 ? '#4CAF50' : '#F44336' }]}>
                    {summary.netProfit >= 0 ? '+' : '-'} ₹{Math.abs(summary.netProfit).toLocaleString()}
                </Text>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
                        <View>
                            <Text style={styles.statLabel}>Income</Text>
                            <Text style={styles.statValue}>₹{summary.totalIncome.toLocaleString()}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
                        <View>
                            <Text style={styles.statLabel}>Expense</Text>
                            <Text style={styles.statValue}>₹{summary.totalExpense.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );

    const renderTransactionItem = ({ item }: { item: Transaction }) => (
        <TouchableOpacity onLongPress={() => handleDelete(item.id)} style={styles.itemCard}>
            <View style={[styles.iconBox, { backgroundColor: item.type === 'INCOME' ? '#E8F5E9' : '#FFEBEE' }]}>
                <Ionicons
                    name={item.type === 'INCOME' ? "arrow-down-circle" : "arrow-up-circle"}
                    size={24}
                    color={item.type === 'INCOME' ? "#2E7D32" : "#D32F2F"}
                />
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <Text style={[styles.itemAmount, { color: item.type === 'INCOME' ? "#2E7D32" : "#D32F2F" }]}>
                {item.type === 'INCOME' ? '+' : '-'} ₹{item.amount.toLocaleString()}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

            {renderHeader()}

            <View style={styles.listContainer}>
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Recent Transactions</Text>
                </View>

                <FlatList
                    data={transactions}
                    keyExtractor={item => item.id}
                    renderItem={renderTransactionItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="receipt-outline" size={48} color="#CCC" />
                            <Text style={styles.emptyText}>No transactions yet.</Text>
                            <Text style={styles.emptySubText}>Tap + to add income or expense.</Text>
                        </View>
                    }
                />
            </View>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("AddTransaction")}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    backBtn: {
        padding: 5
    },
    addBtnHeader: {
        padding: 5
    },
    summaryCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5
    },
    summaryLabel: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 5
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#eee'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8
    },
    statLabel: {
        fontSize: 12,
        color: '#757575'
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    listContent: {
        paddingBottom: 80
    },
    itemCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 1
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15
    },
    itemDetails: {
        flex: 1
    },
    itemCategory: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    itemDate: {
        fontSize: 12,
        color: '#999'
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50
    },
    emptyText: {
        color: '#555',
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold'
    },
    emptySubText: {
        color: '#999',
        fontSize: 14,
        marginTop: 5
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2E7D32',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5
    }
});

export default ExpenseManagerScreen;
