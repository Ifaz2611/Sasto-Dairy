import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Clock, Pill } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import i18n from '@/translations';
import { Medication } from '@/types/health';

interface MedicationCardProps {
  medication: Medication;
  onPress?: () => void;
}

export default function MedicationCard({ medication, onPress }: MedicationCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Pill color={colors.primary} size={20} />
        <Text style={[styles.name, { color: colors.text }]}>{medication.name}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.muted }]}>
            {i18n.t('dosage')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {medication.dosage}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.muted }]}>
            {i18n.t('frequency')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {medication.frequency}
          </Text>
        </View>
      </View>
      
      <View style={styles.timingsContainer}>
        <Text style={[styles.timingsLabel, { color: colors.muted }]}>
          <Clock size={14} color={colors.muted} /> {i18n.t('timings')}
        </Text>
        <View style={styles.timings}>
          {medication.time.map((time, index) => (
            <View 
              key={index} 
              style={[styles.timeChip, { backgroundColor: colors.primary + '20' }]}
            >
              <Text style={[styles.timeText, { color: colors.primary }]}>
                {time}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      {medication.notes && (
        <Text style={[styles.notes, { color: colors.muted }]}>
          {medication.notes}
        </Text>
      )}
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
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  timingsContainer: {
    marginBottom: 8,
  },
  timingsLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  timings: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  notes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
});