// src/views/Atendimentos/index.tsx
import { Badge } from '../../components/ui/Badge';
import { Download } from 'lucide-react';

export default function Atendimentos() {
  // Mock de dados baseado no seu diagrama de ER
  const atendimentos = [
    { id: 'ATD-001', data: '17/03/2026', categoria: 'Suporte Técnico', score: 8.5, status: 'Validado' },
    { id: 'ATD-002', data: '17/03/2026', categoria: 'Comercial', score: 7.2, status: 'Pendente' },
    { id: 'ATD-003', data: '16/03/2026', categoria: 'Financeiro', score: 9.1, status: 'Validado' },
    { id: 'ATD-004', data: '16/03/2026', categoria: 'Suporte Técnico', score: 6.8, status: 'Pendente' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auditoria</h1>
          <p className="text-gray-500">Faça a auditoria de todos os atendimentos etiquetados pelo LLM</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <Download size={16} /> Exportar
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {atendimentos.map((atd) => (
              <tr key={atd.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{atd.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{atd.data}</td>
                <td className="px-6 py-4">
                  <Badge label={atd.categoria} variant="default" />
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-bold ${atd.score >= 8 ? 'text-green-600' : atd.score >= 6 ? 'text-orange-500' : 'text-red-600'}`}>
                    {atd.score.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    label={atd.status} 
                    variant={atd.status === 'Validado' ? 'success' : 'warning'} 
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm font-medium text-gray-400 hover:text-red-600">Revisar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}