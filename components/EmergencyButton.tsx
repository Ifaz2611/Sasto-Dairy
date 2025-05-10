import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform, Linking } from 'react-native';
import { Phone } from 'lucide-react-native';
import { getEmergencyContacts } from '@/utils/storage';
import i18n from '@/translations';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function EmergencyButton() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleEmergencyCall = async () => {
    try {
      const contacts = await getEmergencyContacts();
      if (contacts.length > 0) {
        // Sort to prioritize doctors
        const sortedContacts = [...contacts].sort((a, b) => {
          if (a.isDoctor && !b.isDoctor) return -1;
          if (!a.isDoctor && b.isDoctor) return 1;
          return 0;
        });

        const phoneNumber = sortedContacts[0].phone;
        const url = Platform.select({
          ios: `tel:${phoneNumber}`,
          android: `tel:${phoneNumber}`,
          web: `tel:${phoneNumber}`
        });

        if (url) {
          const supported = await Linking.canOpenURL(url);
          if (supported) {
            await Linking.openURL(url);
          }
        }
      } else {
        // If no contacts, open a generic emergency number
        const emergencyNumber = '911'; // Change based on country
        const url = Platform.select({
          ios: `tel:${emergencyNumber}`,
          android: `tel:${emergencyNumber}`,
          web: `tel:${emergencyNumber}`
        });
        
        if (url) {
          const supported = await Linking.canOpenURL(url);
          if (supported) {
            await Linking.openURL(url);
          }
        }
      }
    } catch (error) {
      console.error('Error handling emergency call:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.error }]}
        onPress={handleEmergencyCall}
        activeOpacity={0.7}
      >
        <Phone color="#fff" size={24} />
        <Text style={styles.buttonText}>{i18n.t('emergency')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});