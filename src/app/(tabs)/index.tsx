import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EstadoVazio } from '@/components/EstadoVazio';
import { EtapaSegmentos } from '@/components/EtapaSegmentos';
import { LeadCard } from '@/components/LeadCard';
import { ETAPAS, ETAPAS_ABERTAS, ETAPA_LABEL } from '@/constants/leads';
import { Colors } from '@/constants/theme';
import { useLeads } from '@/context/LeadsContext';
import type { Etapa } from '@/types/lead';
import { formatarMoeda } from '@/utils/lead';

export default function FunilScreen() {
  const { leads, carregando } = useLeads();
  const [etapa, setEtapa] = useState<Etapa>('novo');

  const contagem = useMemo(() => {
    const c = Object.fromEntries(ETAPAS.map((e) => [e, 0])) as Record<Etapa, number>;
    leads.forEach((l) => c[l.etapa]++);
    return c;
  }, [leads]);

  const lista = useMemo(
    () =>
      leads
        .filter((l) => l.etapa === etapa)
        .sort((a, b) => new Date(a.atualizadoEm).getTime() - new Date(b.atualizadoEm).getTime()),
    [leads, etapa],
  );

  const abertos = leads.filter((l) => ETAPAS_ABERTAS.includes(l.etapa));
  const pipeline = abertos.reduce((soma, l) => soma + (l.valor ?? 0), 0);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <FlatList
        data={lista}
        keyExtractor={(l) => l.id}
        contentContainerStyle={styles.conteudo}
        ListHeaderComponent={
          <View>
            <View style={styles.cabecalho}>
              <Text style={styles.titulo}>Funil de Vendas</Text>
              <Text style={styles.subtitulo}>
                {abertos.length} leads ativos • <Text style={styles.pipeline}>{formatarMoeda(pipeline)} no pipeline</Text>
              </Text>
            </View>
            <EtapaSegmentos selecionada={etapa} contagem={contagem} onSelecionar={setEtapa} />
            <View style={{ height: 8 }} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <LeadCard lead={item} onPress={() => router.push({ pathname: '/lead/[id]', params: { id: item.id } })} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.item}>
            <EstadoVazio
              icone={leads.length === 0 ? 'people-outline' : 'funnel-outline'}
              titulo={leads.length === 0 ? 'Nenhum lead ainda' : `Nenhum lead em “${ETAPA_LABEL[etapa]}”`}
              texto={
                leads.length === 0
                  ? 'Toque no + para cadastrar seu primeiro contato.'
                  : 'Quando um lead chegar a esta etapa, ele aparece aqui.'
              }
            />
          </View>
        }
      />
      <Pressable
        accessibilityLabel="Novo lead"
        onPress={() => router.push('/novo-lead')}
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }]}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  conteudo: { paddingBottom: 110 },
  cabecalho: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  titulo: { fontSize: 26, fontWeight: '800', color: Colors.text },
  subtitulo: { marginTop: 4, fontSize: 14, color: Colors.textSecondary },
  pipeline: { fontWeight: '700', color: Colors.primaryDark },
  item: { paddingHorizontal: 16 },
  fab: {
    position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
});
