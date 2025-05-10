import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Bell, Globe, HelpCircle, Moon, Share2, Sun } from 'lucide-react-native';
import i18n from '@/translations';
import { getEmergencyContacts, getLanguage, saveLanguage } from '@/utils/storage';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function Settings() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  const [language, setLanguage] = useState('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(colorScheme === 'dark');
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const lang = await getLanguage();
      setLanguage(lang);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };
  
  const handleLanguageChange = async (lang: string) => {
    try {
      await saveLanguage(lang);
      i18n.locale = lang;
      setLanguage(lang);
      
      // Force a reload of the app
      if (Platform.OS === 'web') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };
  
  const handleExportData = async () => {
    try {
      // Get all data
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        data: {
          healthLogs: await FileSystem.readAsStringAsync(
            FileSystem.documentDirectory + 'shastho_diary_health_logs'
          ),
          medications: await FileSystem.readAsStringAsync(
            FileSystem.documentDirectory + 'shastho_diary_medications'
          ),
          reminders: await FileSystem.readAsStringAsync(
            FileSystem.documentDirectory + 'shastho_diary_reminders'
          ),
          emergencyContacts: await FileSystem.readAsStringAsync(
            FileSystem.documentDirectory + 'shastho_diary_emergency_contacts'
          ),
        },
      };
      
      // Create a file to share
      const fileUri = FileSystem.documentDirectory + 'shastho_diary_export.json';
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(exportData, null, 2)
      );
      
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert(
          i18n.t('errorOccurred'),
          'Sharing is not available on this device'
        );
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert(
        i18n.t('errorOccurred'),
        i18n.t('tryAgain')
      );
    }
  };
  
  const navigateToEmergencyContacts = async () => {
    router.push('/emergency');
  };
  
  const navigateToAbout = () => {
    router.push('/about');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Language Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Globe size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {i18n.t('language')}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.option,
              language === 'en' && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => handleLanguageChange('en')}
          >
            <Text 
              style={[
                styles.optionText, 
                { color: language === 'en' ? colors.primary : colors.text }
              ]}
            >
              {i18n.t('english')}
            </Text>
            {language === 'en' && (
              <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity
            style={[
              styles.option,
              language === 'bn' && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => handleLanguageChange('bn')}
          >
            <Text 
              style={[
                styles.optionText, 
                { color: language === 'bn' ? colors.primary : colors.text }
              ]}
            >
              {i18n.t('bangla')}
            </Text>
            {language === 'bn' && (
              <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Appearance Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            {colorScheme === 'dark' ? (
              <Moon size={20} color={colors.primary} />
            ) : (
              <Sun size={20} color={colors.primary} />
            )}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {i18n.t('theme')}
            </Text>
          </View>
          
          <View style={styles.switchOption}>
            <Text style={[styles.optionText, { color: colors.text }]}>
              {i18n.t('dark')}
            </Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>
        
        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {i18n.t('notifications')}
            </Text>
          </View>
          
          <View style={styles.switchOption}>
            <Text style={[styles.optionText, { color: colors.text }]}>
              {i18n.t('notifications')}
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>
        
        {/* Data Management Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Share2 size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {i18n.t('exportData')}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.option}
            onPress={handleExportData}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>
              {i18n.t('exportData')}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity
            style={styles.option}
            onPress={() => {/* Import data implementation */}}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>
              {i18n.t('importData')}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Emergency Contacts Section */}
        <TouchableOpacity
          style={[styles.section, { backgroundColor: colors.card }]}
          onPress={navigateToEmergencyContacts}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.emergencyText, { color: colors.error }]}>
              {i18n.t('emergencyContacts')}
            </Text>
          </View>
        </TouchableOpacity>
        
        {/* About Section */}
        <TouchableOpacity
          style={[styles.section, { backgroundColor: colors.card }]}
          onPress={navigateToAbout}
        >
          <View style={styles.sectionHeader}>
            <HelpCircle size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {i18n.t('about')}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionText: {
    fontSize: 16,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontWeight: 'bold',
  },
  switchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  emergencyText: {
    fontSize: 16,
    fontWeight: '600',
  },
});