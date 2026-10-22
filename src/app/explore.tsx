import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Card from '../components/Card';
import { AddRow, Chip, Empty, Header, IconButton, Screen, Tag } from '../components/ui';
import useStoredList, { dayKey, daysUntil } from '../lib/data';
import { cancelIds, scheduleAt } from '../lib/notify';
import { colors, spacing } from '../theme/colors';

const PRIORITIES = ['Low', 'Medium', 'High'];
const weight: any = { High: 0, Medium: 1, Low: 2 };
const tint: any = { High: colors.danger, Medium: colors.accent, Low: colors.textMuted };
const soft: any = { High: colors.dangerSoft, Medium: colors.accentSoft, Low: colors.background };
const DUES: any[] = [['No date', -1], ['Today', 0], ['Tomorrow', 1], ['Next week', 7]];
const REMINDS: any[] = [['No reminder', null], ['9 AM', 9], ['2 PM', 14], ['7 PM', 19]];

export default function TasksScreen() {
  const [tasks, setTasks] = useStoredList('lifeos_tasks');
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueOpt, setDueOpt] = useState(-1);
  const [remind, setRemind] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');

  const add = async () => {
    const title = input.trim();
    if (!title) return;
    const due = dueOpt >= 0 ? dayKey(-dueOpt) : '';
    let notifId = null;
    if (due && remind !== null) {
      notifId = await scheduleAt(new Date(`${due}T${String(remind).padStart(2, '0')}:00:00`), 'Task due', title);
    }
    setTasks((p: any[]) => [{ id: Date.now().toString(), title, done: false, priority, due, remind, notifId }, ...p]);
    setInput('');
  };
  const toggle = (t: any) => {
    if (!t.done && t.notifId) cancelIds([t.notifId]);
    setTasks((p: any[]) => p.map(x => (x.id === t.id ? { ...x, done: !x.done } : x)));
  };
  const remove = (t: any) => { if (t.notifId) cancelIds([t.notifId]); setTasks((p: any[]) => p.filter(x => x.id !== t.id)); };
  const clearDone = () => setTasks((p: any[]) => p.filter(x => !x.done));

  const left = tasks.filter((t: any) => !t.done).length;
  const visible = tasks
    .filter((t: any) => {
      if (filter === 'Active') return !t.done;
      if (filter === 'Done') return t.done;
      if (filter === 'Today') return !t.done && t.due && daysUntil(t.due) <= 0;
      return true;
    })
    .sort((a: any, b: any) =>
      Number(a.done) - Number(b.done) ||
      (weight[a.priority] ?? 1) - (weight[b.priority] ?? 1) ||
      (a.due || '9999').localeCompare(b.due || '9999'));

  const dueTag = (t: any) => {
    if (!t.due) return null;
    const n = daysUntil(t.due);
    if (t.done) return <Tag label={t.due} />;
    if (n < 0) return <Tag label="Overdue" color={colors.danger} bg={colors.dangerSoft} />;
    return <Tag label={n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : t.due} color={colors.accent} bg={colors.accentSoft} />;
  };

  const row: any = { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap', alignItems: 'center' };

  return (
    <Screen>
      <Header title="Tasks" subtitle={`${left} left · ${tasks.length} total`} />
      <AddRow value={input} onChangeText={setInput} onSubmit={add} placeholder="What needs doing?" />
      <View style={row}>
        {PRIORITIES.map(p => <Chip key={p} label={p} active={priority === p} onPress={() => setPriority(p)} />)}
      </View>
      <View style={row}>
        <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
        {DUES.map(([l, v]) => <Chip key={l} label={l} active={dueOpt === v} onPress={() => setDueOpt(v)} />)}
      </View>
      {dueOpt >= 0 && (
        <View style={row}>
          <Ionicons name="notifications-outline" size={16} color={colors.textMuted} />
          {REMINDS.map(([l, v]) => <Chip key={l} label={l} active={remind === v} onPress={() => setRemind(v)} />)}
        </View>
      )}

      <View style={[row, { marginTop: spacing.md }]}>
        {['All', 'Today', 'Active', 'Done'].map(f => <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />)}
        <Pressable onPress={clearDone} style={{ marginLeft: 'auto' }}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Clear done</Text>
        </Pressable>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(i: any) => i.id}
        style={{ marginTop: spacing.md }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Empty text="Nothing here" icon="checkbox-outline" />}
        renderItem={({ item }: any) => (
          <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={() => toggle(item)}>
              <Ionicons name={item.done ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={item.done ? colors.accent : colors.outline} />
            </Pressable>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: item.done ? colors.textMuted : colors.text, textDecorationLine: item.done ? 'line-through' : 'none' }}>
                {item.title}
              </Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, alignItems: 'center' }}>
                <Tag label={item.priority || 'Medium'} color={tint[item.priority] || colors.accent} bg={soft[item.priority] || colors.accentSoft} />
                {dueTag(item)}
                {item.notifId ? <Ionicons name="notifications" size={13} color={colors.accent} /> : null}
              </View>
            </View>
            <IconButton name="trash-outline" onPress={() => remove(item)} />
          </Card>
        )}
      />
    </Screen>
  );
}