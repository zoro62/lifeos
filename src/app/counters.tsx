import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Empty, Header, IconButton, Input, ProgressBar, Screen } from '../components/ui';
import useStoredList from '../lib/data';
import { colors, spacing } from '../theme/colors';

export default function CountersScreen() {
  const [counters, setCounters] = useStoredList('lifeos_counters');
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [step, setStep] = useState('1');

  const add = () => {
    const n = name.trim();
    if (!n) return;
    setCounters((p: any[]) => [{
      id: Date.now().toString(), name: n, value: 0,
      step: Math.max(1, parseInt(step) || 1), target: parseInt(target) || 0,
    }, ...p]);
    setName(''); setTarget(''); setStep('1');
  };

  const change = (id: string, dir: number) =>
    setCounters((p: any[]) => p.map(c =>
      (c.id === id
        ? { ...c, value: Math.max(0, c.value + dir * (c.step || 1)) }
        : c)
    ));

  const reset = (id: string) =>
    setCounters((p: any[]) => p.map(c =>
      (c.id === id ? { ...c, value: 0 } : c)
    ));

  const remove = (id: string) =>
    setCounters((p: any[]) => p.filter(c => c.id !== id));

  const round = {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.background
  };

  return (
    <Screen>
      <Header title="Counters" subtitle="Track anything, one tap at a time" back />

      <Input
        placeholder="e.g. Pushups, Coffee, Pages read"
        value={name}
        onChangeText={setName}
      />

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        <Input
          placeholder="Target (optional)"
          keyboardType="numeric"
          value={target}
          onChangeText={setTarget}
          style={{ flex: 1 }}
        />

        <Input
          placeholder="Step"
          keyboardType="numeric"
          value={step}
          onChangeText={setStep}
          style={{ width: 70 }}
        />

        <Button label="Add" onPress={add} />
      </View>

      <FlatList
        data={counters}
        keyExtractor={(i: any) => i.id}
        style={{ marginTop: spacing.md }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Empty text="No counters yet" icon="speedometer-outline" />
        }
        renderItem={({ item }: any) => (
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, color: colors.text }}>
                  {item.name}
                </Text>

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: colors.accent,
                    marginTop: 2
                  }}
                >
                  {item.value}

                  {item.target > 0 && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textMuted,
                        fontWeight: '400'
                      }}
                    >
                      {' / '}{item.target}
                    </Text>
                  )}
                </Text>
              </View>

              <Pressable
                style={round}
                onPress={() => change(item.id, -1)}
              >
                <Ionicons
                  name="remove"
                  size={18}
                  color={colors.text}
                />
              </Pressable>

              <View style={{ width: spacing.sm }} />

              <Pressable
                style={round}
                onPress={() => change(item.id, 1)}
              >
                <Ionicons
                  name="add"
                  size={18}
                  color={colors.text}
                />
              </Pressable>
            </View>

            {item.target > 0 && (
              <View style={{ marginTop: spacing.sm }}>
                <ProgressBar value={item.value} max={item.target} />
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: spacing.sm
              }}
            >
              <Text style={{ fontSize: 11, color: colors.textMuted }}>
                step {item.step || 1}
              </Text>

              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <IconButton
                  name="refresh-outline"
                  size={18}
                  onPress={() => reset(item.id)}
                />

                <IconButton
                  name="trash-outline"
                  size={18}
                  onPress={() => remove(item.id)}
                />
              </View>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}