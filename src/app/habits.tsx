import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Card from '../components/Card';
import { AddRow, Empty, Header, IconButton, Screen } from '../components/ui';
import useStoredList, { calcStreak, dayKey, lastNDays, weekLabel } from '../lib/data';
import { cancelIds, scheduleDaily } from '../lib/notify';
import { colors, spacing } from '../theme/colors';

const SLOTS = [0, 7, 12, 18, 21];
const slotLabel = (h: number) => (h === 0 ? 'Remind me' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`);

export default function HabitsScreen() {
  const [habits, setHabits] = useStoredList('lifeos_habits');
  const [input, setInput] = useState('');
  const week = lastNDays(7);
  const today = dayKey(0);

  const add = () => {
    const title = input.trim();
    if (!title) return;
    setHabits((p: any[]) => [{ id: Date.now().toString(), title, log: [], remind: 0, notifId: null }, ...p]);
    setInput('');
  };
  const toggle = (id: string) =>
    setHabits((p: any[]) => p.map(h => {
      if (h.id !== id) return h;
      const log = h.log || [];
      return { ...h, log: log.includes(today) ? log.filter((d: string) => d !== today) : [...log, today] };
    }));
  const cycleReminder = async (h: any) => {
    const next = SLOTS[(SLOTS.indexOf(h.remind || 0) + 1) % SLOTS.length];
    await cancelIds(h.notifId ? [h.notifId] : []);
    const id = next ? await scheduleDaily(next, 0, 'Habit reminder', h.title) : null;
    setHabits((p: any[]) => p.map(x => (x.id === h.id ? { ...x, remind: id ? next : 0, notifId: id } : x)));
  };
  const remove = (h: any) => { if (h.notifId) cancelIds([h.notifId]); setHabits((p: any[]) => p.filter(x => x.id !== h.id)); };

  const doneToday = habits.filter((h: any) => (h.log || []).includes(today)).length;

  return (
    <Screen>
      <Header title="Habits" subtitle={`${doneToday} of ${habits.length} done today`} />
      <AddRow value={input} onChangeText={setInput} onSubmit={add} placeholder="New habit, e.g. Read 20 minutes" />
      <FlatList
        data={habits}
        keyExtractor={(i: any) => i.id}
        style={{ marginTop: spacing.md }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Empty text="No habits yet" icon="flame-outline" />}
        renderItem={({ item }: any) => {
          const log = item.log || [];
          const done = log.includes(today);
          const streak = calcStreak(log);
          const weekDone = week.filter(d => log.includes(d)).length;
          return (
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={() => toggle(item.id)}>
                  <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={30} color={done ? colors.accent : colors.outline} />
                </Pressable>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>{item.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <Ionicons name="flame" size={14} color={streak > 0 ? colors.warning : colors.outline} />
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>{streak} day streak · {weekDone}/7 this week</Text>
                  </View>
                </View>
                <IconButton name="trash-outline" onPress={() => remove(item)} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }}>
                {week.map(d => (
                  <View key={d} style={{ alignItems: 'center', flex: 1 }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: log.includes(d) ? colors.accent : colors.background, alignItems: 'center', justifyContent: 'center' }}>
                      {log.includes(d) ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
                    </View>
                    <Text style={{ fontSize: 10, color: d === today ? colors.accent : colors.textMuted, marginTop: 4, fontWeight: d === today ? '700' : '400' }}>{weekLabel(d)}</Text>
                  </View>
                ))}
              </View>
              <Pressable onPress={() => cycleReminder(item)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, alignSelf: 'flex-start' }}>
                <Ionicons name={item.remind ? 'notifications' : 'notifications-outline'} size={15} color={item.remind ? colors.accent : colors.textMuted} />
                <Text style={{ marginLeft: 6, fontSize: 12, color: item.remind ? colors.accent : colors.textMuted, fontWeight: '600' }}>
                  {slotLabel(item.remind || 0)}{item.remind ? ' daily' : ' (tap to cycle)'}
                </Text>
              </Pressable>
            </Card>
          );
        }}
      />
    </Screen>
  );
}