import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Card from '../components/Card';
import { AddRow, Chip, Empty, Header, IconButton, Screen } from '../components/ui';
import useStoredList from '../lib/data';
import { colors, spacing } from '../theme/colors';

const PRIORITIES = ['Low', 'Medium', 'High'];
const weight: any = { High: 0, Medium: 1, Low: 2 };
const tint: any = { High: colors.danger, Medium: colors.accent, Low: colors.textMuted };

export default function TasksScreen() {
  const [tasks, setTasks] = useStoredList('lifeos_tasks');
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('All');

  const add = () => {
    const title = input.trim();
    if (!title) return;
    setTasks((prev: any[]) => [{ id: Date.now().toString(), title, done: false, priority }, ...prev]);
    setInput('');
  };
  const toggle = (id: string) => setTasks((p: any[]) => p.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTasks((p: any[]) => p.filter(t => t.id !== id));
  const clearDone = () => setTasks((p: any[]) => p.filter(t => !t.done));

  const left = tasks.filter((t: any) => !t.done).length;
  const visible = tasks
    .filter((t: any) => filter === 'All' || (filter === 'Active' ? !t.done : t.done))
    .sort((a: any, b: any) => Number(a.done) - Number(b.done) || (weight[a.priority] ?? 1) - (weight[b.priority] ?? 1));

  return (
    <Screen>
      <Header title="Tasks" subtitle={`${left} left · ${tasks.length} total`} />
      <AddRow value={input} onChangeText={setInput} onSubmit={add} placeholder="Add a task..." />

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        {PRIORITIES.map(p => <Chip key={p} label={p} active={priority === p} onPress={() => setPriority(p)} />)}
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, alignItems: 'center' }}>
        {['All', 'Active', 'Done'].map(f => <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />)}
        <Pressable onPress={clearDone} style={{ marginLeft: 'auto' }}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Clear done</Text>
        </Pressable>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(i: any) => i.id}
        style={{ marginTop: spacing.md }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Empty text="No tasks here" icon="checkbox-outline" />}
        renderItem={({ item }: any) => (
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Pressable onPress={() => toggle(item.id)}>
              <Ionicons name={item.done ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={item.done ? colors.accent : colors.border} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, color: item.done ? colors.textMuted : colors.text, textDecorationLine: item.done ? 'line-through' : 'none' }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 11, color: tint[item.priority] || colors.textMuted, marginTop: 2 }}>{item.priority || 'Medium'}</Text>
            </View>
            <IconButton name="trash-outline" onPress={() => remove(item.id)} />
          </Card>
        )}
      />
    </Screen>
  );
}