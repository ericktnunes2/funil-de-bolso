import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';

type Props = {
  titulo: string;
  valor: string;
  detalhe?: string;
  icone: React.ComponentProps<typeof Ionicons>['name'];
};

export function StatCard({ titulo, valor, detalhe, icone }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>{titulo}</Text>
        <View style={styles.icone}>
          <Ionicons name={icone} size={18} color={Colors.primaryDark} />
        </View>
      </View>
      <Text style={styles.valor}>{valor}</Text>
      {detalhe ? <Text style={styles.detalhe}>{detalhe}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: Colors.card, borderRadius: Radius, padding: 16,
    shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  titulo: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  icone: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
  valor: { marginTop: 10, fontSize: 28, fontWeight: '800', color: Colors.text },
  detalhe: { marginTop: 2, fontSize: 12, color: Colors.textSecondary },
});
