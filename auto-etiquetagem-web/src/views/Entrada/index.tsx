import { Upload, Send, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { classifyText } from '../../services/api';
import type { ClassificationResult } from './types';

export default function EntradaDados() {

  const [result,setResult] = useState<ClassificationResult | null>(null);
  const [usage, setUsage] = useState<any>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleClassify(){
    if (!text){
      alert("Digite um texto");
      return;
    }

    try{
      setLoading(true)

      const response = await classifyText(text);

      setResult(response.data);
      setUsage(response.usage);
      console.log("API RESPONSE:", JSON.stringify(response, null, 2));
      console.log(response.usage)
      console.log("TOKENS:", response.usage?.total_tokens);

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
            <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-10 group hover:border-red-300 hover:bg-red-50/30 transition-all cursor-pointer">
              <div className="p-4 bg-gray-50 rounded-full group-hover:bg-red-100 transition-all">
                <FileSpreadsheet size={40} className="text-gray-400 group-hover:text-[#cc142d]" />
              </div>
              <p className="mt-4 text-sm text-gray-600 text-center">
                Arraste e solte seu arquivo aqui ou <span className="text-[#cc142d] font-bold">clique para selecionar</span>
              </p>
              
              <button className="mt-6 bg-[#cc142d] text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <Upload size={16} /> Selecionar Arquivo
              </button>
              
              <p className="mt-4 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                Formatos aceitos: CSV, XLSX (máx. 10MB)
              </p>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-blue-500 shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Certifique-se de que o arquivo contenha uma coluna chamada <span className="font-bold uppercase tracking-tighter">atendimento</span> ou <span className="font-bold uppercase tracking-tighter">texto</span> para que a IA consiga identificar os dados corretamente.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}