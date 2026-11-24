import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { EtapaBadge } from '@/components/EtapaBadge';
import { OrigemBadge } from '@/components/OrigemBadge';
import { Colors, Radius } from '@/constants/theme';
import type { Lead } from '@/types/lead';
import { estaParado, formatarMoeda, formatarTelefone, textoParado } from '@/utils/lead';

type Props = { lead: Lead; onPress: () => void };

export function LeadCard({ lead, onPress }: Props) {
  const parado = estaParado(lead);
  const ultimaNota = lead.notas[0]?.texto;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir lead ${lead.nome}`}
      android_ripple={{ color: '#10B98122' }}
      style={({ pressed }) => [styles.card, parado && styles.cardParado, pressed && styles.pressed]}>
      <View style={styles.topo}>
        <Avatar nome={lead.nome} tamanho={48} />
        <View style={styles.flex}>
          <Text style={styles.nome} numberOfLines={1}>{lead.nome}</Text>
          <View style={styles.linha}>
            <Ionicons name="call-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.telefone} numberOfLines={1}>{formatarTelefone(lead.telefone)}</Text>
          </View>
        </View>
        {lead.valor ? <Text style={styles.valor}>{formatarMoeda(lead.valor)}</Text> : null}
      </View>

      <View style={styles.badges}>
        <OrigemBadge origem={lead.origem} />
        <EtapaBadge etapa={lead.etapa} />
        <View style={[styles.parado, parado && styles.paradoAlerta]}>
          <Ionicons
            name={parado ? 'warning-outline' : 'time-outline'}
            size={13}
            color={parado ? '#B91C1C' : Colors.textSecondary}
          />
          <Text style={[styles.paradoTexto, parado && { color: '#B91C1C' }]}>
            {parado ? 'parado ' : ''}{textoParado(lead)}
          </Text>
        </View>
      </View>

      {ultimaNota ? (
        <View style={styles.nota}>
          <Ionicons name="chatbox-ellipses-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.notaTexto} numberOfLines={2}>{ultimaNota}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={() => Linking.openURL('https://wa.me/' + lead.telefone)}
        accessibilityLabel={`Chamar ${lead.nome} no WhatsApp`}
        android_ripple={{ color: '#ffffff44' }}
        style={({ pressed }) => [styles.zap, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}>
        <Ionicons name="logo-whatsapp" size={18} color="#fff" />
        <Text style={styles.zapTexto}>Chamar no Zap</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    backgroundColor: Colors.card, borderRadius: Radius, padding: 16, marginBottom: 16, overflow: 'hidden',
    borderLeftWidth: 4, borderLeftColor: 'transparent',
    shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  cardParado: { borderLeftColor: '#EF4444' },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nome: { fontSize: 18, fontWeight: '700', color: Colors.text },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  telefone: { fontSize: 13, color: Colors.textSecondary },
  valor: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark },
  badges: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  parado: {
    flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999, backgroundColor: '#F1F5F9',
  },
  paradoAlerta: { backgroundColor: '#FEE2E2' },
  paradoTexto: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  nota: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 14, padding: 12,
    borderRadius: 12, backgroundColor: Colors.superficie,
  },
  notaTexto: { flex: 1, fontSize: 14, lineHeight: 20, color: Colors.text },
  zap: {
    marginTop: 14, minHeight: 48, borderRadius: 12, backgroundColor: Colors.primary, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  zapTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
