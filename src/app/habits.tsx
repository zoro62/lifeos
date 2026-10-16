import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Card from '../components/Card';
import { AddRow, Empty, Header, IconButton, Screen } from '../components/ui';
import useStoredList, { calcStreak, dayKey } from '../lib/data';
import { colors, spacing } from '../theme/colors';

const week = Array.from({ length: 7 }, (_, i) => dayKey(6 - i));

export default function HabitsScreen() {
  const [habits, setHabits] = useStoredList('lifeos_habits');
  const [input, setInput] = useState('');

  const add = () => {
    const title = input.trim();
    if (!title) return;
    setHabits((p: any[]) => [{ id: Date.now().toString(), title, log: [] }, ...p]);
    setInput('');
  };
  const toggleToday = (id: string) =>
    setHabits((p: any[]) => p.map(h => {
      if (h.id !== id) return h;
      const log = h.log || [];
      const t = dayKey(0);
      return { ...h, log: log.includes(t) ? log.filter((d: string) => d !== t) : [...log, t] };
    }));
  const remove = (id: string) => setHabits((p: any[]) => p.filter(h => h.id !== id));

  const doneToday = habits.filter((h: any) => (h.log || []).includes(dayKey(0))).length;

  return (
    <Screen>
      <Header title="Habits" subtitle={`${doneToday} of ${habits.length} done today`} />
      <AddRow value={input} onChangeText={setInput} onSubmit={add} placeholder="Add a habit..." />

      <FlatList
        data={habits}
        keyExtractor={(i: any) => i.id}
        style={{ marginTop: spacing.md }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Empty text="No habits yet" icon="flame-outline" />}
        renderItem={({ item }: any) => {
          const log = item.log || [];
          const done = log.includes(dayKey(0));
          const streak = calcStreak(log);
          return (
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Pressable onPress={() => toggleToday(item.id)}>
                  <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={28} color={done ? colors.accent : colors.border} />
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, color: colors.text, fontWeight: '500' }}>{item.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Ionicons name="flame" size={13} color={streak > 0 ? colors.accent : colors.border} />
                    <Text style={{ fontSize: 12, color: colors.textMuted, marginLeft: 4 }}>{streak} day streak</Text>
                  </View>
                </View>
                <IconButton name="trash-outline" onPress={() => remove(item.id)} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }}>
                {week.map(d => (
                  <View key={d} style={{
                    width: 30, height: 8, borderRadius: 4,
                    backgroundColor: log.includes(d) ? colors.accent : colors.border,
                  }} />
                ))}
              </View>
            </Card>
          );
        }}
      />
    </Screen>
  );
}