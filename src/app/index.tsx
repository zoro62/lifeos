import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { Header, IconButton, ProgressBar, Screen, Stat } from '../components/ui';
import { dayKey, daysUntil, money, useAllData } from '../lib/data';
import { insights, spendMonth } from '../lib/insights';
import { colors, radius, spacing } from '../theme/colors';

export default function Dashboard() {
  const router = useRouter();
  const d: any = useAllData();
  const { tasks, habits, events, focus, water, settings, setWater } = d;

  const hour = new Date().getHours();
  const name = settings.name ? `, ${settings.name}` : '';
  const greeting = (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening') + name;
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  const pending = tasks.filter((t: any) => !t.done);
  const habitsDone = habits.filter((h: any) => (h.log || []).includes(dayKey(0))).length;
  const total = tasks.length + habits.length;
  const progress = tasks.length - pending.length + habitsDone;
  const waterToday = water[dayKey(0)] || 0;
  const waterGoal = settings.waterGoal || 8;
  const focusToday = focus.filter((f: any) => f.date === dayKey(0)).reduce((s: number, f: any) => s + f.minutes, 0);
  const upcoming = events.filter((e: any) => daysUntil(e.date) >= 0).sort((a: any, b: any) => a.date.localeCompare(b.date)).slice(0, 3);
  const tips = insights(d).slice(0, 3);

  const actions: any[] = [
    ['add-circle-outline', 'Task', () => router.push('/explore')],
    ['timer-outline', 'Focus', () => router.push('/focus')],
    ['water-outline', '+1 Water', () => setWater((w: any) => ({ ...w, [dayKey(0)]: (w[dayKey(0)] || 0) + 1 }))],
    ['book-outline', 'Journal', () => router.push('/journal')],
  ];
  const label: any = { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing.sm };
  const line: any = { fontSize: 14, color: colors.textMuted, marginBottom: 4 };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          title={greeting}
          subtitle={date}
          right={
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <IconButton name="search-outline" size={22} onPress={() => router.push('/search')} />
              <IconButton name="settings-outline" size={22} onPress={() => router.push('/settings')} />
            </View>
          }
        />

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          {actions.map(([icon, text, onPress]) => (
            <Pressable key={text} onPress={onPress} style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md }}>
              <Ionicons name={icon} size={22} color={colors.accent} />
              <Text style={{ fontSize: 11, color: colors.text, marginTop: 4 }}>{text}</Text>
            </Pressable>
          ))}
        </View>

        <Card>
          <Text style={label}>Today's progress</Text>
          <ProgressBar value={progress} max={total} />
          <Text style={[line, { marginTop: spacing.sm }]}>
            {total === 0 ? 'Add tasks or habits to get started' : `${progress} of ${total} done (tasks + habits)`}
          </Text>
        </Card>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          <Stat icon="water-outline" label="Water" value={`${waterToday}/${waterGoal}`} />
          <Stat icon="timer-outline" label="Focus min" value={focusToday} />
          <Stat icon="wallet-outline" label="Spent (month)" value={money(spendMonth(d.expenses))} />
        </View>

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <Ionicons name="sparkles-outline" size={18} color={colors.accent} />
            <Text style={[label, { marginBottom: 0, marginLeft: 6 }]}>Smart insights</Text>
          </View>
          {tips.map((t: string, i: number) => <Text key={i} style={line}>• {t}</Text>)}
          <Pressable onPress={() => router.push('/assistant')}>
            <Text style={{ color: colors.accent, fontSize: 13, marginTop: 4 }}>Ask the assistant</Text>
          </Pressable>
        </Card>

        <Pressable onPress={() => router.push('/explore')}>
          <Card>
            <Text style={label}>Today's tasks</Text>
            {pending.length === 0 ? <Text style={line}>You're all caught up</Text> :
              pending.slice(0, 3).map((t: any) => <Text key={t.id} style={line}>• {t.title}</Text>)}
            {pending.length > 3 && <Text style={line}>+ {pending.length - 3} more</Text>}
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push('/habits')}>
          <Card>
            <Text style={label}>Habits</Text>
            <ProgressBar value={habitsDone} max={habits.length} />
            <Text style={[line, { marginTop: spacing.sm }]}>
              {habits.length === 0 ? 'No habits yet' : `${habitsDone} of ${habits.length} done today`}
            </Text>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push('/calendar')}>
          <Card>
            <Text style={label}>Upcoming</Text>
            {upcoming.length === 0 ? <Text style={line}>No upcoming events</Text> :
              upcoming.map((e: any) => {
                const n = daysUntil(e.date);
                return <Text key={e.id} style={line}>• {e.title} ({n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`})</Text>;
              })}
          </Card>
        </Pressable>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}