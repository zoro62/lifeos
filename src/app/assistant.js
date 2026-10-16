import { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AddRow, Chip, Header, Screen } from '../components/ui';
import { useAllData } from '../lib/data';
import { answer } from '../lib/insights';
import { colors, radius, spacing } from '../theme/colors';

const SUGGEST = ['Summarize my day', 'Plan tomorrow', 'Which habit am I neglecting?', 'How much did I spend this month?', 'When did I last work out?', 'Which goal is falling behind?'];

export default function Assistant() {
  const data = useAllData();
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Hi! Ask me about your tasks, habits, goals, spending, workouts or sleep.' }]);
  const [input, setInput] = useState('');
  const ref = useRef(null);

  const send = q => {
    const text = (q ?? input).trim();
    if (!text) return;
    setMsgs(m => [...m, { from: 'me', text }, { from: 'bot', text: answer(text, data) }]);
    setInput('');
  };

  return (
    <Screen>
      <Header title="Assistant" subtitle="Answers from your own LifeOS data" back />
      <ScrollView ref={ref} style={{ flex: 1 }} onContentSizeChange={() => ref.current?.scrollToEnd({ animated: true })} showsVerticalScrollIndicator={false}>
        {msgs.map((m, i) => (
          <View key={i} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '85%', marginBottom: spacing.sm, backgroundColor: m.from === 'me' ? colors.accent : colors.surface, borderWidth: m.from === 'me' ? 0 : 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md }}>
            <Text style={{ color: m.from === 'me' ? '#FFFFFF' : colors.text, fontSize: 14 }}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginVertical: spacing.sm }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {SUGGEST.map(s => <Chip key={s} label={s} onPress={() => send(s)} />)}
        </View>
      </ScrollView>
      <View style={{ paddingBottom: spacing.md }}>
        <AddRow value={input} onChangeText={setInput} onSubmit={() => send()} placeholder="Ask something..." button="Send" />
      </View>
    </Screen>
  );
}