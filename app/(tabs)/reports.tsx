import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Share2 } from 'lucide-react-native';
import i18n from '@/translations';
import { ChartPeriod, HealthLog } from '@/types/health';
import { getHealthLogs } from '@/utils/storage';
import HealthChart from '@/components/HealthChart';
import { format, subDays, subMonths, subYears } from 'date-fns';

export default function Reports() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bpPeriod, setBpPeriod] = useState<ChartPeriod>('7days');
  const [bsPeriod, setBsPeriod] = useState<ChartPeriod>('7days');
  const [weightPeriod, setWeightPeriod] = useState<ChartPeriod>('7days');
  
  useEffect(() => {
    loadLogs();
  }, []);
  
  const loadLogs = async () => {
    try {
      setLoading(true);
      
      const allLogs = await getHealthLogs();
      const sortedLogs = [...allLogs].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
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
  
  const getFilteredLogs = (period: ChartPeriod) => {
    const now = new Date();
    let cutoffDate;
    
    switch(period) {
      case '7days':
        cutoffDate = subDays(now, 7);
        break;
      case '1month':
        cutoffDate = subMonths(now, 1);
        break;
      case '3months':
        cutoffDate = subMonths(now, 3);
        break;
      case '6months':
        cutoffDate = subMonths(now, 6);
        break;
      case '1year':
        cutoffDate = subYears(now, 1);
        break;
      default:
        cutoffDate = subDays(now, 7);
    }
    
    return logs.filter(log => new Date(log.date) >= cutoffDate);
  };
  
  const generateBloodPressureData = () => {
    const filteredLogs = getFilteredLogs(bpPeriod);
    const bpLogs = filteredLogs.filter(log => log.bloodPressure);
    
    if (bpLogs.length === 0) {
      return {
        labels: [],
        datasets: [
          { data: [] },
          { data: [] }
        ],
        legend: ['Systolic', 'Diastolic']
      };
    }
    
    // Limit to the most recent 7 data points to avoid overcrowding
    const limitedLogs = bpLogs.slice(-7);
    
    return {
      labels: limitedLogs.map(log => format(new Date(log.date), 'MM/dd')),
      datasets: [
        {
          data: limitedLogs.map(log => log.bloodPressure?.systolic || 0),
          color: () => colors.error,
          strokeWidth: 2
        },
        {
          data: limitedLogs.map(log => log.bloodPressure?.diastolic || 0),
          color: () => colors.primary,
          strokeWidth: 2
        }
      ],
      legend: ['Systolic', 'Diastolic']
    };
  };
  
  const generateBloodSugarData = () => {
    const filteredLogs = getFilteredLogs(bsPeriod);
    const bsLogs = filteredLogs.filter(log => log.bloodSugar);
    
    if (bsLogs.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }
    
    // Limit to the most recent 7 data points to avoid overcrowding
    const limitedLogs = bsLogs.slice(-7);
    
    return {
      labels: limitedLogs.map(log => format(new Date(log.date), 'MM/dd')),
      datasets: [
        {
          data: limitedLogs.map(log => log.bloodSugar?.level || 0),
          color: () => colors.secondary,
          strokeWidth: 2
        }
      ]
    };
  };
  
  const generateWeightData = () => {
    const filteredLogs = getFilteredLogs(weightPeriod);
    const weightLogs = filteredLogs.filter(log => log.weight);
    
    if (weightLogs.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }
    
    // Limit to the most recent 7 data points to avoid overcrowding
    const limitedLogs = weightLogs.slice(-7);
    
    return {
      labels: limitedLogs.map(log => format(new Date(log.date), 'MM/dd')),
      datasets: [
        {
          data: limitedLogs.map(log => log.weight?.value || 0),
          color: () => colors.accent,
          strokeWidth: 2
        }
      ]
    };
  };
  
  const bloodPressureData = generateBloodPressureData();
  const bloodSugarData = generateBloodSugarData();
  const weightData = generateWeightData();
  
  const navigateToGenerateReport = () => {
    router.push('/reports/generate');
  };

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
        {logs.length > 0 ? (
          <>
            <HealthChart
              title={i18n.t('bloodPressure')}
              data={bloodPressureData}
              unit={i18n.t('mmHg')}
              period={bpPeriod}
              onPeriodChange={setBpPeriod}
            />
            
            <HealthChart
              title={i18n.t('bloodSugar')}
              data={bloodSugarData}
              unit="mg/dL"
              period={bsPeriod}
              onPeriodChange={setBsPeriod}
            />
            
            <HealthChart
              title={i18n.t('weight')}
              data={weightData}
              unit="kg"
              period={weightPeriod}
              onPeriodChange={setWeightPeriod}
            />
            
            <TouchableOpacity
              style={[styles.generateButton, { backgroundColor: colors.primary }]}
              onPress={navigateToGenerateReport}
            >
              <Share2 color="#FFFFFF" size={20} />
              <Text style={styles.generateButtonText}>{i18n.t('generateReport')}</Text>
            </TouchableOpacity>
          </>
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
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});