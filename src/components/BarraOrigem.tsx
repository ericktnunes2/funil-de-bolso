import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

type Props = { label: string; quantidade: number; total: number; cor: string };

/** Barra horizontal simples feita só com View. */
export function BarraOrigem({ label, quantidade, total, cor }: Props) {
  const pct = total > 0 ? (quantidade / total) * 100 : 0;
  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valor}>
          {quantidade} <Text style={styles.pct}>({Math.round(pct)}%)</Text>
        </Text>
      </View>
      <View style={styles.trilho}>
        <View style={[styles.preenchido, { width: `${pct}%`, backgroundColor: cor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 14 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 15, fontWeight: '600', color: Colors.text },
  valor: { fontSize: 15, fontWeight: '800', color: Colors.text },
  pct: { fontWeight: '500', color: Colors.textSecondary },
  trilho: { height: 12, borderRadius: 6, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  preenchido: { height: 12, borderRadius: 6 },
});
