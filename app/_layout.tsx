import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <>
      <Stack screenOptions={{ 
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="emergency/index" options={{ headerShown: true }} />
        <Stack.Screen name="emergency/add" options={{ headerShown: true }} />
        <Stack.Screen name="emergency/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="logs/add" options={{ headerShown: true }} />
        <Stack.Screen name="logs/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="medicines/add" options={{ headerShown: true }} />
        <Stack.Screen name="medicines/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="reminders/add" options={{ headerShown: true }} />
        <Stack.Screen name="reminders/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="reports/generate" options={{ headerShown: true }} />
        <Stack.Screen name="about" options={{ headerShown: true }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}