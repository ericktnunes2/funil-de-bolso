# Funil de Bolso

CRM de bolso para pequenos negócios e autônomos que vendem pelo WhatsApp.
Problema: quem vende pelo WhatsApp perde vendas por não organizar leads nem fazer follow-up.
Projeto acadêmico (AT2-N2), apresentado em vídeo de ~30s e em sala. Priorize o que funciona e aparece bem na demonstração.

## Stack
- React Native + Expo (SDK atual) + TypeScript
- Navegação: expo-router (abas)
- Dados: AsyncStorage (sem backend, sem login)
- Ícones: @expo/vector-icons
- Rodar com Expo Go no celular (`npx expo start`)

## Modelo de dados
```ts
type Etapa = 'novo' | 'conversa' | 'proposta' | 'fechado' | 'perdido';
type Origem = 'anuncio' | 'indicacao' | 'organico';

type Lead = {
  id: string;
  nome: string;
  telefone: string;        // só dígitos, com DDI, ex: 5561999999999
  origem: Origem;
  etapa: Etapa;
  valor?: number;          // valor estimado da venda, opcional
  notas: { id: string; texto: string; criadoEm: string }[];
  proximoContato?: string; // ISO date do próximo follow-up
  criadoEm: string;
  atualizadoEm: string;    // atualiza ao mudar etapa ou adicionar nota
};
```

## Telas (abas inferiores: Funil, Hoje, Resumo)
1. **Funil** (aba): abas/segmentos por etapa, lista de cards (nome, origem, "parado há X dias"). Botão flutuante "+" abre Novo lead.
2. **Novo lead** (modal): nome, telefone, origem (chips), valor opcional, nota inicial.
3. **Detalhe do lead**: dados, seletor de etapa, botão grande "Abrir WhatsApp", campo de próximo contato, lista de notas com adicionar nota, excluir lead.
4. **Hoje** (aba): follow-ups com data de hoje ou atrasados + leads parados há mais de 2 dias em etapa aberta.
5. **Resumo** (aba): total de leads, taxa de fechamento (fechados / total), valor total fechado, leads por origem (barras simples feitas com View, sem biblioteca de gráfico).

## Regras
- Abrir WhatsApp: `Linking.openURL('https://wa.me/' + telefone)`.
- "Parado há X dias" = diferença entre hoje e `atualizadoEm`.
- Lead parado = etapa em novo/conversa/proposta e mais de 2 dias sem atualização.
- Ao abrir o app pela primeira vez, popular ~8 leads de exemplo realistas (nomes brasileiros, origens variadas, datas variadas) para a demonstração.
- Todo texto da interface em português do Brasil.

## Visual
- Seguir as imagens da pasta `/design` como referência principal.
- Cor principal verde-esmeralda `#10B981`, escura `#065F46`, fundo `#F8FAFC`, texto `#0F172A`.
- Cards brancos, cantos arredondados (16), sombra leve, espaçamento generoso.
- Cores por etapa: novo azul, conversa laranja, proposta roxo, fechado verde, perdido cinza.
- Botões grandes, área de toque confortável, feedback ao tocar.

## Código
- TypeScript, componentes pequenos e reutilizáveis em `components/`.
- Estado dos leads em um contexto (`context/LeadsContext.tsx`) com funções: adicionar, atualizar, mudar etapa, adicionar nota, excluir.
- Persistir no AsyncStorage a cada mudança.
- Nada de bibliotecas pesadas. Prefira o que já vem no Expo.
- Depois de cada alteração, garantir que o app compila e abre sem erro.
