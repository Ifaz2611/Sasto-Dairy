import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import i18n from '@/translations';
import { ChartPeriod } from '@/types/health';

interface HealthChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
    legend?: string[];
  };
  unit: string;
  period?: ChartPeriod;
  onPeriodChange?: (period: ChartPeriod) => void;
}

export default function HealthChart({ 
  title, 
  data, 
  unit,
  period = '7days',
  onPeriodChange
}: HealthChartProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const screenWidth = Dimensions.get('window').width - 32;
  
  const periods: ChartPeriod[] = ['7days', '1month', '3months', '6months', '1year'];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      
      {onPeriodChange && (
        <View style={styles.periodSelector}>
          {periods.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodButton,
                period === p && { backgroundColor: colors.primary }
              ]}
              onPress={() => onPeriodChange(p)}
            >
              <Text 
                style={[
                  styles.periodButtonText,
                  { color: period === p ? 'white' : colors.text }
                ]}
              >
                {i18n.t(`period${p}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 1,
          color: (opacity = 1) => colors.primary,
          labelColor: (opacity = 1) => colors.text,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: colors.primary,
          },
        }}
        bezier
        style={styles.chart}
        yAxisSuffix={` ${unit}`}
        yAxisInterval={1}
      />
      
      {data.legend && (
        <View style={styles.legendContainer}>
          {data.legend.map((legend, index) => (
            <View key={index} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor, 
                  { 
                    backgroundColor: data.datasets[index]?.color?.(1) || colors.primary 
                  }
                ]} 
              />
              <Text style={[styles.legendText, { color: colors.text }]}>{legend}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 6,
  },
  periodButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
});