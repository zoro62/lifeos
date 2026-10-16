import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Chip, Empty, Header, IconButton, Input, Screen } from '../components/ui';
import useStoredList, { dayKey, daysUntil } from '../lib/data';
import { colors, spacing } from '../theme/colors';

const TYPES = ['Exam', 'Meeting', 'Birthday', 'Travel', 'Other'];
const ICONS = { Exam: 'school-outline', Meeting: 'people-outline', Birthday: 'gift-outline', Travel: 'airplane-outline', Other: 'calendar-outline' };
const when = n => (n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n > 1 ? `In ${n} days` : `${-n} days ago`);

export default function Calendar() {
  const [events, setEvents] = useStoredList('lifeos_events');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(dayKey(0));
  const [time, setTime] = useState('');
  const [type, setType] = useState('Other');
  const [view, setView] = useState('Upcoming');

  const add = () => {
    if (!title.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    setEvents(p => [...p, { id: Date.now().toString(), title: title.trim(), date, time: time.trim(), type }]);
    setTitle(''); setTime('');
  };
  const remove = id => setEvents(p => p.filter(e => e.id !== id));
  const shown = events
    .filter(e => (view === 'Upcoming' ? daysUntil(e.date) >= 0 : daysUntil(e.date) < 0))
    .sort((a, b) => (view === 'Upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));

  return (
    <Screen>
      <Header title="Calendar" subtitle={`${events.filter(e => daysUntil(e.date) >= 0).length} upcoming`} back />
      <Input placeholder="Event title" value={title} onChangeText={setTitle} />
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        <Input style={{ flex: 1 }} placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />
        <Input style={{ width: 90 }} placeholder="Time" value={time} onChangeText={setTime} />
        <Button label="Add" onPress={add} />
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        <Chip label="Today" onPress={() => setDate(dayKey(0))} />
        <Chip label="Tomorrow" onPress={() => setDate(dayKey(-1))} />
        <Chip label="Next week" onPress={() => setDate(dayKey(-7))} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm }}>
        {TYPES.map(t => <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} />)}
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.md }}>
        {['Upcoming', 'Past'].map(v => <Chip key={v} label={v} active={view === v} onPress={() => setView(v)} />)}
      </View>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {shown.length === 0 && <Empty text="Nothing here" icon="calendar-outline" />}
        {shown.map(e => (
          <Card key={e.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={ICONS[e.type] || ICONS.Other} size={22} color={colors.accent} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: '500' }}>{e.title}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>{e.date}{e.time ? ` · ${e.time}` : ''} · {when(daysUntil(e.date))}</Text>
            </View>
            <IconButton name="trash-outline" onPress={() => remove(e.id)} />
          </Card>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}