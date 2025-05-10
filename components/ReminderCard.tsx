import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Bell, Calendar, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import i18n from '@/translations';
import { Reminder } from '@/types/health';
import { format } from 'date-fns';

interface ReminderCardProps {
  reminder: Reminder;
  onPress?: () => void;
  onComplete?: () => void;
}

export default function ReminderCard({ 
  reminder, 
  onPress, 
  onComplete 
}: ReminderCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const getTypeIcon = () => {
    switch(reminder.type) {
      case 'medication':
        return <Bell color={colors.primary} size={20} />;
      case 'checkup':
        return <Calendar color={colors.accent} size={20} />;
      case 'measurement':
        return <Clock color={colors.secondary} size={20} />;
      default:
        return <Bell color={colors.primary} size={20} />;
    }
  };
  
  const getTypeLabel = () => {
    switch(reminder.type) {
      case 'medication':
        return i18n.t('medication');
      case 'checkup':
        return i18n.t('checkup');
      case 'measurement':
        return i18n.t('measurement');
      default:
        return '';
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: colors.card,
          opacity: reminder.completed ? 0.6 : 1
        }
      ]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        {getTypeIcon()}
        <Text style={[styles.typeLabel, { color: colors.muted }]}>
          {getTypeLabel()}
        </Text>
        
        {reminder.repeat !== 'none' && (
          <View style={[styles.repeatBadge, { backgroundColor: colors.secondary }]}>
            <Text style={styles.repeatText}>{i18n.t(reminder.repeat)}</Text>
          </View>
        )}
      </View>
      
      <Text style={[styles.title, { color: colors.text }]}>{reminder.title}</Text>
      <Text style={[styles.body, { color: colors.text }]}>{reminder.body}</Text>
      
      <View style={styles.footer}>
        <View style={styles.dateTimeContainer}>
          <Text style={[styles.dateTime, { color: colors.muted }]}>
            <Calendar size={14} color={colors.muted} /> {formatDate(reminder.date)}
          </Text>
          <Text style={[styles.dateTime, { color: colors.muted }]}>
            <Clock size={14} color={colors.muted} /> {reminder.time}
          </Text>
        </View>
        
        {onComplete && !reminder.completed && (
          <TouchableOpacity 
            style={[styles.completeButton, { backgroundColor: colors.success }]}
            onPress={onComplete}
          >
            <Text style={styles.completeButtonText}>✓</Text>
          </TouchableOpacity>
        )}
      </View>
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
  typeLabel: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  repeatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  repeatText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTime: {
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});