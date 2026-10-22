import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { Header, IconBubble, Screen, SectionTitle } from '../components/ui';
import { colors, radius, spacing } from '../theme/colors';

const groups = [
  ['Planner', [['notes', 'Notes', 'Capture ideas', 'document-text'], ['counters', 'Counters', 'Track anything', 'speedometer'], ['goals', 'Goals', 'Long-term targets', 'flag'], ['calendar', 'Calendar', 'Events and countdowns', 'calendar'], ['focus', 'Focus', 'Pomodoro timer', 'timer']]],
  ['Life', [['journal', 'Journal', 'Mood and gratitude', 'book'], ['expenses', 'Expenses', 'Budget tracker', 'wallet'], ['health', 'Health', 'Water, sleep, weight', 'water'], ['workout', 'Workout', 'Gym log and streak', 'barbell']]],
  ['Learn and secure', [['cards', 'Flashcards', 'Spaced repetition', 'layers'], ['vault', 'Vault', 'Locked passwords', 'lock-closed']]],
  ['Insights', [['analytics', 'Analytics', 'Scores and charts', 'bar-chart'], ['achievements', 'Achievements', 'Badges and levels', 'trophy'], ['assistant', 'Assistant', 'Ask your data', 'sparkles'], ['search', 'Search', 'Find anything', 'search'], ['settings', 'Settings', 'Profile and data', 'settings']]],
];

export default function More() {
  const router = useRouter();
  return (
    <Screen>
      <Header title="More" subtitle="Everything in LifeOS" />
      <Pressable onPress={() => router.push('/search')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 12, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border }}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <Text style={{ marginLeft: 8, color: colors.textMuted }}>Search across all modules</Text>
      </Pressable>
      <ScrollView showsVerticalScrollIndicator={false}>
        {groups.map(([title, items]) => {
          const rows = [];
          for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
          return (
            <View key={title}>
              <SectionTitle>{title}</SectionTitle>
              {rows.map((row, r) => (
                <View key={r} style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
                  {row.map(([route, name, desc, icon]) => (
                    <Pressable key={route} onPress={() => router.push('/' + route)} style={{ flex: 1 }}>
                      <Card style={{ marginBottom: 0 }}>
                        <IconBubble name={icon} size={40} />
                        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 10 }}>{name}</Text>
                        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{desc}</Text>
                      </Card>
                    </Pressable>
                  ))}
                  {row.length === 1 && <View style={{ flex: 1 }} />}
                </View>
              ))}
            </View>
          );
        })}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}