import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { IconBubble, ProgressRing, Screen } from '../components/ui';
import { calcStreak, dayKey, daysUntil, money, useAllData } from '../lib/data';
import { insights, spendMonth } from '../lib/insights';
import { cancelIds, fmtIn, nextOccurrence } from '../lib/notify';
import { colors, radius, shadow, spacing } from '../theme/colors';

export default function Home() {
  const router = useRouter();
  const d: any = useAllData();
  const { tasks, setTasks, habits, setHabits, events, focus, water, setWater, settings, alarms } = d;
  const today = dayKey(0);

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const initial = (settings.name || 'L').trim().charAt(0).toUpperCase();

  const pending = tasks.filter((t: any) => !t.done);
  const habitsDone = habits.filter((h: any) => (h.log || []).includes(today)).length;
  const total = tasks.length + habits.length;
  const done = tasks.length - pending.length + habitsDone;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const waterGoal = settings.waterGoal || 8;
  const focusToday = focus.filter((f: any) => f.date === today).reduce((s: number, f: any) => s + f.minutes, 0);
  const best = Math.max(0, ...habits.map((h: any) => calcStreak(h.log || [])));
  const nextAlarm = alarms.filter((a: any) => a.enabled).map((a: any) => nextOccurrence(a)).filter(Boolean).sort((a: any, b: any) => a - b)[0];
  const upcoming = events.filter((e: any) => daysUntil(e.date) >= 0).sort((a: any, b: any) => a.date.localeCompare(b.date)).slice(0, 3);
  const tips = insights(d).slice(0, 3);

  const toggleTask = (t: any) => {
    if (!t.done && t.notifId) cancelIds([t.notifId]);
    setTasks((p: any[]) => p.map(x => (x.id === t.id ? { ...x, done: !x.done } : x)));
  };
  const toggleHabit = (id: string) =>
    setHabits((p: any[]) => p.map(h => {
      if (h.id !== id) return h;
      const log = h.log || [];
      return { ...h, log: log.includes(today) ? log.filter((x: string) => x !== today) : [...log, today] };
    }));

  const actions: any[] = [
    ['add-circle', 'Task', () => router.push('/explore')],
    ['timer', 'Focus', () => router.push('/focus')],
    ['water', '+1 Water', () => setWater((w: any) => ({ ...w, [today]: (w[today] || 0) + 1 }))],
    ['book', 'Journal', () => router.push('/journal')],
  ];

  const Tile = ({ icon, label, value, sub, onPress }: any) => (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <Card style={{ marginBottom: 0 }}>
        <IconBubble name={icon} size={36} />
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 10 }}>{value}</Text>
        <Text style={{ fontSize: 12, color: colors.textMuted }}>{label}</Text>
        {sub ? <Text style={{ fontSize: 11, color: colors.accent, marginTop: 2 }}>{sub}</Text> : null}
      </Card>
    </Pressable>
  );
  const heading = { fontSize: 16, fontWeight: '700' as const, color: colors.text };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>{greet}</Text>
            <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text }}>{settings.name || 'Welcome'}</Text>
          </View>
          <Pressable onPress={() => router.push('/search')} style={{ marginRight: spacing.md }}>
            <Ionicons name="search" size={22} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => router.push('/settings')} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 16 }}>{initial}</Text>
          </Pressable>
        </View>

        <View style={{ backgroundColor: colors.accent, borderRadius: radius.lg, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, ...shadow }}>
          <ProgressRing size={104} stroke={11} value={done} max={total}>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800' }}>{pct}%</Text>
          </ProgressRing>
          <View style={{ flex: 1, marginLeft: spacing.lg }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Today's progress</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 21, fontWeight: '700', marginTop: 2 }}>
              {total === 0 ? 'Add your first task' : `${done} of ${total} done`}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }}>
              {pending.length} tasks · {habits.length - habitsDone} habits left
            </Text>
            {nextAlarm ? (
              <Pressable onPress={() => router.push('/alarms')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Ionicons name="alarm" size={14} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontSize: 12, marginLeft: 4 }}>Alarm in {fmtIn(nextAlarm)}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
          {actions.map(([icon, text, onPress]) => (
            <Pressable key={text} onPress={onPress} style={{ alignItems: 'center', flex: 1 }}>
              <IconBubble name={icon} size={52} />
              <Text style={{ fontSize: 12, color: colors.text, marginTop: 6, fontWeight: '500' }}>{text}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
          <Tile icon="water" label="Water" value={`${water[today] || 0}/${waterGoal}`} onPress={() => router.push('/health')} />
          <Tile icon="timer" label="Focus today" value={`${focusToday}m`} onPress={() => router.push('/focus')} />
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          <Tile icon="flame" label="Best streak" value={`${best}d`} onPress={() => router.push('/habits')} />
          <Tile icon="wallet" label="Spent this month" value={money(spendMonth(d.expenses))} onPress={() => router.push('/expenses')} />
        </View>

        <Card style={{ backgroundColor: colors.accentSoft }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <Ionicons name="sparkles" size={18} color={colors.accent} />
            <Text style={[heading, { marginLeft: 6 }]}>Smart insights</Text>
          </View>
          {tips.map((t: string, i: number) => <Text key={i} style={{ color: colors.text, fontSize: 14, marginBottom: 4 }}>• {t}</Text>)}
          <Pressable onPress={() => router.push('/assistant')}>
            <Text style={{ color: colors.accent, fontSize: 13, fontWeight: '600', marginTop: 4 }}>Ask the assistant</Text>
          </Pressable>
        </Card>

        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <Text style={heading}>Tasks</Text>
            <Pressable onPress={() => router.push('/explore')}><Text style={{ color: colors.accent, fontSize: 13 }}>See all</Text></Pressable>
          </View>
          {pending.length === 0 ? <Text style={{ color: colors.textMuted }}>You're all caught up</Text> :
            pending.slice(0, 4).map((t: any) => (
              <Pressable key={t.id} onPress={() => toggleTask(t)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}>
                <Ionicons name="ellipse-outline" size={22} color={colors.outline} />
                <Text style={{ marginLeft: 10, color: colors.text, fontSize: 15, flex: 1 }}>{t.title}</Text>
              </Pressable>
            ))}
        </Card>

        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <Text style={heading}>Habits today</Text>
            <Pressable onPress={() => router.push('/habits')}><Text style={{ color: colors.accent, fontSize: 13 }}>See all</Text></Pressable>
          </View>
          {habits.length === 0 ? <Text style={{ color: colors.textMuted }}>No habits yet</Text> : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {habits.slice(0, 6).map((h: any) => {
                const on = (h.log || []).includes(today);
                return (
                  <Pressable key={h.id} onPress={() => toggleHabit(h.id)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: on ? colors.accent : colors.background, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 }}>
                    <Ionicons name={on ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={on ? '#FFFFFF' : colors.textMuted} />
                    <Text style={{ marginLeft: 6, fontSize: 13, color: on ? '#FFFFFF' : colors.text }}>{h.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </Card>

        <Card>
          <Text style={[heading, { marginBottom: spacing.sm }]}>Upcoming</Text>
          {upcoming.length === 0 ? <Text style={{ color: colors.textMuted }}>No upcoming events</Text> :
            upcoming.map((e: any) => {
              const n = daysUntil(e.date);
              return (
                <View key={e.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>{e.title}</Text>
                  <Text style={{ color: colors.accent, fontSize: 13, fontWeight: '600' }}>{n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : `In ${n} days`}</Text>
                </View>
              );
            })}
        </Card>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}