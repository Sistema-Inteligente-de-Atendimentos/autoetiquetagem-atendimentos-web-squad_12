export const API_BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export function getExportUrl(): string {
    return `${API_BASE}/atendimentos/export`;
}

export type ClassifyPayload = {
    text: string;
    canal?: string;
    cliente_nome?: string;
    atendente_nome?: string;
    remetente?: string;
};

export type ClassifyResponse = {
    status: string;
    chat_id: number;
    protocolo_id: number;
    protocolo_numero: string;
    mensagem_id: number;
    avaliacao_id: number;
    data: {
        categoria?: string;
        intencao?: string;
        sentimento?: string;
        criticidade?: string;
        sla_urgencia?: string;
        resumo?: string[] | string;
        topicos?: string[];
        qualidade?: {
            empatia?: number;
            clareza?: number;
            objetividade?: number;
            resolutividade?: number;
            score_final?: number;
        };
    };
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        total_time?: number;
        queue_time?: number;
    };
};

export type AtendimentoListItem = {
    protocolo_id: number;
    numero: string;
    cliente_nome: string | null;
    atendente_nome: string | null;
    canal: string | null;
    aberto_em: string | null;
    fechado_em: string | null;
    nota: number | null;
    comentario: string | null;
    aprovado_como_exemplo: boolean;
};

export type MensagemDTO = {
    id: number;
    remetente: string | null;
    conteudo: string;
    enviada_em: string | null;
};

export type ChatDTO = {
    id: number;
    cliente_nome: string | null;
    atendente_nome: string | null;
    canal: string | null;
    iniciado_em: string | null;
    encerrado_em: string | null;
};

export type AvaliacaoDTO = {
    id: number;
    nota: number | null;
    comentario: string | null;
    avaliado_em: string | null;
    aprovado_como_exemplo: boolean;
    aprovado_por: string | null;
    aprovado_em: string | null;
    observacao_aprovacao: string | null;
};

export type AtendimentoDetalhe = {
    id: number;
    numero: string;
    aberto_em: string | null;
    fechado_em: string | null;
    chat: ChatDTO;
    mensagens: MensagemDTO[];
    avaliacao: AvaliacaoDTO | null;
};

export type DashboardStats = {
    total_atendimentos: number;
    media_qualidade: number;
    volume_por_canal: { canal: string; total: number }[];
    distribuicao_notas: { nota: number; total: number }[];
    total_exemplos_aprovados: number;
};


export async function classifyText(payload: string | ClassifyPayload): Promise<ClassifyResponse> {
    const body: ClassifyPayload =
        typeof payload === "string" ? { text: payload } : payload;

    const response = await fetch(`${API_BASE}/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error("Erro ao classificar");
    }

    return response.json();
}

export async function getAtendimentos(): Promise<AtendimentoListItem[]> {
    const response = await fetch(`${API_BASE}/atendimentos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar histórico");
    }

    return response.json();
}

export async function getAtendimentoDetalhe(protocoloId: number | string): Promise<AtendimentoDetalhe> {
    const response = await fetch(`${API_BASE}/atendimentos/${protocoloId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar detalhes do atendimento");
    }

    return response.json();
}

export async function aprovarComoExemplo(
    protocoloId: number | string,
    revisor: string,
    observacao?: string,
): Promise<{ status: string; avaliacao_id: number; aprovado_por: string; aprovado_em: string }> {
    const response = await fetch(`${API_BASE}/atendimentos/${protocoloId}/aprovar-exemplo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisor, observacao }),
    });

    if (!response.ok) {
        throw new Error("Erro ao aprovar como exemplo");
    }

    return response.json();
}

export async function removerExemplo(
    protocoloId: number | string,
): Promise<{ status: string; avaliacao_id: number }> {
    const response = await fetch(`${API_BASE}/atendimentos/${protocoloId}/remover-exemplo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Erro ao remover aprovação");
    }

    return response.json();
}

export type BatchResultItem = {
    linha: number;
    protocolo_id: number;
    protocolo_numero: string;
    categoria: string | null;
    sentimento: string | null;
    nota: number;
};

export type BatchErrorItem = {
    linha: number;
    erro: string;
};

export type BatchResponse = {
    total_enviados: number;
    total_processados: number;
    total_erros: number;
    resultados: BatchResultItem[];
    erros: BatchErrorItem[];
};

export async function classifyBatch(file: File): Promise<BatchResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/classify/batch`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || "Erro ao processar arquivo em lote");
    }

    return response.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE}/dashboard/stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar métricas");
    }

    return response.json();
}

export type CronStatusItem = {
    fonte: string;
    ultima_linha: number;
    total_processados: number;
    atualizado_em: string | null;
};

export async function getCronStatus(): Promise<CronStatusItem[]> {
    const response = await fetch(`${API_BASE}/cron/status`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar status do cron");
    }

    return response.json();
}

export async function resetCron(): Promise<{ status: string; fontes_removidas: number }> {
    const response = await fetch(`${API_BASE}/cron/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Erro ao resetar contador do cron");
    }

    return response.json();
}
