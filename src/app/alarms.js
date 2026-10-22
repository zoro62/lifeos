import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Chip, Empty, Header, IconButton, Input, Screen } from '../components/ui';
import useStoredList from '../lib/data';
import { cancelIds, daysSummary, fmtIn, fmtTime, nextOccurrence, notificationsAvailable, scheduleAlarm, scheduleAt } from '../lib/notify';
import { colors, spacing } from '../theme/colors';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const pad = n => String(n).padStart(2, '0');

function Stepper({ value, onUp, onDown }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton name="chevron-up" size={26} color={colors.accent} onPress={onUp} />
      <Text style={{ fontSize: 48, fontWeight: '800', color: colors.text, minWidth: 80, textAlign: 'center' }}>{value}</Text>
      <IconButton name="chevron-down" size={26} color={colors.accent} onPress={onDown} />
    </View>
  );
}

export default function Alarms() {
  const [alarms, setAlarms] = useStoredList('lifeos_alarms');
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [pm, setPm] = useState(false);
  const [label, setLabel] = useState('');
  const [days, setDays] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const now = new Date();
    const expired = alarms.some(a => a.enabled && a.days.length === 0 && a.onceAt && new Date(a.onceAt) <= now);
    if (expired) {
      setAlarms(p => p.map(a => (a.enabled && a.days.length === 0 && a.onceAt && new Date(a.onceAt) <= now ? { ...a, enabled: false, ids: [] } : a)));
    }
  }, [alarms]);

  const denied = notificationsAvailable()
    ? 'Could not schedule. Allow notifications for Expo Go in your phone settings.'
    : 'Alarms need a newer Expo Go. Update Expo Go from the Play Store, then reopen the app.';

  const toggleDay = d => setDays(p => (p.includes(d) ? p.filter(x => x !== d) : [...p, d]));

  const create = async () => {
    const base = {
      id: Date.now().toString(),
      hour: (hour % 12) + (pm ? 12 : 0),
      minute,
      label: label.trim() || 'Alarm',
      days: [...days].sort(),
      enabled: true
    };

    const res = await scheduleAlarm(base);
    setMsg(res.ok ? '' : denied);
    setAlarms(p => [{ ...base, ids: res.ids, onceAt: res.onceAt, enabled: res.ok }, ...p]);
    setLabel('');
  };

  const toggle = async a => {
    if (a.enabled) {
      await cancelIds(a.ids);
      setAlarms(p => p.map(x => (x.id === a.id ? { ...x, enabled: false, ids: [] } : x)));
    } else {
      const res = await scheduleAlarm(a);
      setMsg(res.ok ? '' : denied);
      setAlarms(p => p.map(x => (x.id === a.id ? { ...x, enabled: res.ok, ids: res.ids, onceAt: res.onceAt } : x)));
    }
  };

  const remove = async a => {
    await cancelIds(a.ids);
    setAlarms(p => p.filter(x => x.id !== a.id));
  };

  const test = async () => {
    const id = await scheduleAt(
      new Date(Date.now() + 5000),
      'Test alarm',
      'LifeOS alarms are working'
    );
    setMsg(id ? 'Test alarm will ring in 5 seconds. You can lock your phone now.' : denied);
  };

  const upcoming = alarms
    .filter(a => a.enabled)
    .map(a => nextOccurrence(a))
    .filter(Boolean)
    .sort((a, b) => a - b)[0];

  return (
    <Screen>
      <Header
        title="Alarms"
        subtitle={upcoming ? `Next alarm in ${fmtIn(upcoming)}` : 'No alarm is on'}
      />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Stepper
              value={pad(hour)}
              onUp={() => setHour(h => (h % 12) + 1)}
              onDown={() => setHour(h => (h === 1 ? 12 : h - 1))}
            />

            <Text style={{ fontSize: 44, fontWeight: '800', color: colors.text, marginHorizontal: 4 }}>
              :
            </Text>

            <Stepper
              value={pad(minute)}
              onUp={() => setMinute(m => (m + 5) % 60)}
              onDown={() => setMinute(m => (m + 55) % 60)}
            />

            <View style={{ marginLeft: spacing.md, gap: spacing.sm }}>
              <Chip label="AM" active={!pm} onPress={() => setPm(false)} />
              <Chip label="PM" active={pm} onPress={() => setPm(true)} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.sm }}>
            {[0, 15, 30, 45].map(m => (
              <Chip
                key={m}
                label={`:${pad(m)}`}
                active={minute === m}
                onPress={() => setMinute(m)}
              />
            ))}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: spacing.md }}>
            {DAYS.map((d, i) => (
              <Pressable
                key={i}
                onPress={() => toggleDay(i)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: days.includes(i) ? colors.accent : colors.background
                }}
              >
                <Text style={{ color: days.includes(i) ? '#FFFFFF' : colors.textMuted, fontWeight: '700' }}>
                  {d}
                </Text>
              </Pressable>
            ))}
          </View>

          <Input
            placeholder="Label (e.g. Wake up, Gym, Study)"
            value={label}
            onChangeText={setLabel}
          />

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
            <Button label="Add alarm" onPress={create} style={{ flex: 1 }} />
            <Button
              label="Test"
              onPress={test}
              style={{ backgroundColor: colors.textMuted, paddingHorizontal: spacing.lg }}
            />
          </View>

          <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: spacing.sm }}>
            No days selected means the alarm rings once. Alarms ring as high-priority notifications, so keep your volume up and notifications allowed.
          </Text>

          {!!msg && (
            <Text style={{ color: colors.accent, fontSize: 12, marginTop: 6 }}>
              {msg}
            </Text>
          )}
        </Card>

        {alarms.length === 0 && <Empty text="No alarms yet" icon="alarm-outline" />}

        {alarms.map(a => (
          <Card key={a.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, opacity: a.enabled ? 1 : 0.5 }}>
              <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text }}>
                {fmtTime(a.hour, a.minute)}
              </Text>

              <Text style={{ fontSize: 13, color: colors.textMuted }}>
                {a.label} · {daysSummary(a.days)}
              </Text>
            </View>

            <Switch
              value={a.enabled}
              onValueChange={() => toggle(a)}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
            />

            <IconButton
              name="trash-outline"
              onPress={() => remove(a)}
            />
          </Card>
        ))}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}