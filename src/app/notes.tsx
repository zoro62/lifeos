import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Empty, Header, IconButton, Input, Screen } from '../components/ui';
import useStoredList from '../lib/data';
import { colors, spacing } from '../theme/colors';

export default function NotesScreen() {
  const [notes, setNotes] = useStoredList('lifeos_notes');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const reset = () => {
    setTitle('');
    setBody('');
    setEditing(null);
  };

  const save = () => {
    const t = title.trim(), b = body.trim();
    if (!t && !b) return;

    if (editing) {
      setNotes((p: any[]) =>
        p.map(n => (n.id === editing ? { ...n, title: t, text: b } : n))
      );
    } else {
      setNotes((p: any[]) => [
        {
          id: Date.now().toString(),
          title: t,
          text: b,
          date: new Date().toLocaleDateString(),
          pinned: false
        },
        ...p
      ]);
    }

    reset();
  };

  const startEdit = (n: any) => {
    setEditing(n.id);
    setTitle(n.title || '');
    setBody(n.text || '');
  };

  const togglePin = (id: string) =>
    setNotes((p: any[]) =>
      p.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );

  const remove = (id: string) => {
    setNotes((p: any[]) => p.filter(n => n.id !== id));
    if (editing === id) reset();
  };

  const q = query.trim().toLowerCase();

  const visible = notes
    .filter(
      (n: any) =>
        !q ||
        (n.title || '').toLowerCase().includes(q) ||
        (n.text || '').toLowerCase().includes(q)
    )
    .sort((a: any, b: any) => Number(!!b.pinned) - Number(!!a.pinned));

  return (
    <Screen>
      <Header title="Notes" subtitle={`${notes.length} saved`} back />

      <Input
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <Input
        placeholder="Write a note..."
        value={body}
        onChangeText={setBody}
        multiline
        style={{
          marginTop: spacing.sm,
          minHeight: 70,
          textAlignVertical: 'top'
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          gap: spacing.sm,
          marginTop: spacing.sm
        }}
      >
        <Button
          label={editing ? 'Update' : 'Save note'}
          onPress={save}
          style={{ flex: 1 }}
        />

        {editing && (
          <Button
            label="Cancel"
            onPress={reset}
            style={{ backgroundColor: colors.textMuted }}
          />
        )}
      </View>

      <Input
        placeholder="Search notes..."
        value={query}
        onChangeText={setQuery}
        style={{ marginTop: spacing.md }}
      />

      <FlatList
        data={visible}
        keyExtractor={(i: any) => i.id}
        style={{ marginTop: spacing.md }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Empty text="No notes found" icon="document-text-outline" />
        }
        renderItem={({ item }: any) => (
          <Pressable onPress={() => startEdit(item)}>
            <Card>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start'
                }}
              >
                <View style={{ flex: 1 }}>
                  {!!item.title && (
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: colors.text
                      }}
                    >
                      {item.title}
                    </Text>
                  )}

                  {!!item.text && (
                    <Text
                      numberOfLines={3}
                      style={{
                        fontSize: 14,
                        color: colors.text,
                        marginTop: 2
                      }}
                    >
                      {item.text}
                    </Text>
                  )}

                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.textMuted,
                      marginTop: 6
                    }}
                  >
                    {item.date}
                  </Text>
                </View>

                <IconButton
                  name={item.pinned ? 'pin' : 'pin-outline'}
                  color={item.pinned ? colors.accent : colors.textMuted}
                  onPress={() => togglePin(item.id)}
                />

                <IconButton
                  name="trash-outline"
                  onPress={() => remove(item.id)}
                />
              </View>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}