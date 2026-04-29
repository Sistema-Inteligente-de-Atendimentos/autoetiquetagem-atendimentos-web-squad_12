export type ClassificationResult = {
  categoria: string;
  intencao: string;
  sentimento: string;
  criticidade: string;
  sla_urgencia: string;
  resumo: string[];
  topicos: string[];
  qualidade: {
    empatia: number;
    clareza: number;
    objetividade: number;
    resolutividade: number;
    score_final: number;
  };
};