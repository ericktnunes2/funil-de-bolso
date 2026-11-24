export type Etapa = 'novo' | 'conversa' | 'proposta' | 'fechado' | 'perdido';
export type Origem = 'anuncio' | 'indicacao' | 'organico';

export type Nota = { id: string; texto: string; criadoEm: string };

export type Lead = {
  id: string;
  nome: string;
  telefone: string; // só dígitos, com DDI, ex: 5561999999999
  origem: Origem;
  etapa: Etapa;
  valor?: number;
  notas: Nota[];
  proximoContato?: string; // ISO date do próximo follow-up
  criadoEm: string;
  atualizadoEm: string; // atualiza ao mudar etapa ou adicionar nota
};

export type NovoLead = {
  nome: string;
  telefone: string;
  origem: Origem;
  valor?: number;
  notaInicial?: string;
  proximoContato?: string;
};
