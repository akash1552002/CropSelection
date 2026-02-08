import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem('user-language', lang);
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#FFF" />
          </View>
          <View>
            <Text style={styles.userName}>Farmer</Text>
            <Text style={styles.userRole}>Premium Member</Text>
          </View>
        </View>

        {/* Language Section */}
        <Text style={styles.sectionTitle}>{t('change_language')}</Text>

        <TouchableOpacity
          style={[styles.langOption, currentLang === 'en' && styles.activeOption]}
          onPress={() => changeLanguage('en')}
        >
          <Text style={[styles.langText, currentLang === 'en' && styles.activeText]}>🇺🇸 {t('english')}</Text>
          {currentLang === 'en' && <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langOption, currentLang === 'hi' && styles.activeOption]}
          onPress={() => changeLanguage('hi')}
        >
          <Text style={[styles.langText, currentLang === 'hi' && styles.activeText]}>🇮🇳 {t('hindi')}</Text>
          {currentLang === 'hi' && <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />}
        </TouchableOpacity>

      </View>
    </View>
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
    paddingTop: 50,
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    elevation: 2
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  userRole: {
    color: 'gold',
    fontWeight: 'bold',
    marginTop: 2
  },
  sectionTitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 10,
    marginLeft: 5
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  activeOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9'
  },
  langText: {
    fontSize: 16,
    color: '#333'
  },
  activeText: {
    fontWeight: 'bold',
    color: '#2E7D32'
  }
});

export default ProfileScreen;
