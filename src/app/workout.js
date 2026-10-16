import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Chip, Empty, Header, IconButton, Input, Screen, Stat } from '../components/ui';
import useStoredList, { calcStreak, dayKey, lastNDays } from '../lib/data';
import { colors, spacing } from '../theme/colors';

export default function Workout() {
  const [items, setItems] = useStoredList('lifeos_workouts');
  const [name, setName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const add = () => {
    if (!name.trim()) return;
    setItems(p => [{ id: Date.now().toString(), date: dayKey(0), name: name.trim(), sets: parseInt(sets) || 1, reps: parseInt(reps) || 1, weight: parseFloat(weight) || 0 }, ...p]);
    setSets(''); setReps(''); setWeight('');
  };
  const remove = id => setItems(p => p.filter(w => w.id !== id));

  const dates = [...new Set(items.map(w => w.date))];
  const week = items.filter(w => lastNDays(7).includes(w.date));
  const volume = week.reduce((s, w) => s + w.sets * w.reps * w.weight, 0);
  const recent = [...new Set(items.map(w => w.name))].slice(0, 5);

  return (
    <Screen>
      <Header title="Workout" subtitle="Log your gym sessions" back />
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
        <Stat icon="flame-outline" label="Gym streak" value={`${calcStreak(dates)}d`} />
        <Stat icon="calendar-outline" label="Days this week" value={new Set(week.map(w => w.date)).size} />
        <Stat icon="barbell-outline" label="Volume (kg)" value={Math.round(volume)} />
      </View>
      <Input placeholder="Exercise (e.g. Bench press)" value={name} onChangeText={setName} />
      {recent.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm }}>
          {recent.map(r => <Chip key={r} label={r} onPress={() => setName(r)} />)}
        </View>
      )}
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        <Input style={{ flex: 1 }} placeholder="Sets" keyboardType="numeric" value={sets} onChangeText={setSets} />
        <Input style={{ flex: 1 }} placeholder="Reps" keyboardType="numeric" value={reps} onChangeText={setReps} />
        <Input style={{ flex: 1 }} placeholder="Kg" keyboardType="numeric" value={weight} onChangeText={setWeight} />
        <Button label="Add" onPress={add} />
      </View>
      <ScrollView style={{ marginTop: spacing.md }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {items.length === 0 && <Empty text="No workouts logged" icon="barbell-outline" />}
        {items.slice(0, 40).map(w => (
          <Card key={w.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: '500' }}>{w.name}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>{w.sets} x {w.reps} @ {w.weight} kg · {w.date}</Text>
            </View>
            <IconButton name="trash-outline" onPress={() => remove(w.id)} />
          </Card>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}