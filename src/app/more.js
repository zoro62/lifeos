import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Header, Screen, SectionTitle } from '../components/ui';
import { colors, radius, spacing } from '../theme/colors';

const groups = [
  ['Productivity', [['notes', 'Notes', 'document-text-outline'], ['counters', 'Counters', 'speedometer-outline'], ['goals', 'Goals', 'flag-outline'], ['calendar', 'Calendar', 'calendar-outline'], ['focus', 'Focus timer', 'timer-outline']]],
  ['Life', [['journal', 'Journal', 'book-outline'], ['expenses', 'Expenses', 'wallet-outline'], ['health', 'Health', 'water-outline'], ['workout', 'Workout', 'barbell-outline']]],
  ['Learn & secure', [['cards', 'Flashcards', 'layers-outline'], ['vault', 'Vault', 'lock-closed-outline']]],
  ['Insights', [['analytics', 'Analytics', 'bar-chart-outline'], ['assistant', 'Assistant', 'sparkles-outline'], ['search', 'Search', 'search-outline'], ['settings', 'Settings', 'settings-outline']]],
];

export default function More() {
  const router = useRouter();
  return (
    <Screen>
      <Header title="More" subtitle="All your LifeOS modules" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {groups.map(([title, items]) => (
          <View key={title}>
            <SectionTitle>{title}</SectionTitle>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md }}>
              {items.map(([route, name, icon]) => (
                <Pressable key={route} onPress={() => router.push('/' + route)}
                  style={{ width: '48.5%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Ionicons name={icon} size={22} color={colors.accent} />
                  <Text style={{ fontSize: 14, color: colors.text, fontWeight: '500' }}>{name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}