import type { Lead } from '@/types/lead';

/** ISO de `dias` atrás (negativo = no futuro), no horário `hora`. */
function dia(dias: number, hora = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(hora, 0, 0, 0);
  return d.toISOString();
}

function nota(id: string, texto: string, diasAtras: number) {
  return { id, texto, criadoEm: dia(diasAtras, 14) };
}

export function gerarLeadsExemplo(): Lead[] {
  return [
    {
      id: 'ex-1', nome: 'Mariana Souza', telefone: '5511987214409', origem: 'indicacao', etapa: 'conversa',
      valor: 3200, proximoContato: dia(0, 15),
      notas: [nota('ex-1n1', 'Perguntou sobre prazo de entrega do kit personalizado e parcelamento.', 3)],
      criadoEm: dia(6), atualizadoEm: dia(3),
    },
    {
      id: 'ex-2', nome: 'Lucas Ferreira', telefone: '5521971348820', origem: 'anuncio', etapa: 'conversa',
      valor: 1850, proximoContato: dia(-1, 10),
      notas: [nota('ex-2n1', 'Pediu catálogo em PDF e tabela de preços para atacado.', 1)],
      criadoEm: dia(3), atualizadoEm: dia(1),
    },
    {
      id: 'ex-3', nome: 'Camila Guimarães', telefone: '5531984551200', origem: 'organico', etapa: 'proposta',
      valor: 4500, proximoContato: dia(1, 9),
      notas: [nota('ex-3n1', 'Aguardando confirmação da proposta comercial enviada por e-mail.', 4)],
      criadoEm: dia(9), atualizadoEm: dia(4),
    },
    {
      id: 'ex-4', nome: 'Rodrigo Almeida', telefone: '5541992019031', origem: 'anuncio', etapa: 'novo',
      valor: 980, proximoContato: dia(0, 10),
      notas: [nota('ex-4n1', 'Primeiro contato via campanha. Quer fechar plano trimestral.', 0)],
      criadoEm: dia(0), atualizadoEm: dia(0),
    },
    {
      id: 'ex-5', nome: 'Beatriz Nogueira', telefone: '5561999125100', origem: 'indicacao', etapa: 'proposta',
      valor: 5100, proximoContato: dia(0, 14),
      notas: [nota('ex-5n1', 'Dúvidas sobre parcelamento em até 10x.', 1)],
      criadoEm: dia(5), atualizadoEm: dia(1),
    },
    {
      id: 'ex-6', nome: 'Thiago Vasconcelos', telefone: '5585988307721', origem: 'organico', etapa: 'fechado',
      valor: 1200,
      notas: [nota('ex-6n1', 'Contrato assinado. Entrega agendada.', 2)],
      criadoEm: dia(12), atualizadoEm: dia(2),
    },
    {
      id: 'ex-7', nome: 'Juliana Peixoto', telefone: '5571991846633', origem: 'anuncio', etapa: 'proposta',
      valor: 3800, proximoContato: dia(2, 11),
      notas: [nota('ex-7n1', 'Surgiu dúvida sobre garantia. Sem resposta desde então.', 5)],
      criadoEm: dia(10), atualizadoEm: dia(5),
    },
    {
      id: 'ex-8', nome: 'Gabriel Rocha', telefone: '5551996204518', origem: 'organico', etapa: 'novo',
      notas: [nota('ex-8n1', 'Chegou pelo Instagram. Ainda não respondeu a primeira mensagem.', 3)],
      criadoEm: dia(3), atualizadoEm: dia(3),
    },
    {
      id: 'ex-9', nome: 'Patrícia Lima', telefone: '5562983375509', origem: 'indicacao', etapa: 'perdido',
      valor: 2100,
      notas: [nota('ex-9n1', 'Fechou com concorrente por preço.', 7)],
      criadoEm: dia(20), atualizadoEm: dia(7),
    },
  ];
}
