import { useEffect, useState } from 'react';
import { FileText, TrendingUp, MessageSquare, BarChart as BarChartIcon, PieChart as PieChartIcon, Award } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { getDashboardStats, type DashboardStats } from '../../services/api';

const PIE_COLORS = ['#cc142d', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (e) {
        console.error(e);
        setErro("Falha ao carregar métricas.");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
        <p className="text-gray-500 font-medium">Carregando métricas...</p>
      </div>
    );
  }

  if (erro || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
        {erro || "Sem dados disponíveis."}
      </div>
    );
  }

  const totalAvaliados = stats.distribuicao_notas.reduce((acc, n) => acc + n.total, 0);
  const totalCanais = stats.volume_por_canal.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Visão geral do sistema de autoetiquetagem de atendimentos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Atendimentos"
          value={stats.total_atendimentos.toLocaleString('pt-BR')}
          trend={`${totalAvaliados} avaliados`}
          trendType="positive"
          icon={FileText}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Nota Média"
          value={stats.media_qualidade.toFixed(2)}
          trend={stats.media_qualidade >= 7 ? "Boa qualidade" : "Atenção"}
          trendType={stats.media_qualidade >= 7 ? "positive" : "negative"}
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <StatCard
          title="Canais Ativos"
          value={String(totalCanais)}
          trend={totalCanais ? "monitorados" : "—"}
          trendType="positive"
          icon={MessageSquare}
          iconColor="text-orange-500"
        />
        <StatCard
          title="Exemplos aprovados"
          value={String(stats.total_exemplos_aprovados)}
          trend={stats.total_exemplos_aprovados > 0 ? "usados como referência" : "nenhum ainda"}
          trendType="positive"
          icon={Award}
          iconColor="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <BarChartIcon size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-800">Distribuição de Notas</h3>
          </div>
          <p className="text-xs text-gray-400 mb-6 ml-7">Quantidade de protocolos por nota (1 a 10)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.distribuicao_notas}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="nota"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#cc142d" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <PieChartIcon size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-800">Volume por Canal</h3>
          </div>
          <p className="text-xs text-gray-400 mb-6 ml-7">Distribuição de atendimentos por canal</p>
          <div className="h-64">
            {stats.volume_por_canal.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                Nenhum canal registrado ainda.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.volume_por_canal}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="total"
                    nameKey="canal"
                    label
                  >
                    {stats.volume_por_canal.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    iconType="circle"
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
