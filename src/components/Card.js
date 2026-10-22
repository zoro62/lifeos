import { View } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme/colors';

export default function Card({ children, style }) {
  return (
    <View style={[{ backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow }, style]}>
      {children}
    </View>
  );
}