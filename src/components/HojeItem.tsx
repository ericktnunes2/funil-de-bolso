import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { EtapaBadge } from '@/components/EtapaBadge';
import { Colors, Radius } from '@/constants/theme';
import type { Lead } from '@/types/lead';
import { diasAteContato, formatarMoeda, textoParado } from '@/utils/lead';

type Props = {
  lead: Lead;
  /** 'followup' mostra a data do contato; 'parado' mostra há quanto tempo está parado. */
  tipo: 'followup' | 'parado';
  onPress: () => void;
};

export function HojeItem({ lead, tipo, onPress }: Props) {
  const atrasado = tipo === 'followup' && !!lead.proximoContato && diasAteContato(lead.proximoContato) < 0;
  const dias = lead.proximoContato ? Math.abs(diasAteContato(lead.proximoContato)) : 0;

  const aviso =
    tipo === 'parado'
      ? `Parado ${textoParado(lead)}`
      : atrasado
        ? `Atrasado há ${dias} ${dias === 1 ? 'dia' : 'dias'}`
        : 'Hoje';
  const alerta = tipo === 'parado' || atrasado;
  const nota = lead.notas[0]?.texto;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir lead ${lead.nome}`}
      android_ripple={{ color: '#10B98122' }}
      style={({ pressed }) => [styles.card, alerta && styles.cardAlerta, pressed && styles.pressed]}>
      <View style={styles.topo}>
        <Avatar nome={lead.nome} tamanho={44} />
        <View style={styles.flex}>
          <Text style={styles.nome} numberOfLines={1}>{lead.nome}</Text>
          {lead.valor ? <Text style={styles.valor}>{formatarMoeda(lead.valor)}</Text> : null}
        </View>
        <EtapaBadge etapa={lead.etapa} />
      </View>

      <View style={[styles.aviso, alerta && styles.avisoAlerta]}>
        <Ionicons
          name={alerta ? 'warning-outline' : 'time-outline'}
          size={14}
          color={alerta ? '#B91C1C' : Colors.primaryDark}
        />
        <Text style={[styles.avisoTexto, { color: alerta ? '#B91C1C' : Colors.primaryDark }]}>{aviso}</Text>
      </View>

      {nota ? (
        <View style={styles.nota}>
          <Ionicons name="checkmark-circle-outline" size={16} color={Colors.primaryDark} />
          <Text style={styles.notaTexto} numberOfLines={2}>{nota}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={() => Linking.openURL('https://wa.me/' + lead.telefone)}
        accessibilityLabel={`Chamar ${lead.nome} no WhatsApp`}
        android_ripple={{ color: '#ffffff44' }}
        style={({ pressed }) => [styles.zap, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}>
        <Ionicons name="logo-whatsapp" size={18} color="#fff" />
        <Text style={styles.zapTexto}>{tipo === 'parado' ? 'Resgatar no WhatsApp' : 'Chamar no WhatsApp'}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    backgroundColor: Colors.card, borderRadius: Radius, padding: 16, marginBottom: 16, overflow: 'hidden',
    borderLeftWidth: 4, borderLeftColor: Colors.primary,
    shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  cardAlerta: { borderLeftColor: '#EF4444' },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nome: { fontSize: 17, fontWeight: '700', color: Colors.text },
  valor: { marginTop: 2, fontSize: 16, fontWeight: '800', color: Colors.primaryDark },
  aviso: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 12,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: '#D1FAE5',
  },
  avisoAlerta: { backgroundColor: '#FEE2E2' },
  avisoTexto: { fontSize: 12, fontWeight: '700' },
  nota: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 12, padding: 12,
    borderRadius: 12, backgroundColor: Colors.superficie,
  },
  notaTexto: { flex: 1, fontSize: 14, lineHeight: 20, color: Colors.text },
  zap: {
    marginTop: 14, minHeight: 48, borderRadius: 12, backgroundColor: Colors.primary, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  zapTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
