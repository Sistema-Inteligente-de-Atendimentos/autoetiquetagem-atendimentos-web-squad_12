export type AtendimentoAnaliseMock = {
  categoria: string;
  intencao: string;
  sentimento: string;
  score_qualidade: {
    score_final: number;
  };
};

export type AtendimentoMock = {
  id: number;
  texto_bruto: string;
  data_criacao: string;
  analises: AtendimentoAnaliseMock[];
};

export const mockAtendimentos: AtendimentoMock[] = [
  {
    id: 1,
    texto_bruto: 'Cliente: Fui cobrado duas vezes na fatura deste mês, preciso do estorno urgente.',
    data_criacao: '2026-07-28T14:32:00Z',
    analises: [
      {
        categoria: 'Financeiro',
        intencao: 'Solicitar reembolso',
        sentimento: 'Negativo',
        score_qualidade: { score_final: 7.5 },
      },
    ],
  },
  {
    id: 2,
    texto_bruto: 'Cliente: Não consigo fazer login desde a última atualização do aplicativo.',
    data_criacao: '2026-07-29T09:15:00Z',
    analises: [
      {
        categoria: 'Suporte Técnico',
        intencao: 'Reportar erro no sistema',
        sentimento: 'Neutro',
        score_qualidade: { score_final: 8.6 },
      },
    ],
  },
  {
    id: 3,
    texto_bruto: 'Cliente: Muito obrigado pela rapidez, o problema foi resolvido em minutos!',
    data_criacao: '2026-07-30T18:47:00Z',
    analises: [
      {
        categoria: 'Elogio',
        intencao: 'Reconhecer bom atendimento',
        sentimento: 'Positivo',
        score_qualidade: { score_final: 9.1 },
      },
    ],
  },
  {
    id: 4,
    texto_bruto: 'Cliente: Quero cancelar minha assinatura, não estou satisfeito com o serviço.',
    data_criacao: '2026-07-31T11:02:00Z',
    analises: [
      {
        categoria: 'Cancelamento',
        intencao: 'Cancelar assinatura',
        sentimento: 'Negativo',
        score_qualidade: { score_final: 5.8 },
      },
    ],
  },
  {
    id: 5,
    texto_bruto: 'Cliente: Ainda não recebi resposta sobre o chamado aberto na semana passada.',
    data_criacao: '2026-08-01T08:20:00Z',
    analises: [],
  },
];
