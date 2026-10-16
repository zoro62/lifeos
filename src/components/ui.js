import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';

export function Screen({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg }}>
      {children}
    </View>
  );
}

export function Header({ title, subtitle, back, right }) {
  const router = useRouter();
  return (
    <View style={{ marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center' }}>
      {back ? (
        <Pressable onPress={() => router.navigate('/more')} hitSlop={10} style={{ marginRight: spacing.sm }}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{title}</Text>
        {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function SectionTitle({ children }) {
  return <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>{children}</Text>;
}

export function Input(props) {
  return <TextInput placeholderTextColor={colors.textMuted} {...props} style={[s.input, props.style]} />;
}

export function Button({ label, onPress, style }) {
  return (
    <Pressable style={[s.button, style]} onPress={onPress}>
      <Text style={s.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function AddRow({ value, onChangeText, onSubmit, placeholder, button = 'Add' }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
      <Input style={{ flex: 1 }} value={value} onChangeText={onChangeText} onSubmitEditing={onSubmit} placeholder={placeholder} returnKeyType="done" />
      <Button label={button} onPress={onSubmit} />
    </View>
  );
}

export function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={[s.chipText, active && { color: '#FFFFFF' }]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ name, onPress, color = colors.textMuted, size = 20 }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={{ padding: 4 }}>
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}

export function ProgressBar({ value, max }) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <View style={s.track}>
      <View style={[s.fill, { width: `${pct * 100}%` }]} />
    </View>
  );
}

export function Stat({ label, value, icon }) {
  return (
    <View style={s.stat}>
      <Ionicons name={icon} size={18} color={colors.accent} />
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 4 }}>{value}</Text>
      <Text style={{ fontSize: 11, color: colors.textMuted }}>{label}</Text>
    </View>
  );
}

export function BarChart({ data, height = 80, max }) {
  const top = max || Math.max(1, ...data.map(d => d.value));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: height + 20 }}>
      {data.map((d, i) => (
        <View key={i} style={{ alignItems: 'center', flex: 1 }}>
          <View style={{ width: 14, height: Math.max(3, (d.value / top) * height), borderRadius: 4, backgroundColor: d.value > 0 ? colors.accent : colors.border }} />
          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

export function Empty({ text, icon = 'file-tray-outline' }) {
  return (
    <View style={{ alignItems: 'center', marginTop: spacing.xl * 1.5 }}>
      <Ionicons name={icon} size={40} color={colors.border} />
      <Text style={{ color: colors.textMuted, marginTop: spacing.sm }}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, color: colors.text },
  button: { backgroundColor: colors.accent, borderRadius: radius.sm, paddingHorizontal: spacing.md, justifyContent: 'center', alignItems: 'center', minHeight: 42 },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: colors.accent },
  stat: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md },
});