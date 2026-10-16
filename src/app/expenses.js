import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Chip, Empty, Header, IconButton, Input, ProgressBar, Screen } from '../components/ui';
import useStoredList, { dayKey, money, useStoredObject } from '../lib/data';
import { colors, spacing } from '../theme/colors';

const CATS = { expense: ['Food', 'Travel', 'Bills', 'Shopping', 'Study', 'Other'], income: ['Allowance', 'Salary', 'Other'] };

export default function Expenses() {
  const [items, setItems] = useStoredList('lifeos_expenses');
  const [settings, setSettings] = useStoredObject('lifeos_settings');
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState('Food');
  const [note, setNote] = useState('');

  const month = dayKey(0).slice(0, 7);
  const inMonth = items.filter(e => e.date.startsWith(month));
  const spent = inMonth.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const earned = inMonth.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const budget = settings.budget || 0;
  const by = {};
  inMonth.filter(e => e.type === 'expense').forEach(e => { by[e.category] = (by[e.category] || 0) + e.amount; });

  const switchType = t => { setType(t); setCat(CATS[t][0]); };
  const add = () => {
    const a = parseFloat(amount);
    if (!a || a <= 0) return;
    setItems(p => [{ id: Date.now().toString(), type, amount: a, category: cat, note: note.trim(), date: dayKey(0) }, ...p]);
    setAmount(''); setNote('');
  };
  const remove = id => setItems(p => p.filter(e => e.id !== id));

  return (
    <Screen>
      <Header title="Expenses" subtitle={`This month: ${money(earned - spent)} balance`} back />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View><Text style={{ color: colors.textMuted, fontSize: 12 }}>Spent</Text><Text style={{ color: colors.danger, fontSize: 20, fontWeight: '700' }}>{money(spent)}</Text></View>
            <View><Text style={{ color: colors.textMuted, fontSize: 12 }}>Income</Text><Text style={{ color: colors.success, fontSize: 20, fontWeight: '700' }}>{money(earned)}</Text></View>
          </View>
          <Input placeholder="Monthly budget (₹)" keyboardType="numeric" value={budget ? String(budget) : ''} onChangeText={v => setSettings(s => ({ ...s, budget: parseInt(v) || 0 }))} style={{ marginTop: spacing.md }} />
          {budget > 0 && (
            <View style={{ marginTop: spacing.sm }}>
              <ProgressBar value={spent} max={budget} />
              <Text style={{ fontSize: 12, color: spent > budget ? colors.danger : colors.textMuted, marginTop: 4 }}>
                {spent > budget ? `Over budget by ${money(spent - budget)}` : `${money(budget - spent)} left of ${money(budget)}`}
              </Text>
            </View>
          )}
          {Object.entries(by).sort((a, b) => b[1] - a[1]).map(([c, v]) => (
            <View key={c} style={{ marginTop: spacing.sm }}>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>{c} · {money(v)}</Text>
              <ProgressBar value={v} max={spent} />
            </View>
          ))}
        </Card>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
          <Chip label="Expense" active={type === 'expense'} onPress={() => switchType('expense')} />
          <Chip label="Income" active={type === 'income'} onPress={() => switchType('income')} />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm }}>
          {CATS[type].map(c => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Input style={{ width: 110 }} placeholder="Amount" keyboardType="numeric" value={amount} onChangeText={setAmount} />
          <Input style={{ flex: 1 }} placeholder="Note (optional)" value={note} onChangeText={setNote} />
          <Button label="Add" onPress={add} />
        </View>

        <View style={{ marginTop: spacing.md }}>
          {items.length === 0 && <Empty text="No transactions yet" icon="wallet-outline" />}
          {items.slice(0, 40).map(e => (
            <Card key={e.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 15 }}>{e.category}{e.note ? ` · ${e.note}` : ''}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>{e.date}</Text>
              </View>
              <Text style={{ fontWeight: '700', color: e.type === 'expense' ? colors.danger : colors.success }}>{e.type === 'expense' ? '-' : '+'}{money(e.amount)}</Text>
              <IconButton name="trash-outline" onPress={() => remove(e.id)} />
            </Card>
          ))}
        </View>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}