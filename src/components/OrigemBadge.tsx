import { StyleSheet, Text, View } from 'react-native';

import { ORIGEM_COR, ORIGEM_LABEL } from '@/constants/leads';
import type { Origem } from '@/types/lead';

export function OrigemBadge({ origem }: { origem: Origem }) {
  const cor = ORIGEM_COR[origem];
  return (
    <View style={[styles.badge, { backgroundColor: cor.fundo }]}>
      <Text style={[styles.texto, { color: cor.texto }]}>{ORIGEM_LABEL[origem]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  texto: { fontSize: 12, fontWeight: '700' },
});
