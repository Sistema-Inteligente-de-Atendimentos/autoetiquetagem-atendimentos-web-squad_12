import { useEffect, useState } from 'react';
import { RefreshCw, Settings, Clock, RotateCcw, CheckCircle, Tag, X, Plus, Lock, Sheet, Trash2, ToggleLeft, ToggleRight, ExternalLink, Moon, Sun, AlertTriangle } from 'lucide-react';
import {
  getCronStatus,
  resetCron,
  getCategorias,
  addCategoria,
  removeCategoria,
  getPlanilhas,
  addPlanilha,
  ativarPlanilha,
  desativarPlanilha,
  removePlanilha,
  resetPlanilha,
  type CronStatusItem,
  type CategoriaExtra,
  type Planilha,
} from '../../services/api';
import { useTheme } from '../../hooks/useTheme';

export default function Configuracoes() {
  const { tema, alternarTema } = useTheme();
  const [status, setStatus] = useState<CronStatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetando, setResetando] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [fixas, setFixas] = useState<string[]>([]);
  const [extras, setExtras] = useState<CategoriaExtra[]>([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [revisorCategoria, setRevisorCategoria] = useState('');
  const [salvandoCategoria, setSalvandoCategoria] = useState(false);
  const [erroCategoria, setErroCategoria] = useState<string | null>(null);

  const [planilhas, setPlanilhas] = useState<Planilha[]>([]);
  const [novaUrl, setNovaUrl] = useState('');
  const [novaNome, setNovaNome] = useState('');
  const [novaCriadoPor, setNovaCriadoPor] = useState('');
  const [salvandoPlanilha, setSalvandoPlanilha] = useState(false);
  const [erroPlanilha, setErroPlanilha] = useState<string | null>(null);
  const [feedbackPlanilha, setFeedbackPlanilha] = useState<string | null>(null);

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

  async function carregarPlanilhas() {
    try {
      setPlanilhas(await getPlanilhas());
    } catch (e) {
      console.error(e);
    }
  }

  async function carregarCategorias() {
    try {
      const data = await getCategorias();
      setFixas(data.fixas);
      setExtras(data.extras);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    carregarStatus();
    carregarCategorias();
    carregarPlanilhas();
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

  async function handleAddCategoria() {
    const nome = novaCategoria.trim();
    if (!nome) {
      setErroCategoria('Informe o nome da categoria');
      return;
    }
    try {
      setSalvandoCategoria(true);
      setErroCategoria(null);
      await addCategoria(nome, revisorCategoria.trim() || undefined);
      setNovaCategoria('');
      await carregarCategorias();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao adicionar';
      setErroCategoria(msg);
    } finally {
      setSalvandoCategoria(false);
    }
  }

  async function handleRemoveCategoria(id: number, nome: string) {
    if (!confirm(`Remover a categoria "${nome}"? Atendimentos já classificados com ela continuam intactos.`)) {
      return;
    }
    try {
      await removeCategoria(id);
      await carregarCategorias();
    } catch (e) {
      console.error(e);
      alert('Erro ao remover categoria.');
    }
  }

  async function handleAddPlanilha() {
    const url = novaUrl.trim();
    if (!url) { setErroPlanilha('Informe a URL da planilha'); return; }
    try {
      setSalvandoPlanilha(true);
      setErroPlanilha(null);
      const r = await addPlanilha(url, novaNome.trim() || undefined, novaCriadoPor.trim() || undefined);
      setNovaUrl(''); setNovaNome(''); setNovaCriadoPor('');
      setFeedbackPlanilha(`Planilha adicionada! ${r.linhas_detectadas} linhas detectadas.`);
      setTimeout(() => setFeedbackPlanilha(null), 5000);
      await carregarPlanilhas();
    } catch (e) {
      setErroPlanilha(e instanceof Error ? e.message : 'Erro ao adicionar');
    } finally {
      setSalvandoPlanilha(false);
    }
  }

  async function handleTogglePlanilha(p: Planilha) {
    try {
      if (p.ativo) await desativarPlanilha(p.id); else await ativarPlanilha(p.id);
      await carregarPlanilhas();
    } catch (e) { console.error(e); }
  }

  async function handleRemovePlanilha(p: Planilha) {
    if (!confirm(`Remover "${p.nome || p.url.slice(0, 40)}"? O histórico de progresso será apagado.`)) return;
    try {
      await removePlanilha(p.id);
      await carregarPlanilhas();
    } catch (e) { console.error(e); }
  }

  async function handleResetPlanilha(p: Planilha) {
    if (!confirm(`Resetar o contador de "${p.nome || p.url.slice(0, 40)}"? Ela será reprocessada do início no próximo disparo.`)) return;
    try {
      await resetPlanilha(p.id);
      await carregarPlanilhas();
    } catch (e) { console.error(e); }
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

      {/* Aparência */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              {tema === 'dark' ? <Moon size={18} className="text-gray-400" /> : <Sun size={18} className="text-gray-400" />}
              Aparência
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Alterne entre o tema claro e escuro. Sua preferência fica salva neste navegador.
            </p>
          </div>
          <button
            onClick={alternarTema}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
              tema === 'dark' ? 'bg-[#cc142d]' : 'bg-gray-300'
            }`}
            title={tema === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white transition-transform ${
                tema === 'dark' ? 'translate-x-8' : 'translate-x-1'
              }`}
            >
              {tema === 'dark' ? <Moon size={11} className="text-[#cc142d]" /> : <Sun size={11} className="text-amber-500" />}
            </span>
          </button>
        </div>
      </div>

      {/* Planilhas Google Sheets */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Sheet size={18} className="text-gray-400" />
            Planilhas Google Sheets
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            URLs das planilhas processadas pelo cron. Cada uma deve ser pública e ter a coluna <code className="bg-gray-100 px-1 rounded text-[11px]">texto</code>.
          </p>
        </div>

        <div className="space-y-2 mb-4">
          {planilhas.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Nenhuma planilha cadastrada. Adicione abaixo.</p>
          ) : planilhas.map((p) => (
            <div key={p.id} className={`flex items-start gap-3 p-3 rounded-lg border ${p.ativo ? 'bg-gray-50 border-gray-100' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {p.nome && <span className="text-sm font-semibold text-gray-800">{p.nome}</span>}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {p.ativo ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 break-all">
                  {p.url.length > 60 ? p.url.slice(0, 60) + '...' : p.url}
                  <ExternalLink size={10} />
                </a>
                <div className="flex gap-4 mt-1.5 text-[10px] text-gray-400">
                  <span>📊 {p.total_processados} processados</span>
                  <span>📍 linha {p.ultima_linha}</span>
                  {p.atualizado_em && <span>🕐 {new Date(p.atualizado_em).toLocaleString('pt-BR')}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => handleTogglePlanilha(p)} title={p.ativo ? 'Desativar' : 'Ativar'} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                  {p.ativo ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                </button>
                <button onClick={() => handleResetPlanilha(p)} title="Resetar contador desta planilha" className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors text-gray-400 hover:text-amber-600">
                  <RotateCcw size={15} />
                </button>
                <button onClick={() => handleRemovePlanilha(p)} title="Remover" className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-[#cc142d]">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-2">Adicionar planilha</p>
          <div className="space-y-2">
            <input type="text" value={novaUrl} onChange={(e) => { setNovaUrl(e.target.value); setErroPlanilha(null); }}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input type="text" value={novaNome} onChange={(e) => setNovaNome(e.target.value)}
                placeholder="Nome da planilha (opcional)"
                className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300" />
              <input type="text" value={novaCriadoPor} onChange={(e) => setNovaCriadoPor(e.target.value)}
                placeholder="Seu nome (opcional)"
                className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300" />
            </div>
            <button onClick={handleAddPlanilha} disabled={salvandoPlanilha || !novaUrl.trim()}
              className="w-full bg-[#cc142d] hover:bg-[#b01227] text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              <Plus size={16} />
              {salvandoPlanilha ? 'Validando URL e salvando...' : 'Adicionar planilha'}
            </button>
            {erroPlanilha && <p className="text-xs text-red-600">{erroPlanilha}</p>}
            {feedbackPlanilha && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <CheckCircle size={14} /> {feedbackPlanilha}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Tag size={18} className="text-gray-400" />
            Categorias de Atendimento
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Categorias usadas pela IA na classificação. As 9 categorias base são fixas. Você pode adicionar novas conforme necessário.
          </p>
        </div>

        <div className="mb-4">
          <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-2">
            Categorias Fixas ({fixas.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {fixas.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200"
              >
                <Lock size={11} className="text-gray-400" />
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-2">
            Categorias Adicionadas ({extras.length})
          </p>
          {extras.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Nenhuma categoria customizada ainda. Adicione abaixo se precisar.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {extras.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 bg-red-50 text-[#cc142d] px-3 py-1.5 rounded-lg text-sm font-medium border border-red-100"
                  title={cat.criada_por ? `Adicionada por ${cat.criada_por}` : undefined}
                >
                  {cat.nome}
                  <button
                    onClick={() => handleRemoveCategoria(cat.id, cat.nome)}
                    className="hover:bg-red-100 rounded-full p-0.5 transition-colors"
                    title="Remover"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mb-2">
            Adicionar nova categoria
          </p>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
            <input
              type="text"
              value={novaCategoria}
              onChange={(e) => { setNovaCategoria(e.target.value); setErroCategoria(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategoria(); }}
              placeholder="Nome da categoria (ex: Jurídico)"
              className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300"
            />
            <input
              type="text"
              value={revisorCategoria}
              onChange={(e) => setRevisorCategoria(e.target.value)}
              placeholder="Seu nome (opcional)"
              className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300"
            />
            <button
              onClick={handleAddCategoria}
              disabled={salvandoCategoria || !novaCategoria.trim()}
              className="bg-[#cc142d] hover:bg-[#b01227] text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Plus size={16} />
              {salvandoCategoria ? 'Salvando' : 'Adicionar'}
            </button>
          </div>
          {erroCategoria && (
            <p className="mt-2 text-xs text-red-600">{erroCategoria}</p>
          )}
        </div>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Última linha</p>
                    <p className="text-lg font-black text-gray-800">{s.ultima_linha}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Total processados</p>
                    <p className="text-lg font-black text-green-600">{s.total_processados}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Erros</p>
                    <p className={`text-lg font-black ${s.total_erros > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                      {s.total_erros}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Atualizado em</p>
                    <p className="text-sm text-gray-700">
                      {s.atualizado_em ? new Date(s.atualizado_em).toLocaleString('pt-BR') : '—'}
                    </p>
                  </div>
                </div>
                {s.ultimo_erro && (
                  <div className="mt-3 flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span className="break-all">Último erro: {s.ultimo_erro}</span>
                  </div>
                )}
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
    </div>
  );
}
