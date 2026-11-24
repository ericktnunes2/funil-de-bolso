import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/theme';

type Props = { label: string; ativo: boolean; onPress: () => void; cor?: string };

export function Chip({ label, ativo, onPress, cor = Colors.primary }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      style={({ pressed }) => [
        styles.chip,
        ativo && { backgroundColor: cor, borderColor: cor },
        pressed && { opacity: 0.8 },
      ]}>
      <Text style={[styles.texto, ativo && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44, paddingHorizontal: 16, borderRadius: 999, justifyContent: 'center',
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  texto: { fontSize: 14, fontWeight: '700', color: Colors.text },
});
