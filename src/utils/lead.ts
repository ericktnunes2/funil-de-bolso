import { ETAPAS_ABERTAS } from '@/constants/leads';
import type { Lead } from '@/types/lead';

const DIA_MS = 24 * 60 * 60 * 1000;

function inicioDoDia(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Dias corridos entre hoje e `atualizadoEm`. */
export function diasParado(lead: Lead): number {
  const diff = inicioDoDia(new Date()) - inicioDoDia(new Date(lead.atualizadoEm));
  return Math.max(0, Math.round(diff / DIA_MS));
}

export function textoParado(lead: Lead): string {
  const d = diasParado(lead);
  if (d === 0) return 'hoje';
  if (d === 1) return 'há 1 dia';
  return `há ${d} dias`;
}

/** Etapa aberta e mais de 2 dias sem atualização. */
export function estaParado(lead: Lead): boolean {
  return ETAPAS_ABERTAS.includes(lead.etapa) && diasParado(lead) > 2;
}

export function formatarMoeda(valor: number): string {
  return 'R$ ' + valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

/** Só dígitos, com DDI 55 se o usuário digitou apenas DDD + número. */
export function normalizarTelefone(texto: string): string {
  const digitos = texto.replace(/\D/g, '');
  return digitos.length <= 11 ? '55' + digitos : digitos;
}

/** Válido: DDI 55 + DDD + 8 ou 9 dígitos (12–13 dígitos), ou outro DDI com 10–15 dígitos. */
export function telefoneValido(texto: string): boolean {
  const digitos = texto.replace(/\D/g, '');
  if (digitos.length < 10) return false;
  const n = normalizarTelefone(texto);
  return n.length >= 12 && n.length <= 15;
}

export function formatarTelefone(telefone: string): string {
  const m = telefone.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  return m ? `+55 (${m[1]}) ${m[2]}-${m[3]}` : '+' + telefone;
}

/** "1.500,50" / "1500" → número; vazio/ inválido → undefined. */
export function parseValor(texto: string): number | undefined {
  const limpo = texto.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
  const n = parseFloat(limpo);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** ISO do dia `diasAFrente` a partir de hoje, às 09:00. */
export function dataContato(diasAFrente: number): string {
  const d = new Date();
  d.setDate(d.getDate() + diasAFrente);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

/** Diferença em dias: positivo = futuro, 0 = hoje, negativo = atrasado. */
export function diasAteContato(iso: string): number {
  const diff = inicioDoDia(new Date(iso)) - inicioDoDia(new Date());
  return Math.round(diff / DIA_MS);
}

export function formatarProximoContato(iso: string): string {
  const d = diasAteContato(iso);
  const data = new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  if (d === 0) return `Hoje (${data})`;
  if (d === 1) return `Amanhã (${data})`;
  if (d < 0) return `Atrasado desde ${data}`;
  return data;
}

export function formatarDataHora(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) +
    ' às ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
}
