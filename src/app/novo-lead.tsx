import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';

import { Chip } from '@/components/Chip';
import { ORIGEM_LABEL } from '@/constants/leads';
import { Colors, Radius } from '@/constants/theme';
import { useLeads } from '@/context/LeadsContext';
import type { Origem } from '@/types/lead';
import { normalizarTelefone, parseValor, telefoneValido } from '@/utils/lead';

const ORIGENS: Origem[] = ['anuncio', 'indicacao', 'organico'];

export default function NovoLeadScreen() {
  const { adicionarLead } = useLeads();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [origem, setOrigem] = useState<Origem>('anuncio');
  const [valor, setValor] = useState('');
  const [nota, setNota] = useState('');
  const [tentou, setTentou] = useState(false);
  const insets = useSafeAreaInsets();

  const erroNome = nome.trim().length < 2 ? 'Informe o nome do contato.' : '';
  const erroTelefone = !telefoneValido(telefone) ? 'Informe um telefone válido com DDD.' : '';

  function salvar() {
    setTentou(true);
    if (erroNome || erroTelefone) return;
    adicionarLead({
      nome,
      telefone: normalizarTelefone(telefone),
      origem,
      valor: parseValor(valor),
      notaInicial: nota,
    });
    router.back();
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.conteudo, { paddingBottom: 32 + insets.bottom }]}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>Cadastre em menos de 30 segundos para não perder o contato.</Text>

        <View style={styles.secao}>
          <Text style={styles.label}>Nome do contato / cliente *</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Mariana Costa"
            placeholderTextColor={Colors.textSecondary}
            autoCapitalize="words"
            style={[styles.input, tentou && !!erroNome && styles.inputErro]}
          />
          {tentou && erroNome ? <Text style={styles.erro}>{erroNome}</Text> : null}

          <Text style={[styles.label, styles.espaco]}>Telefone / WhatsApp *</Text>
          <TextInput
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(61) 99999-9999"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="phone-pad"
            style={[styles.input, tentou && !!erroTelefone && styles.inputErro]}
          />
          {tentou && erroTelefone ? <Text style={styles.erro}>{erroTelefone}</Text> : null}
        </View>

        <View style={styles.secao}>
          <Text style={styles.label}>Origem do lead</Text>
          <View style={styles.chips}>
            {ORIGENS.map((o) => (
              <Chip key={o} label={ORIGEM_LABEL[o]} ativo={origem === o} onPress={() => setOrigem(o)} />
            ))}
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.label}>Valor estimado da venda (opcional)</Text>
          <TextInput
            value={valor}
            onChangeText={(t) => setValor(t.replace(/[^\d.,]/g, ''))}
            placeholder="R$ 1.500,00"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <Text style={[styles.label, styles.espaco]}>Nota inicial (opcional)</Text>
          <TextInput
            value={nota}
            onChangeText={setNota}
            placeholder="Ex: Interessada no pacote semestral, pediu para retornar na quinta."
            placeholderTextColor={Colors.textSecondary}
            multiline
            style={[styles.input, styles.multi]}
          />
        </View>

        <Pressable
          onPress={salvar}
          accessibilityRole="button"
          android_ripple={{ color: '#ffffff44' }}
          style={({ pressed }) => [styles.salvar, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          <Text style={styles.salvarTexto}>Salvar lead</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  conteudo: { padding: 16, paddingBottom: 40, gap: 16 },
  intro: { fontSize: 15, lineHeight: 21, color: Colors.textSecondary },
  secao: {
    backgroundColor: Colors.card, borderRadius: Radius, padding: 16,
    shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  label: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  espaco: { marginTop: 16 },
  input: {
    minHeight: 52, borderRadius: 12, paddingHorizontal: 14, fontSize: 16, color: Colors.text,
    backgroundColor: Colors.superficie, borderWidth: 1, borderColor: 'transparent',
  },
  inputErro: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  multi: { minHeight: 90, paddingTop: 12, textAlignVertical: 'top' },
  erro: { marginTop: 6, fontSize: 13, color: '#B91C1C' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  salvar: {
    minHeight: 56, borderRadius: Radius, backgroundColor: Colors.primary, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  salvarTexto: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
