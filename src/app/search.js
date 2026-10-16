import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { Empty, Header, Input, Screen } from '../components/ui';
import useStoredList from '../lib/data';
import { colors, spacing } from '../theme/colors';

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [tasks] = useStoredList('lifeos_tasks');
  const [notes] = useStoredList('lifeos_notes');
  const [journal] = useStoredList('lifeos_journal');
  const [goals] = useStoredList('lifeos_goals');
  const [events] = useStoredList('lifeos_events');
  const [cards] = useStoredList('lifeos_cards');
  const [expenses] = useStoredList('lifeos_expenses');

  const all = [
    ...tasks.map(t => ({ type: 'Task', icon: 'checkbox-outline', title: t.title, sub: t.priority, route: '/explore' })),
    ...notes.map(n => ({ type: 'Note', icon: 'document-text-outline', title: n.title || (n.text || '').slice(0, 40), sub: n.text, route: '/notes' })),
    ...journal.map(j => ({ type: 'Journal', icon: 'book-outline', title: j.date, sub: `${j.text || ''} ${j.thanks || ''}`, route: '/journal' })),
    ...goals.map(g => ({ type: 'Goal', icon: 'flag-outline', title: g.title, sub: g.unit, route: '/goals' })),
    ...events.map(e => ({ type: 'Event', icon: 'calendar-outline', title: e.title, sub: e.date, route: '/calendar' })),
    ...cards.map(c => ({ type: 'Card', icon: 'layers-outline', title: c.q, sub: c.a, route: '/cards' })),
    ...expenses.map(e => ({ type: 'Expense', icon: 'wallet-outline', title: `${e.category} ${e.amount}`, sub: e.note, route: '/expenses' })),
  ];
  const q = query.trim().toLowerCase();
  const results = q ? all.filter(i => `${i.title} ${i.sub || ''}`.toLowerCase().includes(q)).slice(0, 40) : [];

  return (
    <Screen>
      <Header title="Search" subtitle="Across every module" back />
      <Input placeholder="Search tasks, notes, goals, events..." value={query} onChangeText={setQuery} autoFocus />
      <ScrollView style={{ marginTop: spacing.md }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {q !== '' && results.length === 0 && <Empty text="No matches" icon="search-outline" />}
        {results.map((r, i) => (
          <Pressable key={i} onPress={() => router.push(r.route)}>
            <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={r.icon} size={20} color={colors.accent} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text numberOfLines={1} style={{ color: colors.text, fontSize: 15 }}>{r.title}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>{r.type}</Text>
              </View>
            </Card>
          </Pressable>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}