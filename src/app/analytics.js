import { ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { BarChart, Header, ProgressBar, Screen, Stat } from '../components/ui';
import { lastNDays, useAllData, weekLabel } from '../lib/data';
import { colors, spacing } from '../theme/colors';

export default function Analytics() {
  const { tasks, habits, focus, expenses, workouts } = useAllData();
  const days = lastNDays(7);
  const sum = (list, f) => list.reduce((s, x) => s + f(x), 0);

  const taskRate = tasks.length ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0;
  const habitDay = days.map(k => ({ label: weekLabel(k), value: habits.length ? Math.round((habits.filter(h => (h.log || []).includes(k)).length / habits.length) * 100) : 0 }));
  const habitRate = Math.round(sum(habitDay, d => d.value) / 7);
  const focusDay = days.map(k => ({ label: weekLabel(k), value: sum(focus.filter(f => f.date === k), f => f.minutes) }));
  const spendDay = days.map(k => ({ label: weekLabel(k), value: sum(expenses.filter(e => e.type === 'expense' && e.date === k), e => e.amount) }));
  const focusTotal = sum(focusDay, d => d.value);
  const workoutDays = new Set(workouts.filter(w => days.includes(w.date)).map(w => w.date)).size;
  const score = Math.round(0.4 * taskRate + 0.4 * habitRate + 0.2 * Math.min(100, focusTotal / 3));

  return (
    <Screen>
      <Header title="Analytics" subtitle="Your last 7 days" back />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Productivity score</Text>
          <Text style={{ fontSize: 40, fontWeight: '700', color: colors.accent }}>{score}<Text style={{ fontSize: 16, color: colors.textMuted }}> / 100</Text></Text>
          <ProgressBar value={score} max={100} />
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>40% task completion, 40% habit consistency, 20% focus time</Text>
        </Card>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          <Stat icon="checkbox-outline" label="Tasks done" value={`${taskRate}%`} />
          <Stat icon="flame-outline" label="Habits" value={`${habitRate}%`} />
          <Stat icon="barbell-outline" label="Gym days" value={workoutDays} />
        </View>
        <Card><Text style={{ fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>Habit consistency (%)</Text><BarChart data={habitDay} max={100} /></Card>
        <Card><Text style={{ fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>Focus minutes ({focusTotal} total)</Text><BarChart data={focusDay} /></Card>
        <Card><Text style={{ fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>Daily spending (₹)</Text><BarChart data={spendDay} /></Card>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}