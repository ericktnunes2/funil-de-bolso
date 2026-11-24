import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ETAPAS, ETAPA_COR, ETAPA_LABEL } from '@/constants/leads';
import { Colors } from '@/constants/theme';
import type { Etapa } from '@/types/lead';

type Props = {
  selecionada: Etapa;
  contagem: Record<Etapa, number>;
  onSelecionar: (etapa: Etapa) => void;
};

export function EtapaSegmentos({ selecionada, contagem, onSelecionar }: Props) {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lista}>
        {ETAPAS.map((etapa) => {
          const ativo = etapa === selecionada;
          const cor = ETAPA_COR[etapa];
          return (
            <Pressable
              key={etapa}
              onPress={() => onSelecionar(etapa)}
              accessibilityRole="tab"
              accessibilityState={{ selected: ativo }}
              style={({ pressed }) => [
                styles.chip,
                ativo && { backgroundColor: cor, borderColor: cor },
                pressed && { opacity: 0.8 },
              ]}>
              <View style={[styles.dot, { backgroundColor: ativo ? '#fff' : cor }]} />
              <Text style={[styles.texto, ativo && { color: '#fff' }]}>{ETAPA_LABEL[etapa]}</Text>
              <View style={[styles.contador, ativo && { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                <Text style={[styles.contadorTexto, ativo && { color: '#fff' }]}>{contagem[etapa]}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  lista: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: 14,
    borderRadius: 999, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  texto: { fontSize: 14, fontWeight: '700', color: Colors.text },
  contador: { minWidth: 22, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 999, backgroundColor: '#F1F5F9', alignItems: 'center' },
  contadorTexto: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
});
