import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthLog, Medication, Reminder, EmergencyContact } from '@/types/health';

// Keys for stored data
const KEYS = {
  HEALTH_LOGS: 'shastho_diary_health_logs',
  MEDICATIONS: 'shastho_diary_medications',
  REMINDERS: 'shastho_diary_reminders',
  EMERGENCY_CONTACTS: 'shastho_diary_emergency_contacts',
  LANGUAGE: 'shastho_diary_language',
};

// Health Logs
export const saveHealthLog = async (log: HealthLog): Promise<void> => {
  try {
    const existingLogs = await getHealthLogs();
    const updatedLogs = [...existingLogs.filter(l => l.id !== log.id), log];
    await AsyncStorage.setItem(KEYS.HEALTH_LOGS, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error('Error saving health log:', error);
    throw error;
  }
};

export const getHealthLogs = async (): Promise<HealthLog[]> => {
  try {
    const logs = await AsyncStorage.getItem(KEYS.HEALTH_LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting health logs:', error);
    return [];
  }
};

export const deleteHealthLog = async (id: string): Promise<void> => {
  try {
    const existingLogs = await getHealthLogs();
    const updatedLogs = existingLogs.filter(log => log.id !== id);
    await AsyncStorage.setItem(KEYS.HEALTH_LOGS, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error('Error deleting health log:', error);
    throw error;
  }
};

// Medications
export const saveMedication = async (medication: Medication): Promise<void> => {
  try {
    const existingMedications = await getMedications();
    const updatedMedications = [...existingMedications.filter(m => m.id !== medication.id), medication];
    await AsyncStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(updatedMedications));
  } catch (error) {
    console.error('Error saving medication:', error);
    throw error;
  }
};

export const getMedications = async (): Promise<Medication[]> => {
  try {
    const medications = await AsyncStorage.getItem(KEYS.MEDICATIONS);
    return medications ? JSON.parse(medications) : [];
  } catch (error) {
    console.error('Error getting medications:', error);
    return [];
  }
};

export const deleteMedication = async (id: string): Promise<void> => {
  try {
    const existingMedications = await getMedications();
    const updatedMedications = existingMedications.filter(med => med.id !== id);
    await AsyncStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(updatedMedications));
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
};

// Reminders
export const saveReminder = async (reminder: Reminder): Promise<void> => {
  try {
    const existingReminders = await getReminders();
    const updatedReminders = [...existingReminders.filter(r => r.id !== reminder.id), reminder];
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(updatedReminders));
  } catch (error) {
    console.error('Error saving reminder:', error);
    throw error;
  }
};

export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const reminders = await AsyncStorage.getItem(KEYS.REMINDERS);
    return reminders ? JSON.parse(reminders) : [];
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

export const deleteReminder = async (id: string): Promise<void> => {
  try {
    const existingReminders = await getReminders();
    const updatedReminders = existingReminders.filter(rem => rem.id !== id);
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(updatedReminders));
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

// Emergency Contacts
export const saveEmergencyContact = async (contact: EmergencyContact): Promise<void> => {
  try {
    const existingContacts = await getEmergencyContacts();
    const updatedContacts = [...existingContacts.filter(c => c.id !== contact.id), contact];
    await AsyncStorage.setItem(KEYS.EMERGENCY_CONTACTS, JSON.stringify(updatedContacts));
  } catch (error) {
    console.error('Error saving emergency contact:', error);
    throw error;
  }
};

export const getEmergencyContacts = async (): Promise<EmergencyContact[]> => {
  try {
    const contacts = await AsyncStorage.getItem(KEYS.EMERGENCY_CONTACTS);
    return contacts ? JSON.parse(contacts) : [];
  } catch (error) {
    console.error('Error getting emergency contacts:', error);
    return [];
  }
};

export const deleteEmergencyContact = async (id: string): Promise<void> => {
  try {
    const existingContacts = await getEmergencyContacts();
    const updatedContacts = existingContacts.filter(contact => contact.id !== id);
    await AsyncStorage.setItem(KEYS.EMERGENCY_CONTACTS, JSON.stringify(updatedContacts));
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    throw error;
  }
};

// Language preference
export const saveLanguage = async (languageCode: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.LANGUAGE, languageCode);
  } catch (error) {
    console.error('Error saving language preference:', error);
    throw error;
  }
};

export const getLanguage = async (): Promise<string> => {
  try {
    const language = await AsyncStorage.getItem(KEYS.LANGUAGE);
    return language || 'en'; // Default to English
  } catch (error) {
    console.error('Error getting language preference:', error);
    return 'en'; // Default to English
  }
};