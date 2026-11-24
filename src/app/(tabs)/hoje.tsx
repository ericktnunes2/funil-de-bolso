import { router } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EstadoVazio } from '@/components/EstadoVazio';
import { HojeItem } from '@/components/HojeItem';
import { ETAPAS_ABERTAS } from '@/constants/leads';
import { Colors } from '@/constants/theme';
import { useLeads } from '@/context/LeadsContext';
import type { Lead } from '@/types/lead';
import { diasAteContato, diasParado, estaParado } from '@/utils/lead';

export default function HojeScreen() {
  const { leads, carregando } = useLeads();

  const { followups, parados } = useMemo(() => {
    const abertos = leads.filter((l) => ETAPAS_ABERTAS.includes(l.etapa));
    // Follow-up com data de hoje ou atrasada; os mais atrasados primeiro.
    const followups = abertos
      .filter((l) => l.proximoContato && diasAteContato(l.proximoContato) <= 0)
      .sort((a, b) => diasAteContato(a.proximoContato!) - diasAteContato(b.proximoContato!));
    // Parados que ainda não aparecem em follow-ups; os mais parados primeiro.
    const idsFollowup = new Set(followups.map((l) => l.id));
    const parados = abertos
      .filter((l) => estaParado(l) && !idsFollowup.has(l.id))
      .sort((a, b) => diasParado(b) - diasParado(a));
    return { followups, parados };
  }, [leads]);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  const total = followups.length + parados.length;
  const dataHoje = new Date()
    .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
    .toUpperCase();
  const abrir = (l: Lead) => router.push({ pathname: '/lead/[id]', params: { id: l.id } });

  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      <Text style={styles.data}>{dataHoje}</Text>
      <Text style={styles.titulo}>Hoje</Text>
      <Text style={styles.subtitulo}>
        {total === 0
          ? 'Tudo em dia por aqui. Bom trabalho!'
          : `Você tem ${total} ${total === 1 ? 'ação prioritária' : 'ações prioritárias'} para destravar vendas.`}
      </Text>
      <View style={styles.resumo}>
        <View style={styles.resumoChip}>
          <View style={[styles.resumoDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.resumoTexto}>{followups.length} Follow-ups</Text>
        </View>
        <View style={styles.resumoChip}>
          <View style={[styles.resumoDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.resumoTexto}>{parados.length} Leads parados</Text>
        </View>
      </View>

      <View style={styles.cabecalhoSecao}>
        <Text style={styles.secao}>Follow-ups de hoje</Text>
        <Text style={styles.contador}>{followups.length}</Text>
      </View>
      {followups.length === 0 ? (
        <EstadoVazio
          icone="calendar-outline"
          titulo="Nenhum follow-up para hoje"
          texto="Agende o próximo contato nos seus leads para não esquecer ninguém."
        />
      ) : (
        followups.map((l) => <HojeItem key={l.id} lead={l} tipo="followup" onPress={() => abrir(l)} />)
      )}

      <View style={styles.cabecalhoSecao}>
        <Text style={styles.secao}>Leads parados</Text>
        <Text style={styles.contador}>{parados.length}</Text>
      </View>
      <Text style={styles.dica}>Sem atualização há mais de 2 dias</Text>
      {parados.length === 0 ? (
        <EstadoVazio
          icone="checkmark-done-outline"
          titulo="Nenhum lead parado"
          texto="Seu funil está andando! Continue assim."
        />
      ) : (
        parados.map((l) => <HojeItem key={l.id} lead={l} tipo="parado" onPress={() => abrir(l)} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  conteudo: { padding: 16, paddingTop: 8, paddingBottom: 32 },
  data: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5, color: Colors.primaryDark },
  titulo: { marginTop: 4, fontSize: 26, fontWeight: '800', color: Colors.text },
  subtitulo: { marginTop: 4, fontSize: 15, color: Colors.textSecondary },
  resumo: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  resumoChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 999, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  resumoDot: { width: 8, height: 8, borderRadius: 4 },
  resumoTexto: { fontSize: 13, fontWeight: '700', color: Colors.text },
  cabecalhoSecao: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 28, marginBottom: 14 },
  secao: { fontSize: 18, fontWeight: '800', color: Colors.text },
  contador: {
    minWidth: 24, textAlign: 'center', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999,
    backgroundColor: '#D1FAE5', color: Colors.primaryDark, fontSize: 13, fontWeight: '800', overflow: 'hidden',
  },
  dica: { fontSize: 13, color: Colors.textSecondary, marginTop: -8, marginBottom: 14 },
});
