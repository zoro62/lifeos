import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Empty, Header, IconButton, Input, ProgressBar, Screen } from '../components/ui';
import useStoredList, { daysUntil } from '../lib/data';
import { colors, spacing } from '../theme/colors';

export default function Goals() {
  const [goals, setGoals] = useStoredList('lifeos_goals');
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [deadline, setDeadline] = useState('');

  const add = () => {
    const n = parseInt(target) || 0;
    if (!title.trim() || n <= 0) return;
    setGoals(p => [{ id: Date.now().toString(), title: title.trim(), target: n, current: 0, unit: unit.trim(), deadline: /^\d{4}-\d{2}-\d{2}$/.test(deadline) ? deadline : '' }, ...p]);
    setTitle(''); setTarget(''); setUnit(''); setDeadline('');
  };
  const bump = (id, dir) => setGoals(p => p.map(g => g.id === id
    ? { ...g, current: Math.max(0, Math.min(g.target, g.current + dir * Math.max(1, Math.round(g.target / 10)))) } : g));
  const remove = id => setGoals(p => p.filter(g => g.id !== id));

  return (
    <Screen>
      <Header title="Goals" subtitle={`${goals.filter(g => g.current >= g.target).length} of ${goals.length} achieved`} back />
      <Input placeholder="Goal (e.g. Learn React)" value={title} onChangeText={setTitle} />
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        <Input style={{ flex: 1 }} placeholder="Target" keyboardType="numeric" value={target} onChangeText={setTarget} />
        <Input style={{ flex: 1 }} placeholder="Unit (hrs, books)" value={unit} onChangeText={setUnit} />
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        <Input style={{ flex: 1 }} placeholder="Deadline YYYY-MM-DD (optional)" value={deadline} onChangeText={setDeadline} />
        <Button label="Add" onPress={add} />
      </View>
      <ScrollView style={{ marginTop: spacing.md }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {goals.length === 0 && <Empty text="No goals yet" icon="flag-outline" />}
        {goals.map(g => {
          const pct = Math.round((g.current / g.target) * 100);
          const left = g.deadline ? daysUntil(g.deadline) : null;
          return (
            <Card key={g.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {pct >= 100 && <Ionicons name="checkmark-circle" size={20} color={colors.accent} style={{ marginRight: 6 }} />}
                <Text style={{ flex: 1, fontSize: 16, fontWeight: '600', color: colors.text }}>{g.title}</Text>
                <IconButton name="trash-outline" onPress={() => remove(g.id)} />
              </View>
              <View style={{ marginVertical: spacing.sm }}><ProgressBar value={g.current} max={g.target} /></View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, color: colors.textMuted }}>{g.current} / {g.target} {g.unit} · {pct}%</Text>
                  {left !== null && <Text style={{ fontSize: 12, color: left < 0 ? colors.danger : colors.textMuted }}>{left < 0 ? 'Overdue' : left === 0 ? 'Due today' : `${left} days left`}</Text>}
                </View>
                <IconButton name="remove-circle-outline" size={28} onPress={() => bump(g.id, -1)} />
                <IconButton name="add-circle-outline" size={28} color={colors.accent} onPress={() => bump(g.id, 1)} />
              </View>
            </Card>
          );
        })}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}