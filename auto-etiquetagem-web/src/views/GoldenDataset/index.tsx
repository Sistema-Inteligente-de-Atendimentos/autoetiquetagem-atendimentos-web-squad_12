import { useEffect, useState } from 'react';
import { Database, PlayCircle, Trash2, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  getGoldenDatasetItens,
  getGoldenDatasetRuns,
  executarGoldenDatasetRun,
  removeGoldenDatasetItem,
  type GoldenDatasetItem,
  type GoldenDatasetRun,
} from '../../services/api';

export default function GoldenDataset() {
  const [itens, setItens] = useState<GoldenDatasetItem[]>([]);
  const [runs, setRuns] = useState<GoldenDatasetRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [executando, setExecutando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    try {
      setLoading(true);
      const [i, r] = await Promise.all([getGoldenDatasetItens(), getGoldenDatasetRuns()]);
      setItens(i);
      setRuns(r);
    } catch (e) {
      console.error(e);
      setErro('Falha ao carregar golden dataset.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleExecutar() {
    try {
      setExecutando(true);
      setErro(null);
      await executarGoldenDatasetRun();
      await carregar();
    } catch (e) {
      console.error(e);
      setErro(e instanceof Error ? e.message : 'Erro ao executar rodada');
    } finally {
      setExecutando(false);
    }
  }

  async function handleRemover(id: number) {
    if (!confirm('Remover este item do golden dataset?')) return;
    try {
      await removeGoldenDatasetItem(id);
      await carregar();
    } catch (e) {
      console.error(e);
      alert('Erro ao remover item');
    }
  }

  const chartData = runs.map((r) => ({
    executado_em: r.executado_em ? new Date(r.executado_em).toLocaleDateString('pt-BR') : '',
    acuracia: Math.round(r.acuracia_geral * 100),
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Golden Dataset</h1>
          <p className="text-gray-500">Conjunto de referência para medir acurácia da IA ao longo do tempo</p>
        </div>
        <button
          onClick={handleExecutar}
          disabled={executando || itens.length === 0}
          className="bg-[#cc142d] hover:bg-[#b01227] text-white font-bold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayCircle size={18} />
          {executando ? 'Executando...' : 'Executar nova rodada'}
        </button>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{erro}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={18} className="text-gray-400" />
          <h3 className="font-bold text-gray-800">Acurácia ao longo do tempo</h3>
        </div>
        <p className="text-xs text-gray-400 mb-6 ml-7">Acurácia geral (%) de cada rodada de execução</p>
        <div className="h-64">
          {runs.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Nenhuma execução registrada ainda.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="executado_em" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} unit="%" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="acuracia" stroke="#cc142d" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Database size={18} className="text-gray-400" />
            Itens do Golden Dataset ({itens.length})
          </h3>
          <p className="text-xs text-gray-400 mt-1">Casos congelados usados como referência fixa para medir drift de acurácia.</p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Carregando...</p>
        ) : itens.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Nenhum item adicionado ainda. Adicione casos revisados na tela de detalhe do atendimento.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase text-gray-400 font-bold tracking-widest border-b border-gray-100">
                  <th className="py-2 pr-4">Protocolo</th>
                  <th className="py-2 pr-4">Canal</th>
                  <th className="py-2 pr-4">Cliente</th>
                  <th className="py-2 pr-4">Categoria</th>
                  <th className="py-2 pr-4">Sentimento</th>
                  <th className="py-2 pr-4">Criticidade</th>
                  <th className="py-2 pr-4">Score</th>
                  <th className="py-2 pr-4">Incluído por</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 pr-4 font-mono text-xs">{item.numero || '—'}</td>
                    <td className="py-2 pr-4">{item.canal || '—'}</td>
                    <td className="py-2 pr-4">{item.cliente_nome || '—'}</td>
                    <td className="py-2 pr-4">{item.categoria_esperada || '—'}</td>
                    <td className="py-2 pr-4">{item.sentimento_esperado || '—'}</td>
                    <td className="py-2 pr-4">{item.criticidade_esperada || '—'}</td>
                    <td className="py-2 pr-4">{item.score_esperado != null ? item.score_esperado.toFixed(1) : '—'}</td>
                    <td className="py-2 pr-4 text-xs text-gray-400">
                      {item.incluido_por || 'Anônimo'}
                      {item.incluido_em && <> em {new Date(item.incluido_em).toLocaleDateString('pt-BR')}</>}
                    </td>
                    <td className="py-2 pr-4">
                      <button onClick={() => handleRemover(item.id)} title="Remover" className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-[#cc142d]">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
