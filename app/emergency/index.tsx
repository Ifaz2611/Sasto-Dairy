import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Plus, User, Phone, Stethoscope } from 'lucide-react-native';
import i18n from '@/translations';
import { EmergencyContact } from '@/types/health';
import { getEmergencyContacts, deleteEmergencyContact } from '@/utils/storage';
import { Stack } from 'expo-router';

export default function EmergencyContactsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadContacts();
  }, []);
  
  const loadContacts = async () => {
    try {
      setLoading(true);
      
      const allContacts = await getEmergencyContacts();
      const sortedContacts = [...allContacts].sort((a, b) => {
        // Sort by doctor first, then alphabetically
        if (a.isDoctor && !b.isDoctor) return -1;
        if (!a.isDoctor && b.isDoctor) return 1;
        return a.name.localeCompare(b.name);
      });
      setContacts(sortedContacts);
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  };
  
  const handleDeleteContact = async (id: string) => {
    try {
      await deleteEmergencyContact(id);
      await loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };
  
  const navigateToAddContact = () => {
    router.push('/emergency/add');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: i18n.t('emergencyContacts'),
          headerShown: true,
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {contacts.length > 0 ? (
          contacts.map(contact => (
            <View 
              key={contact.id} 
              style={[
                styles.contactCard, 
                { 
                  backgroundColor: colors.card,
                  borderLeftColor: contact.isDoctor ? colors.primary : colors.accent,
                }
              ]}
            >
              <View style={styles.contactHeader}>
                {contact.isDoctor ? (
                  <Stethoscope size={20} color={colors.primary} />
                ) : (
                  <User size={20} color={colors.accent} />
                )}
                <Text style={[styles.contactName, { color: colors.text }]}>
                  {contact.name}
                </Text>
                <View 
                  style={[
                    styles.relationBadge, 
                    { backgroundColor: contact.isDoctor ? colors.primary + '20' : colors.accent + '20' }
                  ]}
                >
                  <Text 
                    style={[
                      styles.relationText, 
                      { color: contact.isDoctor ? colors.primary : colors.accent }
                    ]}
                  >
                    {contact.relation}
                  </Text>
                </View>
              </View>
              
              <View style={styles.contactInfo}>
                <View style={styles.phoneContainer}>
                  <Phone size={16} color={colors.muted} />
                  <Text style={[styles.phoneText, { color: colors.text }]}>
                    {contact.phone}
                  </Text>
                </View>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: colors.primary + '20' }]}
                  onPress={() => router.push(`/emergency/${contact.id}`)}
                >
                  <Text style={[styles.buttonText, { color: colors.primary }]}>
                    {i18n.t('edit')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: colors.error + '20' }]}
                  onPress={() => handleDeleteContact(contact.id)}
                >
                  <Text style={[styles.buttonText, { color: colors.error }]}>
                    {i18n.t('delete')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              {i18n.t('noDataAvailable')}
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.muted }]}>
              {i18n.t('addEmergencyContact')}
            </Text>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={navigateToAddContact}
      >
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>
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
    paddingBottom: 80,
  },
  contactCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  relationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  relationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contactInfo: {
    marginBottom: 12,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: 16,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});