import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform, ScrollView, LayoutAnimation, UIManager } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";

// Import original data (transformed in script)
// Note: Types need to be inferred or cast correctly as the JSON structure changed
import cropScheduleDataRaw from "../assets/full_crop_daily_schedule.json";
import { registerForPushNotificationsAsync, scheduleNotification } from "../services/notificationService";

// Helper to enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Define updated types matching the NEW JSON structure
interface Task {
  day: number;
  task: string;
  category: string;
}

interface Week {
  week: number;
  tasks: Task[];
}

interface CropData {
  crop_name: string;
  growthDuration: number;
  weeks: Week[]; // Changed from daily_schedule
}

const cropScheduleData = cropScheduleDataRaw as unknown as CropData[];

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

// Define category icons/colors for better visuals
const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'Watering': return { color: '#E3F2FD', text: '#1976D2', icon: 'water' };
    case 'Fertilization': return { color: '#FFF3E0', text: '#F57C00', icon: 'nutrition' };
    case 'Pest Control': return { color: '#FFEBEE', text: '#D32F2F', icon: 'bug' };
    case 'Weed Control': return { color: '#E8F5E9', text: '#388E3C', icon: 'cut' };
    case 'Monitoring': return { color: '#F3E5F5', text: '#7B1FA2', icon: 'eye' };
    case 'Sowing': return { color: '#FFFDE7', text: '#FBC02D', icon: 'leaf' };
    default: return { color: '#F5F5F5', text: '#616161', icon: 'information-circle' };
  }
};

