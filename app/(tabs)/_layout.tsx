import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { BarChart, Calendar, Home, Pill, Settings } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import i18n from '@/translations';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { getLanguage } from '@/utils/storage';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [fontsLoaded] = useFonts({
    'System': Platform.select({
      ios: 'San Francisco',
      android: 'Roboto',
      default: 'System',
    })
  });
  
  useEffect(() => {
    async function prepare() {
      try {
        // Set the language from storage
        const lang = await getLanguage();
        i18n.locale = lang;
        
        // Hide splash screen
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Error loading app resources:', e);
        await SplashScreen.hideAsync();
      }
    }

    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('dashboard'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: i18n.t('appName'),
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: i18n.t('logs'),
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          headerTitle: i18n.t('logs'),
        }}
      />
      <Tabs.Screen
        name="medicines"
        options={{
          title: i18n.t('medicines'),
          tabBarIcon: ({ color, size }) => <Pill size={size} color={color} />,
          headerTitle: i18n.t('medicines'),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: i18n.t('reports'),
          tabBarIcon: ({ color, size }) => <BarChart size={size} color={color} />,
          headerTitle: i18n.t('reports'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: i18n.t('settings'),
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitle: i18n.t('settings'),
        }}
      />
    </Tabs>
  );
}