import { StyleSheet, Text, View } from 'react-native';

import { ETAPA_COR, ETAPA_LABEL } from '@/constants/leads';
import type { Etapa } from '@/types/lead';

export function EtapaBadge({ etapa }: { etapa: Etapa }) {
  const cor = ETAPA_COR[etapa];
  return (
    <View style={[styles.badge, { backgroundColor: cor + '22' }]}>
      <View style={[styles.dot, { backgroundColor: cor }]} />
      <Text style={[styles.texto, { color: cor }]}>{ETAPA_LABEL[etapa]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  texto: { fontSize: 12, fontWeight: '700' },
});
