import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { BarChart, Button, Header, IconButton, Input, ProgressBar, Screen } from '../components/ui';
import useStoredList, { dayKey, lastNDays, useStoredObject, weekLabel } from '../lib/data';
import { colors, spacing } from '../theme/colors';

export default function Health() {
  const [water, setWater] = useStoredObject('lifeos_water');
  const [sleep, setSleep] = useStoredObject('lifeos_sleep');
  const [weights, setWeights] = useStoredList('lifeos_weight');
  const [settings] = useStoredObject('lifeos_settings');
  const [hours, setHours] = useState('');
  const [kg, setKg] = useState('');

  const goal = settings.waterGoal || 8;
  const today = water[dayKey(0)] || 0;
  const days = lastNDays(7);
  const addWater = n => setWater(w => ({ ...w, [dayKey(0)]: Math.max(0, (w[dayKey(0)] || 0) + n) }));
  const logSleep = () => { const h = parseFloat(hours); if (!h || h > 24) return; setSleep(s => ({ ...s, [dayKey(0)]: h })); setHours(''); };
  const addWeight = () => { const w = parseFloat(kg); if (!w) return; setWeights(p => [{ id: Date.now().toString(), date: dayKey(0), kg: w }, ...p]); setKg(''); };
  const sleepVals = days.map(k => sleep[k]).filter(Boolean);
  const avgSleep = sleepVals.length ? (sleepVals.reduce((s, v) => s + v, 0) / sleepVals.length).toFixed(1) : '-';
  const change = weights.length > 1 ? (weights[0].kg - weights[weights.length - 1].kg).toFixed(1) : null;

  return (
    <Screen>
      <Header title="Health" subtitle="Water, sleep and weight" back />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={{ fontWeight: '600', color: colors.text }}>Water</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.sm }}>
            <Text style={{ flex: 1, fontSize: 28, fontWeight: '700', color: colors.accent }}>{today}<Text style={{ fontSize: 14, color: colors.textMuted }}> / {goal} glasses</Text></Text>
            <IconButton name="remove-circle-outline" size={32} onPress={() => addWater(-1)} />
            <IconButton name="add-circle-outline" size={32} color={colors.accent} onPress={() => addWater(1)} />
          </View>
          <ProgressBar value={today} max={goal} />
          <View style={{ marginTop: spacing.md }}><BarChart data={days.map(k => ({ label: weekLabel(k), value: water[k] || 0 }))} max={Math.max(goal, 1)} /></View>
        </Card>

        <Card>
          <Text style={{ fontWeight: '600', color: colors.text }}>Sleep (avg {avgSleep} h)</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.sm }}>
            <Input style={{ flex: 1 }} placeholder="Hours slept last night" keyboardType="numeric" value={hours} onChangeText={setHours} />
            <Button label="Log" onPress={logSleep} />
          </View>
          <BarChart data={days.map(k => ({ label: weekLabel(k), value: sleep[k] || 0 }))} max={10} />
        </Card>

        <Card>
          <Text style={{ fontWeight: '600', color: colors.text }}>Weight {weights[0] ? `· ${weights[0].kg} kg` : ''}{change !== null ? ` (${change > 0 ? '+' : ''}${change} overall)` : ''}</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.sm }}>
            <Input style={{ flex: 1 }} placeholder="Weight in kg" keyboardType="numeric" value={kg} onChangeText={setKg} />
            <Button label="Add" onPress={addWeight} />
          </View>
          {weights.slice(0, 5).map(w => <Text key={w.id} style={{ color: colors.textMuted, fontSize: 13 }}>{w.date}: {w.kg} kg</Text>)}
        </Card>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}