const CropDailySchedule = ({ route }: any) => {
  const { cropName } = route.params;
  const crop = cropScheduleData.find((item) => item.crop_name === cropName);

  const [sowingDate, setSowingDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    registerForPushNotificationsAsync();
    loadSowingDate();
  }, []);

  // Auto-expand current week if sowing date is set
  useEffect(() => {
    if (sowingDate && crop) {
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - sowingDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const currentWeek = Math.ceil(diffDays / 7);

      // Expand current week
      if (currentWeek > 0) {
        toggleWeek(currentWeek, true);
      } else {
        // Default to week 1 if not started yet
        toggleWeek(1, true);
      }
    } else {
      // Default expand first week
      toggleWeek(1, true);
    }
  }, [sowingDate, crop]);


  const loadSowingDate = async () => {
    try {
      const storedDate = await AsyncStorage.getItem(`sowingDate_${cropName}`);
      if (storedDate) {
        setSowingDate(new Date(storedDate));
      }
    } catch (e) {
      console.error("Failed to load sowing date", e);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || sowingDate;
    setShowDatePicker(Platform.OS === 'ios');
    if (currentDate) {
      confirmSowingDate(currentDate);
    }
  };

  const confirmSowingDate = (date: Date) => {
    Alert.alert(
      "Confirm Sowing Date",
      `Are you sure you want to start cropping ${cropName} on ${date.toDateString()}? This will schedule notifications for all tasks.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start Cropping",
          onPress: () => scheduleCropNotifications(date)
        }
      ]
    );
  };

  const scheduleCropNotifications = async (startDate: Date) => {
    if (!crop) return;

    // 1. Save Date
    setSowingDate(startDate);
    await AsyncStorage.setItem(`sowingDate_${cropName}`, startDate.toISOString());

    // 3. Schedule new ones
    let scheduledCount = 0;
    const now = new Date();

    // Iterate through weeks -> tasks
    for (const week of crop.weeks) {
      for (const item of week.tasks) {
        const taskDate = new Date(startDate);
        taskDate.setDate(startDate.getDate() + (item.day - 1)); // Day 1 is start date
        taskDate.setHours(8, 0, 0, 0); // 8:00 AM

        // Only schedule if the time is in the future
        if (taskDate > now) {
          await scheduleNotification(
            `${cropName}: Day ${item.day} Task`,
            `${item.category}: ${item.task}`,
            taskDate
          );
          scheduledCount++;
        }
      }
    }

    Alert.alert("Success", `Scheduled ${scheduledCount} notifications for your crop!`);
  };

  const toggleWeek = (weekNum: number, forceState?: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNum]: forceState !== undefined ? forceState : !prev[weekNum]
    }));
  };

  if (!crop) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No schedule found for {cropName}</Text>
      </View>
    );
  }

  const renderTask = (item: Task, index: number) => {
    // Calculate actual date if sowing date is set
    let dateString = "";
    let isToday = false;

    if (sowingDate) {
      const taskDate = new Date(sowingDate);
      taskDate.setDate(sowingDate.getDate() + (item.day - 1));
      dateString = taskDate.toDateString();

      const today = new Date();
      isToday = taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear();
    }

    const { color, text, icon } = getCategoryStyle(item.category);

    return (
      <Animatable.View
        key={index}
        animation="fadeIn"
        duration={400}
        delay={index * 100}
        style={[styles.taskCard, isToday && styles.todayTaskCard]}
      >
        <View style={styles.taskHeader}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayText}>Day {item.day}</Text>
          </View>
          {dateString ? <Text style={[styles.dateText, isToday && styles.todayDateText]}>{dateString}</Text> : null}
        </View>

        <View style={styles.taskContent}>
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <Ionicons name={icon as any} size={20} color={text} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.taskTitle}>{item.category}</Text>
            <Text style={styles.taskDescription}>{item.task}</Text>
          </View>
        </View>
      </Animatable.View>
    );
  };

  const renderWeek = (week: Week) => {
    const isExpanded = expandedWeeks[week.week];

    return (
      <View key={week.week} style={styles.weekContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleWeek(week.week)}
          style={[styles.weekHeader, isExpanded ? styles.weekHeaderExpanded : null]}
        >
          <View style={styles.weekTitleContainer}>
            <View style={styles.weekIconBg}>
              <Text style={styles.weekNumber}>{week.week}</Text>
            </View>
            <Text style={styles.weekTitle}>Week {week.week}</Text>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#4CAF50"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.weekContent}>
            {week.tasks.map((task, index) => renderTask(task, index))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.header}>
        <View style={styles.headerContent}>
          {cropImages[cropName] && (
            <Image source={cropImages[cropName]} style={styles.cropIcon} />
          )}
          <View style={styles.headerTexts}>
            <Text style={styles.headerText}>{crop.crop_name}</Text>
            <Text style={styles.subHeaderText}>{crop.growthDuration} Days Duration</Text>
          </View>
        </View>

        {/* Sowing Date Button */}
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={20} color="#2E7D32" />
          <Text style={styles.dateButtonText}>
            {sowingDate ? `Started: ${sowingDate.toDateString()}` : "Set Sowing Date"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={sowingDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {crop.weeks.map(week => renderWeek(week))}
        <View style={styles.footerSpace} />
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTexts: {
    marginLeft: 15,
  },
  cropIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)"
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subHeaderText: {
    color: "#E8F5E9",
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2
  },
  dateButton: {
    flexDirection: 'row',
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateButtonText: {
    color: "#2E7D32",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 15
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  weekContainer: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
  },
  weekHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FAFAFA'
  },
  weekTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  weekNumber: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 16
  },
  weekTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333'
  },
  weekContent: {
    padding: 15,
    backgroundColor: '#FAFBFD'
  },
  taskCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderLeftWidth: 3,
    borderLeftColor: "#E0E0E0"
  },
  todayTaskCard: {
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderLeftWidth: 4,
    backgroundColor: '#F1F8E9'
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  dayBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  dayText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#616161"
  },
  dateText: {
    fontSize: 12,
    color: "#9E9E9E",
    fontStyle: 'italic'
  },
  todayDateText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  taskDescription: {
    fontSize: 16,
    color: "#212121",
    lineHeight: 22,
    fontWeight: '500'
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  footerSpace: {
    height: 30
  }
});

export default CropDailySchedule;
