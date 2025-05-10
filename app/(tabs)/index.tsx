import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import i18n from '@/translations';
import { HealthLog, Reminder } from '@/types/health';
import { getHealthLogs, getReminders } from '@/utils/storage';
import HealthMetricCard from '@/components/HealthMetricCard';
import ReminderCard from '@/components/ReminderCard';
import EmergencyButton from '@/components/EmergencyButton';

export default function Dashboard() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  const [latestLogs, setLatestLogs] = useState<HealthLog[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get latest health logs
      const logs = await getHealthLogs();
      const sortedLogs = [...logs].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setLatestLogs(sortedLogs.slice(0, 3));
      
      // Get upcoming reminders
      const reminders = await getReminders();
      const now = new Date();
      const upcoming = [...reminders]
        .filter(r => !r.completed && new Date(`${r.date}T${r.time}`) > now)
        .sort((a, b) => 
          new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
        );
      setUpcomingReminders(upcoming.slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const navigateToAddLog = () => {
    router.push('/logs/add');
  };
  
  const navigateToAddMedication = () => {
    router.push('/medicines/add');
  };
  
  const navigateToAddReminder = () => {
    router.push('/reminders/add');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Latest Readings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {i18n.t('latestReadings')}
          </Text>
          
          {latestLogs.length > 0 ? (
            <>
              {latestLogs.map((log, index) => (
                <React.Fragment key={log.id || index}>
                  {log.bloodPressure && (
                    <HealthMetricCard
                      type="bloodPressure"
                      value={log.bloodPressure}
                      unit={i18n.t('mmHg')}
                      timestamp={log.date}
                      onPress={() => router.push(`/logs/${log.id}`)}
                    />
                  )}
                  
                  {log.bloodSugar && (
                    <HealthMetricCard
                      type="bloodSugar"
                      value={log.bloodSugar.level}
                      unit={log.bloodSugar.unit}
                      timestamp={log.date}
                      onPress={() => router.push(`/logs/${log.id}`)}
                    />
                  )}
                  
                  {log.weight && (
                    <HealthMetricCard
                      type="weight"
                      value={log.weight.value}
                      unit={log.weight.unit}
                      timestamp={log.date}
                      onPress={() => router.push(`/logs/${log.id}`)}
                    />
                  )}
                </React.Fragment>
              ))}
            </>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyStateText, { color: colors.muted }]}>
                {i18n.t('noDataAvailable')}
              </Text>
            </View>
          )}
        </View>
        
        {/* Upcoming Reminders Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {i18n.t('upcomingReminders')}
          </Text>
          
          {upcomingReminders.length > 0 ? (
            <>
              {upcomingReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onPress={() => router.push(`/reminders/${reminder.id}`)}
                />
              ))}
            </>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyStateText, { color: colors.muted }]}>
                {i18n.t('noDataAvailable')}
              </Text>
            </View>
          )}
        </View>
        
        {/* Quick Add Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {i18n.t('quickAdd')}
          </Text>
          
          <View style={styles.quickAddContainer}>
            <TouchableOpacity
              style={[styles.quickAddButton, { backgroundColor: colors.primary }]}
              onPress={navigateToAddLog}
            >
              <Plus color="white" size={24} />
              <Text style={styles.quickAddButtonText}>{i18n.t('logs')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickAddButton, { backgroundColor: colors.secondary }]}
              onPress={navigateToAddMedication}
            >
              <Plus color="white" size={24} />
              <Text style={styles.quickAddButtonText}>{i18n.t('medicines')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickAddButton, { backgroundColor: colors.accent }]}
              onPress={navigateToAddReminder}
            >
              <Plus color="white" size={24} />
              <Text style={styles.quickAddButtonText}>{i18n.t('addReminder')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <EmergencyButton />
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyState: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  quickAddContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAddButton: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickAddButtonText: {
    color: 'white',
    fontWeight: '600',
    marginTop: 8,
  },
});