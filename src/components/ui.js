import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { colors, radius, shadow, spacing } from '../theme/colors';

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
        <Pressable onPress={() => router.navigate('/more')} hitSlop={10} style={s.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
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
  return <Text style={s.section}>{children}</Text>;
}

export function IconBubble({ name, size = 44, color = colors.accent, bg = colors.accentSoft }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2.8, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={size * 0.5} color={color} />
    </View>
  );
}

export function Tag({ label, color = colors.textMuted, bg = colors.background }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ fontSize: 11, fontWeight: '600', color }}>{label}</Text>
    </View>
  );
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

export function ProgressBar({ value, max, color = colors.accent }) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <View style={s.track}>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: color, width: `${pct * 100}%` }} />
    </View>
  );
}

export function ProgressRing({ size = 96, stroke = 10, value, max, color = '#FFFFFF', track = 'rgba(255,255,255,0.25)', children }) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${c}`} strokeDashoffset={c * (1 - pct)} />
      </Svg>
      {children}
    </View>
  );
}

export function Stat({ label, value, icon }) {
  return (
    <View style={s.stat}>
      <IconBubble name={icon} size={34} />
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 8 }}>{value}</Text>
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
          <View style={{ width: 16, height: Math.max(4, (d.value / top) * height), borderRadius: 8, backgroundColor: d.value > 0 ? colors.accent : colors.border }} />
          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

export function Empty({ text, icon = 'file-tray-outline' }) {
  return (
    <View style={{ alignItems: 'center', marginTop: spacing.xl * 1.5 }}>
      <IconBubble name={icon} size={64} />
      <Text style={{ color: colors.textMuted, marginTop: spacing.md }}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  section: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.8 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md, ...shadow },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 12, color: colors.text, fontSize: 15 },
  button: { backgroundColor: colors.accent, borderRadius: radius.sm, paddingHorizontal: spacing.md, justifyContent: 'center', alignItems: 'center', minHeight: 46 },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, ...shadow },
});