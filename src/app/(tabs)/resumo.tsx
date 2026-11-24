import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BarraOrigem } from '@/components/BarraOrigem';
import { EstadoVazio } from '@/components/EstadoVazio';
import { StatCard } from '@/components/StatCard';
import { ORIGEM_LABEL } from '@/constants/leads';
import { Colors, Radius } from '@/constants/theme';
import { useLeads } from '@/context/LeadsContext';
import type { Origem } from '@/types/lead';

const ORIGENS: Origem[] = ['anuncio', 'indicacao', 'organico'];
const COR_ORIGEM: Record<Origem, string> = {
  anuncio: Colors.primary,
  indicacao: Colors.primaryDark,
  organico: '#6EE7B7',
};

export default function ResumoScreen() {
  const { leads, carregando } = useLeads();

  const dados = useMemo(() => {
    const total = leads.length;
    const fechados = leads.filter((l) => l.etapa === 'fechado');
    const valorFechado = fechados.reduce((soma, l) => soma + (l.valor ?? 0), 0);
    const taxa = total > 0 ? (fechados.length / total) * 100 : 0;
    const porOrigem = ORIGENS.map((o) => ({ origem: o, qtd: leads.filter((l) => l.origem === o).length }));
    return { total, fechados: fechados.length, valorFechado, taxa, porOrigem };
  }, [leads]);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  const moeda = 'R$ ' + dados.valorFechado.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const taxaTexto = dados.taxa.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';

  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Resumo de Vendas</Text>
      <Text style={styles.subtitulo}>Acompanhe seu ritmo de conversões.</Text>

      <View style={styles.linha}>
        <StatCard titulo="Total de leads" valor={String(dados.total)} icone="people-outline" />
        <StatCard
          titulo="Taxa de fechamento"
          valor={taxaTexto}
          detalhe={`${dados.fechados} de ${dados.total}`}
          icone="trending-up-outline"
        />
      </View>

      <View style={styles.valorCard}>
        <View style={styles.flex}>
          <View style={styles.rotuloLinha}>
            <View style={styles.rotuloDot} />
            <Text style={styles.valorRotulo}>Valor total fechado</Text>
          </View>
          <Text style={styles.valorNumero}>{moeda}</Text>
          <Text style={styles.valorDetalhe}>
            {dados.fechados} {dados.fechados === 1 ? 'negócio concluído' : 'negócios concluídos'}
          </Text>
        </View>
        <View style={styles.valorIcone}>
          <Ionicons name="cash-outline" size={30} color={Colors.primaryDark} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Leads por origem</Text>
        {dados.total === 0 ? (
          <View style={{ marginTop: 14 }}>
            <EstadoVazio
              icone="stats-chart-outline"
              titulo="Ainda sem dados"
              texto="Cadastre leads para ver de onde eles vêm."
            />
          </View>
        ) : (
          dados.porOrigem.map((o) => (
            <BarraOrigem
              key={o.origem}
              label={ORIGEM_LABEL[o.origem]}
              quantidade={o.qtd}
              total={dados.total}
              cor={COR_ORIGEM[o.origem]}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const sombra = {
  shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2,
} as const;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  conteudo: { padding: 16, paddingBottom: 32, gap: 16 },
  titulo: { fontSize: 26, fontWeight: '800', color: Colors.text },
  subtitulo: { marginTop: -12, fontSize: 15, color: Colors.textSecondary },
  rotuloLinha: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rotuloDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  linha: { flexDirection: 'row', gap: 12 },
  valorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.card,
    borderRadius: Radius, padding: 18, ...sombra,
  },
  valorRotulo: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  valorNumero: { marginTop: 6, fontSize: 32, fontWeight: '800', color: Colors.text },
  valorDetalhe: { marginTop: 4, fontSize: 13, color: Colors.textSecondary },
  valorIcone: { width: 60, height: 60, borderRadius: 16, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: Colors.card, borderRadius: Radius, padding: 18, ...sombra },
  cardTitulo: { fontSize: 18, fontWeight: '800', color: Colors.text },
});
