import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { gerarLeadsExemplo } from '@/data/leadsExemplo';
import type { Etapa, Lead, NovoLead } from '@/types/lead';
import { gerarId } from '@/utils/id';

const CHAVE = '@funil-de-bolso/leads';

type LeadsContextValue = {
  leads: Lead[];
  carregando: boolean;
  adicionarLead: (dados: NovoLead) => Lead;
  atualizarLead: (id: string, dados: Partial<Omit<Lead, 'id'>>) => void;
  mudarEtapa: (id: string, etapa: Etapa) => void;
  adicionarNota: (id: string, texto: string) => void;
  excluirLead: (id: string) => void;
};

const LeadsContext = createContext<LeadsContextValue | null>(null);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [carregando, setCarregando] = useState(true);
  const leadsRef = useRef<Lead[]>([]);

  // Carrega do AsyncStorage; na primeira abertura (chave inexistente) popula os exemplos.
  useEffect(() => {
    let ativo = true;
    (async () => {
      let lista: Lead[];
      try {
        const salvo = await AsyncStorage.getItem(CHAVE);
        if (salvo === null) {
          lista = gerarLeadsExemplo();
          await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
        } else {
          lista = JSON.parse(salvo) as Lead[];
        }
      } catch {
        lista = gerarLeadsExemplo();
      }
      if (!ativo) return;
      leadsRef.current = lista;
      setLeads(lista);
      setCarregando(false);
    })();
    return () => {
      ativo = false;
    };
  }, []);

  // Aplica a mudança sobre a versão mais recente e persiste a cada alteração.
  const aplicar = useCallback((fn: (atual: Lead[]) => Lead[]) => {
    const proxima = fn(leadsRef.current);
    leadsRef.current = proxima;
    setLeads(proxima);
    AsyncStorage.setItem(CHAVE, JSON.stringify(proxima)).catch(() => {});
  }, []);

  const adicionarLead = useCallback(
    (dados: NovoLead) => {
      const agora = new Date().toISOString();
      const texto = dados.notaInicial?.trim();
      const lead: Lead = {
        id: gerarId(),
        nome: dados.nome.trim(),
        telefone: dados.telefone.replace(/\D/g, ''),
        origem: dados.origem,
        etapa: 'novo',
        valor: dados.valor,
        notas: texto ? [{ id: gerarId(), texto, criadoEm: agora }] : [],
        proximoContato: dados.proximoContato,
        criadoEm: agora,
        atualizadoEm: agora,
      };
      aplicar((atual) => [lead, ...atual]);
      return lead;
    },
    [aplicar],
  );

  const atualizarLead = useCallback(
    (id: string, dados: Partial<Omit<Lead, 'id'>>) =>
      aplicar((atual) => atual.map((l) => (l.id === id ? { ...l, ...dados } : l))),
    [aplicar],
  );

  const mudarEtapa = useCallback(
    (id: string, etapa: Etapa) =>
      aplicar((atual) =>
        atual.map((l) => (l.id === id ? { ...l, etapa, atualizadoEm: new Date().toISOString() } : l)),
      ),
    [aplicar],
  );

  const adicionarNota = useCallback(
    (id: string, texto: string) => {
      const limpo = texto.trim();
      if (!limpo) return;
      const agora = new Date().toISOString();
      aplicar((atual) =>
        atual.map((l) =>
          l.id === id
            ? { ...l, notas: [{ id: gerarId(), texto: limpo, criadoEm: agora }, ...l.notas], atualizadoEm: agora }
            : l,
        ),
      );
    },
    [aplicar],
  );

  const excluirLead = useCallback(
    (id: string) => aplicar((atual) => atual.filter((l) => l.id !== id)),
    [aplicar],
  );

  const value = useMemo(
    () => ({ leads, carregando, adicionarLead, atualizarLead, mudarEtapa, adicionarNota, excluirLead }),
    [leads, carregando, adicionarLead, atualizarLead, mudarEtapa, adicionarNota, excluirLead],
  );

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}

export function useLeads(): LeadsContextValue {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads deve ser usado dentro de <LeadsProvider>');
  return ctx;
}
