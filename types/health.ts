export interface BloodPressure {
  systolic: number;
  diastolic: number;
  pulse?: number;
  timestamp: string;
  notes?: string;
}

export interface BloodSugar {
  level: number;
  unit: 'mg/dL' | 'mmol/L';
  measurementType: 'fasting' | 'post-meal' | 'random';
  timestamp: string;
  notes?: string;
}

export interface Weight {
  value: number;
  unit: 'kg' | 'lb';
  timestamp: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  notes?: string;
}

export interface HealthLog {
  id: string;
  date: string;
  bloodPressure?: BloodPressure;
  bloodSugar?: BloodSugar;
  weight?: Weight;
  medications?: string[];
  notes?: string;
}

export interface Reminder {
  id: string;
  title: string;
  body: string;
  type: 'medication' | 'checkup' | 'measurement';
  date: string;
  time: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isDoctor: boolean;
}

export type ChartPeriod = '7days' | '1month' | '3months' | '6months' | '1year';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}