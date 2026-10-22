import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '../theme/colors';

const tab = (solid: string) => ({ color, focused }: any) => (
  <Ionicons name={(focused ? solid : `${solid}-outline`) as any} size={24} color={color} />
);
const hidden = ['notes', 'counters', 'goals', 'journal', 'expenses', 'focus', 'health', 'workout', 'calendar', 'cards', 'vault', 'analytics', 'assistant', 'search', 'settings', 'achievements'];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.surface, borderTopWidth: 0, height: 68, paddingBottom: 10, paddingTop: 8,
          elevation: 16, shadowColor: '#1B1F3B', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: -4 },
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tab('home') }} />
      <Tabs.Screen name="explore" options={{ title: 'Tasks', tabBarIcon: tab('checkbox') }} />
      <Tabs.Screen name="habits" options={{ title: 'Habits', tabBarIcon: tab('flame') }} />
      <Tabs.Screen name="alarms" options={{ title: 'Alarms', tabBarIcon: tab('alarm') }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: tab('apps') }} />
      {hidden.map(n => <Tabs.Screen key={n} name={n} options={{ href: null }} />)}
    </Tabs>
  );
}