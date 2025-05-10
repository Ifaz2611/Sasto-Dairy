import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import i18n from '@/translations';
import { format } from 'date-fns';

type MetricType = 'bloodPressure' | 'bloodSugar' | 'weight';

interface HealthMetricCardProps {
  type: MetricType;
  value: string | number | { systolic: number; diastolic: number; pulse?: number };
  unit?: string;
  timestamp: string;
  onPress?: () => void;
}

export default function HealthMetricCard({ 
  type, 
  value, 
  unit, 
  timestamp, 
  onPress 
}: HealthMetricCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const getIcon = () => {
    switch(type) {
      case 'bloodPressure':
        return '🫀';
      case 'bloodSugar':
        return '🩸';
      case 'weight':
        return '⚖️';
      default:
        return '📊';
    }
  };
  
  const getTitle = () => {
    switch(type) {
      case 'bloodPressure':
        return i18n.t('bloodPressure');
      case 'bloodSugar':
        return i18n.t('bloodSugar');
      case 'weight':
        return i18n.t('weight');
      default:
        return '';
    }
  };
  
  const formatValue = () => {
    if (type === 'bloodPressure' && typeof value === 'object') {
      return `${value.systolic}/${value.diastolic}` + (value.pulse ? ` (${value.pulse})` : '');
    }
    
    return value.toString() + (unit ? ` ${unit}` : '');
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{getIcon()}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{getTitle()}</Text>
      </View>
      
      <Text style={[styles.value, { color: colors.primary }]}>{formatValue()}</Text>
      
      <Text style={[styles.timestamp, { color: colors.muted }]}>
        {formatDate(timestamp)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
  },
});