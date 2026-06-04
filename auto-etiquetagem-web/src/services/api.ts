export const API_BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

// ── Auth: token storage + headers ─────────────────────────────────────────────
const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
    const t = getToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
}

export type Usuario = { id: number; nome: string; email: string };

export async function login(email: string, senha: string): Promise<{ token: string; usuario: Usuario }> {
    const r = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
    });
    if (!r.ok) {
        const err = await r.json().catch(() => null);
        throw new Error(err?.detail || "Falha no login");
    }
    return r.json();
}

export async function register(nome: string, email: string, senha: string): Promise<{ token: string; usuario: Usuario }> {
    const r = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
    });
    if (!r.ok) {
        const err = await r.json().catch(() => null);
        throw new Error(err?.detail || "Falha no cadastro");
    }
    return r.json();
}

export async function getMe(): Promise<Usuario> {
    const r = await fetch(`${API_BASE}/auth/me`, { headers: { ...authHeaders() } });
    if (!r.ok) throw new Error("Não autenticado");
    return r.json();
}

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
    categoria: string | null;
    sentimento: string | null;
    criticidade: string | null;
    aprovado_como_exemplo: boolean;
    analisado_por: string | null;
    avaliado_em: string | null;
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
    analisado_por: string | null;
    corrigido_em: string | null;
};

export type ClassificacaoIA = {
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

export type AtendimentoDetalhe = {
    id: number;
    numero: string;
    aberto_em: string | null;
    fechado_em: string | null;
    chat: ChatDTO;
    mensagens: MensagemDTO[];
    avaliacao: AvaliacaoDTO | null;
    classificacao: ClassificacaoIA | null;
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
    observacao?: string,
): Promise<{ status: string; avaliacao_id: number; aprovado_por: string; aprovado_em: string }> {
    const response = await fetch(`${API_BASE}/atendimentos/${protocoloId}/aprovar-exemplo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ observacao }),
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
        headers: { "Content-Type": "application/json", ...authHeaders() },
    });

    if (!response.ok) {
        throw new Error("Erro ao remover aprovação");
    }

    return response.json();
}

export type CorrecaoClassificacao = {
    categoria?: string;
    intencao?: string;
    sentimento?: string;
    criticidade?: string;
    resumo?: string;
    qualidade?: {
        empatia?: number;
        clareza?: number;
        objetividade?: number;
        resolutividade?: number;
    };
};

export async function corrigirClassificacao(
    protocoloId: number | string,
    correcao: CorrecaoClassificacao,
): Promise<{ status: string; analisado_por: string; corrigido_em: string; classificacao: ClassificacaoIA }> {
    const response = await fetch(`${API_BASE}/atendimentos/${protocoloId}/classificacao`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(correcao),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || "Erro ao corrigir classificação");
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

export type Planilha = {
    id: number;
    url: string;
    nome: string | null;
    ativo: boolean;
    criado_por: string | null;
    criado_em: string | null;
    ultima_linha: number;
    total_processados: number;
    atualizado_em: string | null;
};

export async function getPlanilhas(): Promise<Planilha[]> {
    const r = await fetch(`${API_BASE}/config/planilhas`, { headers: { "Content-Type": "application/json" } });
    if (!r.ok) throw new Error("Erro ao carregar planilhas");
    return r.json();
}

export async function addPlanilha(url: string, nome?: string, criadoPor?: string): Promise<Planilha & { linhas_detectadas: number }> {
    const r = await fetch(`${API_BASE}/config/planilhas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, nome, criado_por: criadoPor }),
    });
    if (!r.ok) {
        const err = await r.json().catch(() => null);
        throw new Error(err?.detail || "Erro ao adicionar planilha");
    }
    return r.json();
}

export async function ativarPlanilha(id: number): Promise<void> {
    await fetch(`${API_BASE}/config/planilhas/${id}/ativar`, { method: "PATCH" });
}

export async function desativarPlanilha(id: number): Promise<void> {
    await fetch(`${API_BASE}/config/planilhas/${id}/desativar`, { method: "PATCH" });
}

export async function removePlanilha(id: number): Promise<void> {
    await fetch(`${API_BASE}/config/planilhas/${id}`, { method: "DELETE" });
}

export async function resetPlanilha(id: number): Promise<void> {
    await fetch(`${API_BASE}/config/planilhas/${id}/reset`, { method: "POST" });
}

export type CategoriaExtra = {
    id: number;
    nome: string;
    criada_por: string | null;
    criado_em: string | null;
};

export type CategoriasResponse = {
    fixas: string[];
    extras: CategoriaExtra[];
};

export async function getCategorias(): Promise<CategoriasResponse> {
    const response = await fetch(`${API_BASE}/config/categorias`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar categorias");
    }

    return response.json();
}

export async function addCategoria(nome: string, criadaPor?: string): Promise<CategoriaExtra> {
    const response = await fetch(`${API_BASE}/config/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, criada_por: criadaPor }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || "Erro ao adicionar categoria");
    }

    return response.json();
}

export async function removeCategoria(id: number): Promise<{ status: string; id: number }> {
    const response = await fetch(`${API_BASE}/config/categorias/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Erro ao remover categoria");
    }

    return response.json();
}
