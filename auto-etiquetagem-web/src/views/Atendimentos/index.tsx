import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAtendimentos, type AtendimentoListItem } from '../../services/api';
import { Search, Eye, Clock, MessageSquare } from 'lucide-react';

export default function Atendimentos() {
  const [dados, setDados] = useState<AtendimentoListItem[]>([]);
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

  const termo = filtro.toLowerCase();
  const dadosFiltrados = dados.filter(item => {
    return (
      item.protocolo_id.toString().includes(filtro) ||
      (item.numero?.toLowerCase().includes(termo) ?? false) ||
      (item.cliente_nome?.toLowerCase().includes(termo) ?? false) ||
      (item.comentario?.toLowerCase().includes(termo) ?? false)
    );
  });

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Atendimentos</h2>
          <p className="text-sm text-gray-500">Monitore e audite as classificações realizadas pela IA</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por protocolo, cliente ou conteúdo..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-96 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Protocolo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Canal</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aberto em</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nota</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dadosFiltrados.length > 0 ? (
                dadosFiltrados.map((item) => {
                  const nota = item.nota ?? 0;
                  return (
                    <tr key={item.protocolo_id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-bold text-gray-900">
                          #{item.protocolo_id}
                        </span>
                        <p className="text-[10px] text-gray-400 font-mono">
                          {item.numero?.slice(0, 8)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800">
                            {item.cliente_nome || 'Não informado'}
                          </span>
                          <span className="text-xs text-gray-400">
                            Atend.: {item.atendente_nome || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {item.canal || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock size={14} className="mr-2 text-gray-400" />
                          {item.aberto_em
                            ? new Date(item.aberto_em).toLocaleString('pt-BR')
                            : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-16 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                nota >= 7 ? 'bg-green-500' : nota >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${nota * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-700">
                            {item.nota != null ? item.nota.toFixed(1) : '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/atendimentos/${item.protocolo_id}`}
                          title="Ver Detalhes"
                          className="inline-flex p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </Link>
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
