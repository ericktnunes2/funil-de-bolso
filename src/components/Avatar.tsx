import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const a = partes[0]?.[0] ?? '?';
  const b = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (a + b).toUpperCase();
}

export function Avatar({ nome, tamanho = 48 }: { nome: string; tamanho?: number }) {
  return (
    <View style={[styles.avatar, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}>
      <Text style={[styles.texto, { fontSize: tamanho * 0.36 }]}>{iniciais(nome)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { backgroundColor: '#A7F3D0', alignItems: 'center', justifyContent: 'center' },
  texto: { fontWeight: '800', color: Colors.primaryDark },
});
