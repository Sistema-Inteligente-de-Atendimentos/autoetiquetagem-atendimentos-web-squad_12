import { useEffect, useState } from 'react';
import { RefreshCw, Settings, Clock, RotateCcw, CheckCircle } from 'lucide-react';
import { getCronStatus, resetCron, type CronStatusItem } from '../../services/api';

export default function Configuracoes() {
  const [status, setStatus] = useState<CronStatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetando, setResetando] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function carregarStatus() {
    try {
      setLoading(true);
      const data = await getCronStatus();
      setStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarStatus();
  }, []);

  async function handleReset() {
    if (!confirm('Tem certeza? Isso vai zerar o contador. O cron vai reprocessar a planilha inteira no próximo disparo.')) {
      return;
    }
    try {
      setResetando(true);
      setFeedback(null);
      const r = await resetCron();
      setFeedback(`Contador resetado (${r.fontes_removidas} fonte${r.fontes_removidas === 1 ? '' : 's'} removida${r.fontes_removidas === 1 ? '' : 's'}).`);
      await carregarStatus();
    } catch (e) {
      console.error(e);
      setFeedback('Erro ao resetar contador.');
    } finally {
      setResetando(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings size={24} className="text-gray-500" />
          Configurações
        </h2>
        <p className="text-sm text-gray-500">Gerencie as regras e o processamento automático do sistema</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-gray-400" />
              Processamento Automático (Cron)
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Status da análise automática a partir do Google Sheets
            </p>
          </div>
          <button
            onClick={carregarStatus}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all disabled:opacity-50"
            title="Atualizar status"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400 italic">Carregando status...</p>
        ) : status.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">
              Nenhuma planilha foi processada ainda. O contador será criado no primeiro disparo do cron.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {status.map((s, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-400 font-mono break-all mb-2">{s.fonte}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Última linha</p>
                    <p className="text-lg font-black text-gray-800">{s.ultima_linha}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Total processados</p>
                    <p className="text-lg font-black text-green-600">{s.total_processados}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Atualizado em</p>
                    <p className="text-sm text-gray-700">
                      {s.atualizado_em ? new Date(s.atualizado_em).toLocaleString('pt-BR') : '—'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-red-50 rounded-full p-2 mt-0.5">
              <RotateCcw size={16} className="text-[#cc142d]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">Resetar contador</p>
              <p className="text-xs text-gray-500 mt-1">
                Apaga o registro de "última linha processada". No próximo disparo, o cron lerá
                a planilha do começo. Útil para testes e demonstrações. Não apaga atendimentos já criados.
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            disabled={resetando}
            className="w-full bg-[#cc142d] hover:bg-[#b01227] text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <RotateCcw size={16} />
            {resetando ? 'Resetando...' : 'Resetar contador do cron'}
          </button>

          {feedback && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <CheckCircle size={14} />
              {feedback}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 opacity-60">
        <h3 className="font-bold text-gray-800 mb-1">Outras configurações</h3>
        <p className="text-xs text-gray-400 mb-4">Em breve: gerenciamento de categorias, modo escuro, regras de validação</p>
        <p className="text-sm text-gray-400 italic">
          As próximas configurações (taxonomia editável, tema, limites de qualidade) serão adicionadas aqui.
        </p>
      </div>
    </div>
  );
}
