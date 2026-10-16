import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Chip, Empty, Header, IconButton, Input, Screen } from '../components/ui';
import useStoredList, { dayKey } from '../lib/data';
import { colors, radius, spacing } from '../theme/colors';

const GAPS = [1, 2, 4, 7, 14, 30];

export default function Cards() {
  const [cards, setCards] = useStoredList('lifeos_cards');
  const [mode, setMode] = useState('Study');
  const [deck, setDeck] = useState('');
  const [newDeck, setNewDeck] = useState('General');
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [flip, setFlip] = useState(false);

  const decks = [...new Set(cards.map(c => c.deck))];
  const active = decks.includes(deck) ? deck : decks[0];
  const queue = cards.filter(c => c.deck === active && (c.due || '') <= dayKey(0)).sort((x, y) => (x.last || 0) - (y.last || 0));
  const current = queue[0];

  const add = () => {
    if (!q.trim() || !a.trim()) return;
    setCards(p => [{ id: Date.now().toString(), deck: newDeck.trim() || 'General', q: q.trim(), a: a.trim(), box: 0, due: dayKey(0), last: 0 }, ...p]);
    setQ(''); setA('');
  };
  const review = ok => {
    const box = ok ? Math.min((current.box || 0) + 1, 5) : 0;
    setCards(p => p.map(x => (x.id === current.id ? { ...x, box, last: Date.now(), due: ok ? dayKey(-GAPS[box]) : dayKey(0) } : x)));
    setFlip(false);
  };
  const remove = id => setCards(p => p.filter(c => c.id !== id));

  return (
    <Screen>
      <Header title="Flashcards" subtitle={`${cards.length} cards · spaced repetition`} back />
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
        {['Study', 'Manage'].map(m => <Chip key={m} label={m} active={mode === m} onPress={() => setMode(m)} />)}
      </View>
      {mode === 'Study' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {decks.length === 0 ? <Empty text="Add cards in Manage first" icon="layers-outline" /> : (
            <>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md }}>
                {decks.map(d => <Chip key={d} label={d} active={active === d} onPress={() => { setDeck(d); setFlip(false); }} />)}
              </View>
              {current ? (
                <>
                  <Text style={{ color: colors.textMuted, marginBottom: spacing.sm }}>{queue.length} due today</Text>
                  <Pressable onPress={() => setFlip(!flip)} style={{ minHeight: 200, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm }}>{flip ? 'ANSWER' : 'QUESTION (tap to flip)'}</Text>
                    <Text style={{ fontSize: 20, color: colors.text, textAlign: 'center' }}>{flip ? current.a : current.q}</Text>
                  </Pressable>
                  {flip && (
                    <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                      <Button label="Again" onPress={() => review(false)} style={{ flex: 1, backgroundColor: colors.danger }} />
                      <Button label="Got it" onPress={() => review(true)} style={{ flex: 1 }} />
                    </View>
                  )}
                </>
              ) : <Empty text="All done for today in this deck" icon="checkmark-done-outline" />}
            </>
          )}
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Input placeholder="Deck name" value={newDeck} onChangeText={setNewDeck} />
          <Input placeholder="Question" value={q} onChangeText={setQ} style={{ marginTop: spacing.sm }} />
          <Input placeholder="Answer" value={a} onChangeText={setA} style={{ marginTop: spacing.sm }} />
          <Button label="Add card" onPress={add} style={{ marginTop: spacing.sm }} />
          <View style={{ marginTop: spacing.md }}>
            {cards.map(c => (
              <Card key={c.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>{c.q}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{c.deck} · level {c.box || 0}</Text>
                </View>
                <IconButton name="trash-outline" onPress={() => remove(c.id)} />
              </Card>
            ))}
          </View>
          <View style={{ height: spacing.xl }} />
        </ScrollView>
      )}
    </Screen>
  );
}