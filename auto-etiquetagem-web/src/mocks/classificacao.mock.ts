import type { ClassificationResult } from '../views/Entrada/types';

export type UsageMock = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  total_time: number;
  queue_time: number;
};

export type ClassifyResponseMock = {
  data: ClassificationResult;
  usage: UsageMock;
};

export const mockClassificationResults: ClassificationResult[] = [
  {
    categoria: 'Financeiro',
    intencao: 'Solicitar reembolso',
    sentimento: 'Negativo',
    criticidade: 'Alta',
    sla_urgencia: 'Urgente',
    resumo: [
      'Cliente relata cobrança em duplicidade no cartão de crédito.',
      'Solicita estorno do valor cobrado indevidamente.',
    ],
    topicos: ['Cobrança indevida', 'Estorno', 'Cartão de crédito'],
    qualidade: {
      empatia: 7.5,
      clareza: 8.2,
      objetividade: 7.8,
      resolutividade: 6.4,
      score_final: 7.5,
    },
  },
  {
    categoria: 'Suporte Técnico',
    intencao: 'Reportar erro no sistema',
    sentimento: 'Neutro',
    criticidade: 'Média',
    sla_urgencia: 'Normal',
    resumo: [
      'Cliente não consegue acessar a plataforma após atualização.',
      'Atendente orienta limpeza de cache e reinicialização.',
    ],
    topicos: ['Login', 'Erro de acesso', 'Atualização de sistema'],
    qualidade: {
      empatia: 8.0,
      clareza: 8.5,
      objetividade: 8.8,
      resolutividade: 9.0,
      score_final: 8.6,
    },
  },
  {
    categoria: 'Elogio',
    intencao: 'Reconhecer bom atendimento',
    sentimento: 'Positivo',
    criticidade: 'Baixa',
    sla_urgencia: 'Baixa',
    resumo: [
      'Cliente elogia a rapidez na resolução do seu problema.',
    ],
    topicos: ['Satisfação do cliente', 'Elogio'],
    qualidade: {
      empatia: 9.2,
      clareza: 9.0,
      objetividade: 8.7,
      resolutividade: 9.5,
      score_final: 9.1,
    },
  },
];

export const mockUsage: UsageMock = {
  prompt_tokens: 512,
  completion_tokens: 187,
  total_tokens: 699,
  total_time: 1.34,
  queue_time: 0.05,
};

export function getMockClassifyResponse(text: string): ClassifyResponseMock {
  const index = text.length % mockClassificationResults.length;
  const data = mockClassificationResults[index];

  return {
    data,
    usage: {
      ...mockUsage,
      prompt_tokens: 100 + (text.length % 400),
      completion_tokens: 80 + (text.length % 150),
      total_tokens: 180 + (text.length % 550),
    },
  };
}
