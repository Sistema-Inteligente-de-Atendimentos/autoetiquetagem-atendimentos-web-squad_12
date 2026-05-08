import { useEffect, useState } from 'react';
import { getAtendimentos } from '../../services/api';
import { 
  Search, 
  Eye, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  MessageSquare 
} from 'lucide-react';

export default function Atendimentos() {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const response = await getAtendimentos();
        setDados(response);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarHistorico();
  }, []);

  const dadosFiltrados = dados.filter(item => 
    item.id.toString().includes(filtro) || 
    item.texto_bruto.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
        <p className="text-gray-500 font-medium">Consultando base de dados Postgres...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Atendimentos</h2>
          <p className="text-sm text-gray-500">Monitore e audite as classificações realizadas pela IA</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por ID ou conteúdo..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data de Criação</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Análise IA</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sentimento</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Score Qualidade</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dadosFiltrados.length > 0 ? (
                dadosFiltrados.map((item) => {
                  const analise = item.analises?.[0];
                  const score = analise?.score_qualidade?.score_final;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-bold text-gray-900">#{item.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock size={14} className="mr-2 text-gray-400" />
                          {new Date(item.data_criacao).toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800">
                            {analise?.categoria || 'Não classificado'}
                          </span>
                          <span className="text-xs text-gray-400 truncate max-w-[150px]">
                            {analise?.intencao || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          analise?.sentimento === 'Positivo' ? 'bg-green-100 text-green-800' :
                          analise?.sentimento === 'Negativo' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {analise?.sentimento || 'Neutro'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-16 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                (score || 0) >= 7 ? 'bg-green-500' : (score || 0) >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${(score || 0) * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-700">
                            {score ? score.toFixed(1) : '0.0'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          title="Ver Detalhes"
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <MessageSquare size={40} className="mb-2 opacity-20" />
                      <p>Nenhum atendimento encontrado na base de dados.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}