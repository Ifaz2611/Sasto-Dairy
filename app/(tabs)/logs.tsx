import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Calendar, Plus } from 'lucide-react-native';
import i18n from '@/translations';
import { HealthLog } from '@/types/health';
import { getHealthLogs } from '@/utils/storage';
import HealthMetricCard from '@/components/HealthMetricCard';
import { format } from 'date-fns';

export default function HealthLogs() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadLogs();
  }, []);
  
  const loadLogs = async () => {
    try {
      setLoading(true);
      
      const allLogs = await getHealthLogs();
      const sortedLogs = [...allLogs].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setLogs(sortedLogs);
    } catch (error) {
      console.error('Error loading health logs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadLogs();
    setRefreshing(false);
  };
  
  const navigateToAddLog = () => {
    router.push('/logs/add');
  };
  
  const groupLogsByDate = () => {
    const groups: Record<string, HealthLog[]> = {};
    
    logs.forEach(log => {
      try {
        const dateKey = format(new Date(log.date), 'yyyy-MM-dd');
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(log);
      } catch (error) {
        console.error('Error formatting date:', error);
      }
    });
    
    return groups;
  };
  
  const groupedLogs = groupLogsByDate();
  const dates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        {dates.length > 0 ? (
          dates.map(dateKey => (
            <View key={dateKey} style={styles.dateGroup}>
              <View style={styles.dateHeader}>
                <Calendar size={16} color={colors.primary} />
                <Text style={[styles.dateText, { color: colors.text }]}>
                  {format(new Date(dateKey), 'MMMM d, yyyy')}
                </Text>
              </View>
              
              {groupedLogs[dateKey].map(log => (
                <View key={log.id} style={styles.logContainer}>
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
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              {i18n.t('noDataAvailable')}
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.muted }]}>
              {i18n.t('addHealthLog')}
            </Text>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={navigateToAddLog}
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
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logContainer: {
    marginBottom: 4,
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