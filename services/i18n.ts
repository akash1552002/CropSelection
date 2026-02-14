import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from '../locales/en.json';
import hi from '../locales/hi.json';

const resources = {
    en: { translation: en },
    hi: { translation: hi },
};

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem('user-language');

    if (!savedLanguage) {
        // Determine the device's locale (e.g., 'en-US' or 'hi-IN')
        // We default to 'en' if not strictly 'hi'
        const deviceLocale = Localization.getLocales()[0].languageCode;
        savedLanguage = deviceLocale === 'hi' ? 'hi' : 'en';
    }

    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: savedLanguage,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
            compatibilityJSON: 'v4',
        });
};

initI18n();

export default i18n;
