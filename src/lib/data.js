import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

const pad = n => String(n).padStart(2, '0');

export const dayKey = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
export const lastNDays = n => Array.from({ length: n }, (_, i) => dayKey(n - 1 - i));
export const weekLabel = k => 'SMTWTFS'[new Date(k + 'T00:00:00').getDay()];
export const daysUntil = d =>
  Math.round((new Date(d + 'T00:00:00') - new Date(dayKey(0) + 'T00:00:00')) / 86400000);
export const money = n => '₹' + Math.round(n).toLocaleString('en-IN');

export function calcStreak(log = []) {
  const start = log.includes(dayKey(0)) ? 0 : 1;
  let n = 0;
  while (log.includes(dayKey(start + n))) n++;
  return n;
}

export const KEYS = [
  'lifeos_tasks', 'lifeos_habits', 'lifeos_notes', 'lifeos_counters', 'lifeos_goals',
  'lifeos_journal', 'lifeos_expenses', 'lifeos_focus', 'lifeos_water', 'lifeos_sleep',
  'lifeos_weight', 'lifeos_workouts', 'lifeos_events', 'lifeos_cards', 'lifeos_settings',
];

function useStored(key, initial) {
  const [value, setValue] = useState(initial);
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      AsyncStorage.getItem(key)
        .then(s => { if (alive) setValue(s ? JSON.parse(s) : initial); })
        .catch(() => {});
      return () => { alive = false; };
    }, [key])
  );
  const update = useCallback(change => {
    setValue(prev => {
      const next = typeof change === 'function' ? change(prev) : change;
      AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, [key]);
  return [value, update];
}

export default function useStoredList(key) { return useStored(key, []); }
export function useStoredObject(key) { return useStored(key, {}); }

export function useAllData() {
  const [tasks] = useStoredList('lifeos_tasks');
  const [habits] = useStoredList('lifeos_habits');
  const [goals] = useStoredList('lifeos_goals');
  const [journal] = useStoredList('lifeos_journal');
  const [expenses] = useStoredList('lifeos_expenses');
  const [workouts] = useStoredList('lifeos_workouts');
  const [events] = useStoredList('lifeos_events');
  const [focus] = useStoredList('lifeos_focus');
  const [water, setWater] = useStoredObject('lifeos_water');
  const [sleep] = useStoredObject('lifeos_sleep');
  const [settings] = useStoredObject('lifeos_settings');
  return { tasks, habits, goals, journal, expenses, workouts, events, focus, water, setWater, sleep, settings };
}

export async function exportAll() {
  const pairs = await AsyncStorage.multiGet(KEYS);
  const out = {};
  pairs.forEach(([k, v]) => { if (v) out[k] = JSON.parse(v); });
  return JSON.stringify(out, null, 2);
}
export async function importAll(text) {
  const data = JSON.parse(text);
  const pairs = Object.entries(data)
    .filter(([k]) => KEYS.includes(k))
    .map(([k, v]) => [k, JSON.stringify(v)]);
  await AsyncStorage.multiSet(pairs);
  return pairs.length;
}
export const resetAll = () => AsyncStorage.multiRemove(KEYS);