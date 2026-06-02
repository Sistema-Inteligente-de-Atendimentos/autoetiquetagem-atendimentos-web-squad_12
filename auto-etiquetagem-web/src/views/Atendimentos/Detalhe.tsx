import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, MessageSquare, Star, Clock, Award, X, Tag } from 'lucide-react';
import {
  getAtendimentoDetalhe,
  aprovarComoExemplo,
  removerExemplo,
  type AtendimentoDetalhe,
} from '../../services/api';

export default function AtendimentoDetalheView() {
  const { protocoloId } = useParams<{ protocoloId: string }>();
  const [detalhe, setDetalhe] = useState<AtendimentoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [revisor, setRevisor] = useState('');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!protocoloId) return;
    async function carregar() {
      try {
        const data = await getAtendimentoDetalhe(protocoloId!);
        setDetalhe(data);
      } catch (e) {
        console.error(e);
        setErro("Não foi possível carregar este atendimento.");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [protocoloId]);

  async function handleAprovar() {
    if (!protocoloId) return;
    if (!revisor.trim()) {
      alert('Informe o nome do revisor');
      return;
    }
    try {
      setSalvando(true);
      await aprovarComoExemplo(protocoloId, revisor.trim(), observacao.trim() || undefined);
      const atualizado = await getAtendimentoDetalhe(protocoloId);
      setDetalhe(atualizado);
      setObservacao('');
    } catch (e) {
      console.error(e);
      alert('Erro ao aprovar como exemplo');
    } finally {
      setSalvando(false);
    }
  }

  async function handleRemover() {
    if (!protocoloId) return;
    if (!confirm('Tem certeza que deseja remover esta aprovação?')) return;
    try {
      setSalvando(true);
      await removerExemplo(protocoloId);
      const atualizado = await getAtendimentoDetalhe(protocoloId);
      setDetalhe(atualizado);
    } catch (e) {
      console.error(e);
      alert('Erro ao remover aprovação');
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
        <p className="text-gray-500 font-medium">Carregando detalhes...</p>
      </div>
    );
  }

  if (erro || !detalhe) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
        {erro || "Atendimento não encontrado."}
      </div>
    );
  }

  const { chat, mensagens, avaliacao, numero, aberto_em, fechado_em, classificacao } = detalhe;

  const corSentimento = (s?: string) => {
    const v = (s || '').toLowerCase();
    if (v.includes('positiv')) return 'bg-green-50 text-green-700 border-green-100';
    if (v.includes('negativ')) return 'bg-red-50 text-red-700 border-red-100';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };
  const corCriticidade = (c?: string) => {
    const v = (c || '').toLowerCase();
    if (v.includes('alta')) return 'bg-red-50 text-red-700 border-red-100';
    if (v.includes('média') || v.includes('media')) return 'bg-amber-50 text-amber-700 border-amber-100';
    if (v.includes('baixa')) return 'bg-green-50 text-green-700 border-green-100';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };
  const topicos = Array.isArray(classificacao?.topicos) ? classificacao!.topicos : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/atendimentos"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 mb-2"
          >
            <ArrowLeft size={16} /> Voltar para lista
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">
            Protocolo #{detalhe.id}
          </h2>
          <p className="text-sm text-gray-400 font-mono">{numero}</p>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          {chat.canal || 'Canal não informado'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <User size={18} className="text-gray-400" /> Dados do Chat
          </h3>
          <InfoRow label="Cliente" value={chat.cliente_nome || '—'} />
          <InfoRow label="Atendente" value={chat.atendente_nome || '—'} />
          <InfoRow label="Canal" value={chat.canal || '—'} />
          <InfoRow
            label="Aberto em"
            value={aberto_em ? new Date(aberto_em).toLocaleString('pt-BR') : '—'}
          />
          <InfoRow
            label="Fechado em"
            value={fechado_em ? new Date(fechado_em).toLocaleString('pt-BR') : 'Em aberto'}
          />
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <MessageSquare size={18} className="text-gray-400" /> Histórico do Chat
            <span className="ml-auto text-xs text-gray-400 font-normal">
              {mensagens.length} mensage{mensagens.length === 1 ? 'm' : 'ns'}
            </span>
          </h3>

          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
            {mensagens.length === 0 && (
              <p className="text-sm text-gray-400 italic">Sem mensagens registradas.</p>
            )}
            {mensagens.map((msg) => {
              const isCliente = (msg.remetente || '').toLowerCase() === 'cliente';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isCliente ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                      isCliente
                        ? 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        : 'bg-[#cc142d] text-white rounded-br-sm'
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-wider opacity-70 font-bold">
                      {msg.remetente || (isCliente ? 'cliente' : 'atendente')}
                    </p>
                    <p className="text-sm leading-snug whitespace-pre-wrap">
                      {msg.conteudo}
                    </p>
                    {msg.enviada_em && (
                      <p
                        className={`text-[10px] mt-1 flex items-center gap-1 ${
                          isCliente ? 'text-gray-400' : 'text-red-100'
                        }`}
                      >
                        <Clock size={10} />
                        {new Date(msg.enviada_em).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {classificacao && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Tag size={18} className="text-gray-400" /> Classificação da IA
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-1">Categoria</p>
              <p className="text-sm font-semibold text-gray-800">{classificacao.categoria || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-1">Intenção</p>
              <p className="text-sm font-semibold text-gray-800">{classificacao.intencao || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-1">Sentimento</p>
              {classificacao.sentimento ? (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${corSentimento(classificacao.sentimento)}`}>
                  {classificacao.sentimento}
                </span>
              ) : <span className="text-sm text-gray-400">—</span>}
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-1">Criticidade</p>
              {classificacao.criticidade ? (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${corCriticidade(classificacao.criticidade)}`}>
                  {classificacao.criticidade}
                </span>
              ) : <span className="text-sm text-gray-400">—</span>}
            </div>
          </div>

          {classificacao.sla_urgencia && (
            <div className="mt-4">
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-1">SLA / Urgência</p>
              <p className="text-sm text-gray-700">{classificacao.sla_urgencia}</p>
            </div>
          )}

          {topicos.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-2">Tópicos</p>
              <div className="flex flex-wrap gap-2">
                {topicos.map((t, i) => (
                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {classificacao.qualidade && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Empatia', classificacao.qualidade.empatia],
                ['Clareza', classificacao.qualidade.clareza],
                ['Objetividade', classificacao.qualidade.objetividade],
                ['Resolutividade', classificacao.qualidade.resolutividade],
              ].map(([label, val]) => (
                <div key={label as string} className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">{label}</p>
                  <p className="text-lg font-black text-gray-700 mt-1">{val != null ? val : '—'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Star size={18} className="text-gray-400" /> Avaliação da IA
        </h3>
        {avaliacao ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 bg-gray-50 rounded-lg p-4 border border-gray-100 text-center">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Nota</p>
              <p
                className={`text-4xl font-black mt-2 ${
                  (avaliacao.nota ?? 0) >= 7
                    ? 'text-green-500'
                    : (avaliacao.nota ?? 0) >= 4
                    ? 'text-yellow-500'
                    : 'text-red-500'
                }`}
              >
                {avaliacao.nota != null ? avaliacao.nota.toFixed(1) : '—'}
              </p>
            </div>
            <div className="md:col-span-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">
                Comentário / Resumo
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {avaliacao.comentario || 'Sem comentário registrado.'}
              </p>
              {avaliacao.avaliado_em && (
                <p className="text-[10px] text-gray-400 mt-3">
                  Avaliado em {new Date(avaliacao.avaliado_em).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">Ainda sem avaliação para este protocolo.</p>
        )}
      </div>

      {avaliacao && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Award size={18} className="text-amber-500" />
            Validação Humana
          </h3>

          {avaliacao.aprovado_como_exemplo ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 rounded-full p-2">
                    <Award size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold text-amber-800">
                      Aprovado como bom exemplo
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      Por <strong>{avaliacao.aprovado_por || 'Anônimo'}</strong>
                      {avaliacao.aprovado_em && (
                        <> em {new Date(avaliacao.aprovado_em).toLocaleString('pt-BR')}</>
                      )}
                    </p>
                    {avaliacao.observacao_aprovacao && (
                      <p className="text-sm text-amber-700 mt-2 italic">
                        "{avaliacao.observacao_aprovacao}"
                      </p>
                    )}
                    <p className="text-xs text-amber-600 mt-3">
                      Esta avaliação está sendo usada como referência para a IA classificar novos atendimentos.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemover}
                  disabled={salvando}
                  title="Remover aprovação"
                  className="p-2 text-amber-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Se esta classificação está correta, aprove como exemplo. A IA usará casos
                aprovados como referência para melhorar futuras classificações.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Revisor</label>
                  <input
                    type="text"
                    value={revisor}
                    onChange={(e) => setRevisor(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Observação (opcional)</label>
                  <input
                    type="text"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    placeholder="Por que é um bom exemplo?"
                    className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <button
                onClick={handleAprovar}
                disabled={salvando || !revisor.trim()}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Award size={18} />
                {salvando ? 'Salvando...' : 'Aprovar como bom exemplo'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase text-gray-400 tracking-widest font-bold">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}
