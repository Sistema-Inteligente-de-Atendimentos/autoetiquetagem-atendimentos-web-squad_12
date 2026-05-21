import { Upload, Send, FileSpreadsheet, AlertCircle, ExternalLink, XCircle, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { classifyText, classifyBatch, type ClassifyResponse, type BatchResponse } from '../../services/api';
import type { ClassificationResult } from './types';

export default function EntradaDados() {

  const [result,setResult] = useState<ClassificationResult | null>(null);
  const [usage, setUsage] = useState<any>(null);
  const [text, setText] = useState("");
  const [canal, setCanal] = useState("Web");
  const [clienteNome, setClienteNome] = useState("");
  const [atendenteNome, setAtendenteNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [protocoloCriado, setProtocoloCriado] = useState<ClassifyResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchResponse | null>(null);
  const [batchErro, setBatchErro] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setArquivo(file);
    setBatchResult(null);
    setBatchErro(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    setArquivo(file);
    setBatchResult(null);
    setBatchErro(null);
  }

  async function handleBatchUpload() {
    if (!arquivo) {
      alert("Selecione um arquivo primeiro.");
      return;
    }
    try {
      setBatchLoading(true);
      setBatchErro(null);
      const response = await classifyBatch(arquivo);
      setBatchResult(response);
    } catch (error: any) {
      console.error(error);
      setBatchErro(error.message || "Erro ao processar arquivo");
    } finally {
      setBatchLoading(false);
    }
  }

  function normalizaResumo(resumo: string | string[] | undefined): string[] {
    if (!resumo) return [];
    if (Array.isArray(resumo)) return resumo;
    return [resumo];
  }

  async function handleClassify(){
    if (!text){
      alert("Digite um texto");
      return;
    }

    try{
      setLoading(true)

      const response = await classifyText({
        text,
        canal,
        cliente_nome: clienteNome || undefined,
        atendente_nome: atendenteNome || undefined,
      });

      const normalizado = {
        ...response.data,
        resumo: normalizaResumo(response.data.resumo as any),
      } as ClassificationResult;

      setResult(normalizado);
      setUsage(response.usage);
      setProtocoloCriado(response);

    }catch(error){
      console.error(error);
      alert("Erro ao classificar");
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Processamentos</h1>
        <p className="text-gray-500">Classifique atendimentos individualmente ou em lote com inteligência artificial</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Lado Esquerdo: Classificação Individual */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <h3 className="font-bold text-gray-800 text-lg">Classificação Individual</h3>
            <p className="text-xs text-gray-400 mt-1">Cole o chat de atendimento para análise e classificação automática</p>
          </div>
          
          <div className="p-6 flex-1 flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Canal</label>
                <select
                  value={canal}
                  onChange={(e) => setCanal(e.target.value)}
                  className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option>Web</option>
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Telefone</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Cliente</label>
                <input
                  type="text"
                  value={clienteNome}
                  onChange={(e) => setClienteNome(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Atendente</label>
                <input
                  type="text"
                  value={atendenteNome}
                  onChange={(e) => setAtendenteNome(e.target.value)}
                  placeholder="Nome do atendente"
                  className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>

            <label className="text-sm font-semibold text-gray-700">Chat de Atendimento</label>
            <textarea
              value={text}
              onChange={(e)=> setText(e.target.value)}
              placeholder="Cole o chat do atendimento aqui..."
              className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none min-h-[300px]"
            />
            <button onClick={handleClassify} className="w-full bg-[#cc142d] hover:bg-[#b01227] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]">
              <Send size={18} />
              {loading ? "Classificando": "Classificar com IA"}
            </button>

            {protocoloCriado && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-green-800">
                    Protocolo #{protocoloCriado.protocolo_id} criado com sucesso!
                  </p>
                  <p className="text-[10px] text-green-600 font-mono">
                    {protocoloCriado.protocolo_numero}
                  </p>
                </div>
                <Link
                  to={`/atendimentos/${protocoloCriado.protocolo_id}`}
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#cc142d] hover:underline"
                >
                  Ver detalhes <ExternalLink size={14} />
                </Link>
              </div>
            )}

            {result && (
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4 text-sm">
                <h4 className="font-bold text-gray-800">Classification Result</h4>

                  <div className="grid grid-cols-2 gap-2">
                    <p><span className="font-semibold">Categoria:</span> {result.categoria}</p>
                    <p><span className="font-semibold">Intenção:</span> {result.intencao}</p>
                    <p><span className="font-semibold">Sentimento:</span> {result.sentimento}</p>
                    <p><span className="font-semibold">Criticidade:</span> {result.criticidade}</p>
                    <p><span className="font-semibold">SLA:</span> {result.sla_urgencia}</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-1">Summary</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {result.resumo?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold mb-1">Topics</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {result.topicos?.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold mb-1">Quality</p>
                    <div className="grid grid-cols-2 gap-2">
                      <p>Empatia: {result.qualidade?.empatia}</p>
                        <p>Claridade: {result.qualidade?.clareza}</p>
                        <p>Objetividade: {result.qualidade?.objetividade}</p>
                        <p>Resolutividade: {result.qualidade?.resolutividade}</p>

                        <p className="col-span-2 font-bold">
                          Score Final: {result.qualidade?.score_final}
                        </p>
                    </div>
                  </div>

              </div>
            )}


            {usage && (
              <div className="mt-4">
                <p className="font-semibold mb-2 text-gray-700">Token Usage</p>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  
                  <div className="bg-gray-100 p-3 rounded-lg text-center">
                    <p className="font-bold text-gray-800">
                      {usage.prompt_tokens}
                    </p>
                    <p className="text-gray-500">Input</p>
                  </div>

                  <div className="bg-gray-100 p-3 rounded-lg text-center">
                    <p className="font-bold text-gray-800">
                      {usage.completion_tokens}
                    </p>
                    <p className="text-gray-500">Output</p>
                  </div>

                  <div className="bg-gray-100 p-3 rounded-lg text-center">
                    <p className="font-bold text-gray-800">
                      {usage.total_tokens}
                    </p>
                    <p className="text-gray-500">Total</p>
                  </div>

                </div>

                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>⏱ {usage.total_time?.toFixed(2)}s</span>
                  <span>Queue: {usage.queue_time?.toFixed(2)}s</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito: Upload de Arquivo */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <h3 className="font-bold text-gray-800 text-lg">Upload de arquivo</h3>
            <p className="text-xs text-gray-400 mt-1">Envie um arquivo CSV ou Excel com os atendimentos para processamento</p>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-10 group transition-all cursor-pointer ${
                arquivo
                  ? 'border-green-300 bg-green-50/30'
                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50/30'
              }`}
            >
              <div className={`p-4 rounded-full transition-all ${
                arquivo ? 'bg-green-100' : 'bg-gray-50 group-hover:bg-red-100'
              }`}>
                <FileSpreadsheet size={40} className={
                  arquivo ? 'text-green-600' : 'text-gray-400 group-hover:text-[#cc142d]'
                } />
              </div>

              {arquivo ? (
                <>
                  <p className="mt-4 text-sm font-bold text-green-700">{arquivo.name}</p>
                  <p className="text-[10px] text-green-500">
                    {(arquivo.size / 1024).toFixed(1)} KB — Clique para trocar
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Arraste e solte seu arquivo aqui ou <span className="text-[#cc142d] font-bold">clique para selecionar</span>
                  </p>
                  <p className="mt-4 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                    Formatos aceitos: CSV, XLSX (máx. 50 linhas)
                  </p>
                </>
              )}
            </div>

            {arquivo && !batchResult && (
              <button
                onClick={handleBatchUpload}
                disabled={batchLoading}
                className="mt-4 w-full bg-[#cc142d] hover:bg-[#b01227] disabled:bg-gray-300 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
              >
                {batchLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processando... (pode levar alguns minutos)
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Processar Arquivo
                  </>
                )}
              </button>
            )}

            {batchErro && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{batchErro}</p>
              </div>
            )}

            {batchResult && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                    <p className="text-xl font-black text-blue-700">{batchResult.total_enviados}</p>
                    <p className="text-[10px] uppercase text-blue-400 font-bold tracking-widest">Enviados</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                    <p className="text-xl font-black text-green-700">{batchResult.total_processados}</p>
                    <p className="text-[10px] uppercase text-green-400 font-bold tracking-widest">Processados</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                    <p className="text-xl font-black text-red-700">{batchResult.total_erros}</p>
                    <p className="text-[10px] uppercase text-red-400 font-bold tracking-widest">Erros</p>
                  </div>
                </div>

                {batchResult.resultados.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-3 py-2 text-left font-bold text-gray-500">Linha</th>
                          <th className="px-3 py-2 text-left font-bold text-gray-500">Protocolo</th>
                          <th className="px-3 py-2 text-left font-bold text-gray-500">Categoria</th>
                          <th className="px-3 py-2 text-left font-bold text-gray-500">Sentimento</th>
                          <th className="px-3 py-2 text-left font-bold text-gray-500">Nota</th>
                          <th className="px-3 py-2 text-center font-bold text-gray-500">Ver</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batchResult.resultados.map((r) => (
                          <tr key={r.protocolo_id} className="border-b border-gray-100">
                            <td className="px-3 py-2 text-gray-600">{r.linha}</td>
                            <td className="px-3 py-2 font-mono text-gray-800">#{r.protocolo_id}</td>
                            <td className="px-3 py-2 text-gray-700">{r.categoria || '—'}</td>
                            <td className="px-3 py-2">
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                r.sentimento === 'Positivo' ? 'bg-green-100 text-green-700' :
                                r.sentimento === 'Negativo' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {r.sentimento || 'N/A'}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-bold text-gray-800">{r.nota}</td>
                            <td className="px-3 py-2 text-center">
                              <Link
                                to={`/atendimentos/${r.protocolo_id}`}
                                className="text-[#cc142d] hover:underline"
                              >
                                <ExternalLink size={14} />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {batchResult.erros.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-bold text-red-700 flex items-center gap-1">
                      <XCircle size={14} /> Erros encontrados:
                    </p>
                    {batchResult.erros.map((e, i) => (
                      <p key={i} className="text-xs text-red-600">
                        Linha {e.linha}: {e.erro}
                      </p>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    setArquivo(null);
                    setBatchResult(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="w-full border border-gray-200 text-gray-600 font-bold py-2 rounded-lg text-sm hover:bg-gray-50 transition-all"
                >
                  Enviar outro arquivo
                </button>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-blue-500 shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                O arquivo deve conter uma coluna chamada <span className="font-bold uppercase tracking-tighter">texto</span> ou <span className="font-bold uppercase tracking-tighter">atendimento</span>. Colunas opcionais: <span className="font-bold">canal</span>, <span className="font-bold">cliente</span>, <span className="font-bold">atendente</span>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}