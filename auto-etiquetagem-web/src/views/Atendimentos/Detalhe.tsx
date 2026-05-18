import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, MessageSquare, Star, Clock } from 'lucide-react';
import { getAtendimentoDetalhe, type AtendimentoDetalhe } from '../../services/api';

export default function AtendimentoDetalheView() {
  const { protocoloId } = useParams<{ protocoloId: string }>();
  const [detalhe, setDetalhe] = useState<AtendimentoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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

  const { chat, mensagens, avaliacao, numero, aberto_em, fechado_em } = detalhe;

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
