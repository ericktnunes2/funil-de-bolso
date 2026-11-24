import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { EstadoVazio } from '@/components/EstadoVazio';
import { OrigemBadge } from '@/components/OrigemBadge';
import {
  Alert, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';

import { Chip } from '@/components/Chip';
import { ETAPAS, ETAPA_COR, ETAPA_LABEL } from '@/constants/leads';
import { Colors, Radius } from '@/constants/theme';
import { useLeads } from '@/context/LeadsContext';
import {
  dataContato, diasAteContato, formatarDataHora, formatarMoeda, formatarProximoContato, formatarTelefone,
  textoParado,
} from '@/utils/lead';

const ATALHOS_DATA: { label: string; dias: number }[] = [
  { label: 'Hoje', dias: 0 },
  { label: 'Amanhã', dias: 1 },
  { label: 'Em 3 dias', dias: 3 },
  { label: 'Em 1 semana', dias: 7 },
];

export default function DetalheLeadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { leads, mudarEtapa, atualizarLead, adicionarNota, excluirLead } = useLeads();
  const [novaNota, setNovaNota] = useState('');
  const insets = useSafeAreaInsets();

  const lead = leads.find((l) => l.id === id);
  if (!lead) {
    return (
      <View style={styles.vazio}>
        <Text style={styles.vazioTexto}>Lead não encontrado.</Text>
      </View>
    );
  }

  const atraso = lead.proximoContato ? diasAteContato(lead.proximoContato) < 0 : false;

  function enviarNota() {
    if (!novaNota.trim() || !lead) return;
    adicionarNota(lead.id, novaNota);
    setNovaNota('');
  }

  function confirmarExclusao() {
    if (!lead) return;
    const alvo = lead.id;
    const executar = () => {
      router.back();
      excluirLead(alvo);
    };
    if (Platform.OS === 'web') {
      if (window.confirm(`Excluir ${lead.nome}? Essa ação não pode ser desfeita.`)) executar();
      return;
    }
    Alert.alert('Excluir lead', `Excluir ${lead.nome}? Essa ação não pode ser desfeita.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: executar },
    ]);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: lead.nome }} />
      <ScrollView
        contentContainerStyle={[styles.conteudo, { paddingBottom: 32 + insets.bottom }]}
        keyboardShouldPersistTaps="handled">
        {/* Dados */}
        <View style={styles.card}>
          <View style={styles.identidade}>
            <Avatar nome={lead.nome} tamanho={64} />
            <View style={styles.flex}>
              <Text style={styles.nome}>{lead.nome}</Text>
              <View style={styles.linha}>
                <Ionicons name="call-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.telefone}>{formatarTelefone(lead.telefone)}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.linha, styles.pills]}>
            <OrigemBadge origem={lead.origem} />
            {lead.valor ? (
              <View style={[styles.pill, { backgroundColor: '#D1FAE5' }]}>
                <Text style={[styles.pillTexto, { color: Colors.primaryDark }]}>{formatarMoeda(lead.valor)}</Text>
              </View>
            ) : null}
            <View style={styles.pill}><Text style={styles.pillTexto}>Atualizado {textoParado(lead)}</Text></View>
          </View>
        </View>

        {/* Etapa */}
        <View style={styles.card}>
          <Text style={styles.titulo}>Etapa da negociação</Text>
          <View style={styles.chips}>
            {ETAPAS.map((e) => (
              <Chip
                key={e}
                label={ETAPA_LABEL[e]}
                cor={ETAPA_COR[e]}
                ativo={lead.etapa === e}
                onPress={() => lead.etapa !== e && mudarEtapa(lead.id, e)}
              />
            ))}
          </View>
        </View>

        {/* WhatsApp */}
        <Pressable
          onPress={() => Linking.openURL('https://wa.me/' + lead.telefone)}
          accessibilityRole="button"
          android_ripple={{ color: '#ffffff44' }}
          style={({ pressed }) => [styles.zap, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}>
          <View style={styles.zapIcone}>
            <Ionicons name="logo-whatsapp" size={26} color="#fff" />
          </View>
          <View style={styles.flex}>
            <Text style={styles.zapTitulo}>Abrir WhatsApp</Text>
            <Text style={styles.zapSub}>Iniciar conversa com {lead.nome.split(' ')[0]}</Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color="#fff" />
        </Pressable>

        {/* Próximo contato */}
        <View style={styles.card}>
          <Text style={styles.titulo}>Próximo contato</Text>
          <View style={[styles.destaque, atraso && { backgroundColor: '#FEE2E2' }]}>
            <Ionicons
              name={lead.proximoContato ? 'alarm-outline' : 'calendar-outline'}
              size={20}
              color={atraso ? '#B91C1C' : Colors.primaryDark}
            />
            <Text style={[styles.destaqueTexto, atraso && { color: '#B91C1C' }]}>
              {lead.proximoContato ? formatarProximoContato(lead.proximoContato) : 'Nenhum follow-up agendado'}
            </Text>
          </View>
          <View style={styles.chips}>
            {ATALHOS_DATA.map((a) => (
              <Chip
                key={a.label}
                label={a.label}
                ativo={!!lead.proximoContato && diasAteContato(lead.proximoContato) === a.dias}
                onPress={() => atualizarLead(lead.id, { proximoContato: dataContato(a.dias) })}
              />
            ))}
            {lead.proximoContato ? (
              <Chip label="Limpar" ativo={false} onPress={() => atualizarLead(lead.id, { proximoContato: undefined })} />
            ) : null}
          </View>
        </View>

        {/* Notas */}
        <View style={styles.card}>
          <View style={styles.tituloLinha}>
            <Text style={styles.titulo}>Notas e histórico</Text>
            <Text style={styles.contador}>{lead.notas.length}</Text>
          </View>
          <View style={styles.notaInputLinha}>
            <TextInput
              value={novaNota}
              onChangeText={setNovaNota}
              placeholder="Escreva uma nota rápida"
              placeholderTextColor={Colors.textSecondary}
              onSubmitEditing={enviarNota}
              returnKeyType="send"
              style={styles.notaInput}
            />
            <Pressable
              onPress={enviarNota}
              accessibilityLabel="Adicionar nota"
              style={({ pressed }) => [styles.enviar, !novaNota.trim() && { opacity: 0.4 }, pressed && { opacity: 0.8 }]}>
              <Ionicons name="send" size={18} color="#fff" />
            </Pressable>
          </View>
          {lead.notas.length === 0 ? (
            <EstadoVazio
              icone="chatbubble-ellipses-outline"
              titulo="Nenhuma nota ainda"
              texto="Registre o que foi combinado para não esquecer."
            />
          ) : (
            lead.notas.map((n) => (
              <View key={n.id} style={styles.nota}>
                <Text style={styles.notaData}>{formatarDataHora(n.criadoEm)}</Text>
                <Text style={styles.notaTexto}>{n.texto}</Text>
              </View>
            ))
          )}
        </View>

        {/* Excluir */}
        <Pressable
          onPress={confirmarExclusao}
          accessibilityRole="button"
          android_ripple={{ color: '#EF444422' }}
          style={({ pressed }) => [styles.excluir, pressed && { opacity: 0.8 }]}>
          <Ionicons name="trash-outline" size={20} color="#B91C1C" />
          <Text style={styles.excluirTexto}>Excluir lead</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const sombra = {
  shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2,
} as const;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  vazioTexto: { fontSize: 16, color: Colors.textSecondary },
  conteudo: { padding: 16, paddingBottom: 40, gap: 16 },
  card: { backgroundColor: Colors.card, borderRadius: Radius, padding: 16, ...sombra },
  identidade: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  nome: { fontSize: 22, fontWeight: '800', color: Colors.text },
  zapIcone: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  telefone: { fontSize: 15, color: Colors.textSecondary },
  pills: { flexWrap: 'wrap', gap: 8, marginTop: 12 },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: '#F1F5F9' },
  pillTexto: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  titulo: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  tituloLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contador: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  zap: {
    minHeight: 76, borderRadius: Radius, backgroundColor: Colors.primary, paddingHorizontal: 16, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  zapTitulo: { color: '#fff', fontSize: 18, fontWeight: '800' },
  zapSub: { color: '#D1FAE5', fontSize: 13, marginTop: 2 },
  destaque: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12,
    backgroundColor: '#ECFDF5', marginBottom: 12,
  },
  destaqueTexto: { fontSize: 15, fontWeight: '700', color: Colors.primaryDark },
  notaInputLinha: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12 },
  notaInput: {
    flex: 1, minHeight: 48, borderRadius: 12, paddingHorizontal: 14, fontSize: 15, color: Colors.text,
    backgroundColor: Colors.superficie,
  },
  enviar: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
  },
  nota: { backgroundColor: Colors.superficie, borderRadius: 12, padding: 12, marginTop: 8 },
  notaData: { fontSize: 12, fontWeight: '700', color: Colors.primaryDark, marginBottom: 4 },
  notaTexto: { fontSize: 15, color: Colors.text },
  excluir: {
    minHeight: 52, borderRadius: Radius, borderWidth: 1.5, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, overflow: 'hidden',
  },
  excluirTexto: { color: '#B91C1C', fontSize: 16, fontWeight: '700' },
});
