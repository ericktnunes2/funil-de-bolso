import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export function Placeholder({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: Colors.background },
  titulo: { fontSize: 22, fontWeight: '700', color: Colors.text },
  subtitulo: { marginTop: 8, fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
});
