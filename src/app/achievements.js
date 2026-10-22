import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { Header, IconBubble, ProgressBar, Screen } from '../components/ui';
import useStoredList, { calcStreak, useAllData } from '../lib/data';
import { colors, spacing } from '../theme/colors';

export default function Achievements() {
  const d = useAllData();
  const [notes] = useStoredList('lifeos_notes');
  const [cards] = useStoredList('lifeos_cards');

  const tasksDone = d.tasks.filter(t => t.done).length;
  const best = Math.max(0, ...d.habits.map(h => calcStreak(h.log || [])));
  const focusTotal = d.focus.reduce((s, f) => s + f.minutes, 0);
  const waterDays = Object.values(d.water).filter(v => v >= (d.settings.waterGoal || 8)).length;
  const gymDays = new Set(d.workouts.map(w => w.date)).size;
  const goalsDone = d.goals.filter(g => g.current >= g.target).length;

  const badges = [
    ['checkmark-circle', 'First step', 'Complete 1 task', tasksDone, 1],
    ['ribbon', 'Task master', 'Complete 25 tasks', tasksDone, 25],
    ['flame', 'On fire', 'Reach a 7-day habit streak', best, 7],
    ['rocket', 'Unstoppable', 'Reach a 30-day habit streak', best, 30],
    ['timer', 'Deep worker', 'Focus for 100 minutes', focusTotal, 100],
    ['water', 'Hydrated', 'Hit your water goal on 3 days', waterDays, 3],
    ['barbell', 'Gym regular', 'Work out on 5 different days', gymDays, 5],
    ['book', 'Reflective', 'Write 5 journal entries', d.journal.length, 5],
    ['wallet', 'Money aware', 'Log 10 transactions', d.expenses.length, 10],
    ['flag', 'Goal getter', 'Finish 1 goal', goalsDone, 1],
    ['document-text', 'Note taker', 'Save 10 notes', notes.length, 10],
    ['layers', 'Scholar', 'Create 20 flashcards', cards.length, 20],
  ];
  const unlocked = badges.filter(b => b[3] >= b[4]).length;
  const level = Math.floor(unlocked / 3) + 1;

  return (
    <Screen>
      <Header title="Achievements" subtitle={`${unlocked} of ${badges.length} unlocked`} back />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={{ backgroundColor: colors.accent }}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Your level</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 38, fontWeight: '800' }}>Level {level}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Unlock {3 - (unlocked % 3)} more badge{3 - (unlocked % 3) === 1 ? '' : 's'} to level up</Text>
        </Card>
        {badges.map(([icon, name, desc, value, target]) => {
          const on = value >= target;
          return (
            <Card key={name} style={{ flexDirection: 'row', alignItems: 'center', opacity: on ? 1 : 0.85 }}>
              <IconBubble name={icon} size={48} color={on ? '#FFFFFF' : colors.textMuted} bg={on ? colors.accent : colors.background} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{name}</Text>
                <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 6 }}>{desc}</Text>
                <ProgressBar value={Math.min(value, target)} max={target} color={on ? colors.success : colors.accent} />
              </View>
              {on ? <Ionicons name="checkmark-circle" size={22} color={colors.success} style={{ marginLeft: 8 }} /> : <Text style={{ marginLeft: 8, fontSize: 12, color: colors.textMuted }}>{Math.min(value, target)}/{target}</Text>}
            </Card>
          );
        })}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}