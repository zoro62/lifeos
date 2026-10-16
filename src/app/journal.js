import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Empty, Header, IconButton, Input, Screen } from '../components/ui';
import useStoredList, { dayKey, lastNDays } from '../lib/data';
import { colors, spacing } from '../theme/colors';

const MOODS = ['😞', '😕', '😐', '🙂', '😄'];

export default function Journal() {
  const [entries, setEntries] = useStoredList('lifeos_journal');
  const [mood, setMood] = useState(3);
  const [text, setText] = useState('');
  const [thanks, setThanks] = useState('');

  const save = () => {
    if (!text.trim() && !thanks.trim()) return;
    setEntries(p => [{ id: Date.now().toString(), date: dayKey(0), mood, text: text.trim(), thanks: thanks.trim() }, ...p]);
    setText(''); setThanks('');
  };
  const remove = id => setEntries(p => p.filter(e => e.id !== id));
  const recent = entries.filter(e => lastNDays(7).includes(e.date));
  const avg = recent.length ? recent.reduce((s, e) => s + e.mood, 0) / recent.length : null;

  return (
    <Screen>
      <Header title="Journal" subtitle={avg === null ? 'How was your day?' : `7-day average mood ${MOODS[Math.round(avg)]}`} back />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
        {MOODS.map((m, i) => (
          <Text key={i} onPress={() => setMood(i)} style={{ fontSize: 30, opacity: mood === i ? 1 : 0.3 }}>{m}</Text>
        ))}
      </View>
      <Input placeholder="Write about your day..." value={text} onChangeText={setText} multiline style={{ minHeight: 80, textAlignVertical: 'top' }} />
      <Input placeholder="One thing I'm grateful for" value={thanks} onChangeText={setThanks} style={{ marginTop: spacing.sm }} />
      <Button label="Save entry" onPress={save} style={{ marginTop: spacing.sm }} />
      <ScrollView style={{ marginTop: spacing.md }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {entries.length === 0 && <Empty text="No entries yet" icon="book-outline" />}
        {entries.map(e => (
          <Card key={e.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 24 }}>{MOODS[e.mood]}</Text>
              <Text style={{ flex: 1, marginLeft: spacing.sm, color: colors.textMuted, fontSize: 12 }}>{e.date}</Text>
              <IconButton name="trash-outline" onPress={() => remove(e.id)} />
            </View>
            {!!e.text && <Text style={{ color: colors.text, fontSize: 14, marginTop: 4 }}>{e.text}</Text>}
            {!!e.thanks && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Ionicons name="heart-outline" size={14} color={colors.accent} />
                <Text style={{ color: colors.textMuted, fontSize: 13, marginLeft: 6 }}>{e.thanks}</Text>
              </View>
            )}
          </Card>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}