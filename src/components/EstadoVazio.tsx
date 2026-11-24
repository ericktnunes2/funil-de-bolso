import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';

type Props = {
  icone: React.ComponentProps<typeof Ionicons>['name'];
  titulo: string;
  texto?: string;
};

export function EstadoVazio({ icone, titulo, texto }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.icone}>
        <Ionicons name={icone} size={28} color={Colors.primaryDark} />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      {texto ? <Text style={styles.texto}>{texto}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', paddingVertical: 28, paddingHorizontal: 24, marginBottom: 14,
    backgroundColor: Colors.card, borderRadius: Radius,
  },
  icone: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#D1FAE5',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  titulo: { fontSize: 16, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  texto: { marginTop: 4, fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
});
