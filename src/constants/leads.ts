import { Colors } from '@/constants/theme';
import type { Etapa, Origem } from '@/types/lead';

export const ETAPAS: Etapa[] = ['novo', 'conversa', 'proposta', 'fechado', 'perdido'];

export const ETAPA_LABEL: Record<Etapa, string> = {
  novo: 'Novo',
  conversa: 'Em conversa',
  proposta: 'Proposta',
  fechado: 'Fechado',
  perdido: 'Perdido',
};

export const ETAPA_COR: Record<Etapa, string> = Colors.etapa;

export const ETAPAS_ABERTAS: Etapa[] = ['novo', 'conversa', 'proposta'];

export const ORIGEM_COR: Record<Origem, { fundo: string; texto: string }> = {
  anuncio: { fundo: '#DBEAFE', texto: '#1D4ED8' },
  indicacao: { fundo: '#D1FAE5', texto: '#065F46' },
  organico: { fundo: '#EDE9FE', texto: '#6D28D9' },
};

export const ORIGEM_LABEL: Record<Origem, string> = {
  anuncio: 'Anúncio',
  indicacao: 'Indicação',
  organico: 'Orgânico',
};
