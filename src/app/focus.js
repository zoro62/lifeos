import { useEffect, useRef, useState } from 'react';
import { Text, Vibration, View } from 'react-native';
import Card from '../components/Card';
import { BarChart, Button, Chip, Header, Screen } from '../components/ui';
import useStoredList, { dayKey, lastNDays, weekLabel } from '../lib/data';
import { colors, spacing } from '../theme/colors';

const MODES = { Focus: 25, 'Short break': 5, 'Long break': 15 };
const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function Focus() {
  const [log, setLog] = useStoredList('lifeos_focus');
  const [mode, setMode] = useState('Focus');
  const [minutes, setMinutes] = useState(25);
  const [left, setLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const rem = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setLeft(rem);
      if (rem === 0) {
        clearInterval(id);
        setRunning(false);
        Vibration.vibrate([0, 400, 200, 400]);
        if (mode === 'Focus') setLog(p => [...p, { id: Date.now().toString(), date: dayKey(0), minutes }]);
      }
    }, 500);
    return () => clearInterval(id);
  }, [running]);

  const setLength = (m, n) => { if (running) return; setMode(m); setMinutes(n); setLeft(n * 60); };
  const start = () => { endAt.current = Date.now() + left * 1000; setRunning(true); };
  const reset = () => { setRunning(false); setLeft(minutes * 60); };

  const today = log.filter(l => l.date === dayKey(0));
  const todayMin = today.reduce((s, l) => s + l.minutes, 0);
  const chart = lastNDays(7).map(k => ({ label: weekLabel(k), value: log.filter(l => l.date === k).reduce((s, l) => s + l.minutes, 0) }));

  return (
    <Screen>
      <Header title="Focus timer" subtitle={`${today.length} sessions · ${todayMin} min today`} back />
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
        {Object.keys(MODES).map(m => <Chip key={m} label={m} active={mode === m} onPress={() => setLength(m, MODES[m])} />)}
      </View>
      {mode === 'Focus' && (
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {[15, 25, 45, 60].map(n => <Chip key={n} label={`${n}m`} active={minutes === n} onPress={() => setLength('Focus', n)} />)}
        </View>
      )}
      <View style={{ alignItems: 'center', marginVertical: spacing.xl }}>
        <View style={{ width: 220, height: 220, borderRadius: 110, borderWidth: 6, borderColor: running ? colors.accent : colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}>
          <Text style={{ fontSize: 52, fontWeight: '700', color: colors.text }}>{fmt(left)}</Text>
          <Text style={{ color: colors.textMuted }}>{mode}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Button label={running ? 'Pause' : 'Start'} onPress={running ? () => setRunning(false) : start} style={{ flex: 1 }} />
        <Button label="Reset" onPress={reset} style={{ flex: 1, backgroundColor: colors.textMuted }} />
      </View>
      <Card style={{ marginTop: spacing.lg }}>
        <Text style={{ fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>Focus minutes, last 7 days</Text>
        <BarChart data={chart} />
      </Card>
    </Screen>
  );
}