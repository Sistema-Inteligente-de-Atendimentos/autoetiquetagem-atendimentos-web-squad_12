import { FileText, CheckCircle, Clock, TrendingUp, BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { StatCard } from '../../components/ui/StatCard';

const dadosMensais = [
  { name: 'Jan', total: 145 },
  { name: 'Fev', total: 180 },
  { name: 'Mar', total: 210 },
  { name: 'Abr', total: 195 },
  { name: 'Mai', total: 240 },
  { name: 'Jun', total: 290 },
];

const dadosSentimento = [
  { name: 'Positivo', value: 53, fill: '#10b981' },
  { name: 'Neutro', value: 31, fill: '#f59e0b' },
  { name: 'Negativo', value: 16, fill: '#ef4444' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Visão geral do sistema de autoetiquetagem de atendimentos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Classificado" 
          value="1,234" 
          trend="+12.5%" 
          trendType="positive" 
          icon={FileText} 
          iconColor="text-blue-600" 
        />
        <StatCard 
          title="Taxa de Sucesso" 
          value="94.3%" 
          trend="+2.1%" 
          trendType="positive" 
          icon={TrendingUp} 
          iconColor="text-green-600" 
        />
        <StatCard 
          title="Validações Pendentes" 
          value="23" 
          trend="-5" 
          trendType="negative" 
          icon={Clock} 
          iconColor="text-orange-500" 
        />
        <StatCard 
          title="Aprovados" 
          value="1,167" 
          trend="+18.2%" 
          trendType="positive" 
          icon={CheckCircle} 
          iconColor="text-green-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <BarChartIcon size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-800">Atendimentos Mensais</h3>
          </div>
          <p className="text-xs text-gray-400 mb-6 ml-7">Volume de atendimentos classificados por mês</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="total" fill="#cc142d" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <PieChartIcon size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-800">Distribuição de Sentimento</h3>
          </div>
          <p className="text-xs text-gray-400 mb-6 ml-7">Análise de sentimento dos atendimentos</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosSentimento}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosSentimento.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  iconType="circle" 
                  verticalAlign="bottom" 
                  wrapperStyle={{paddingTop: '20px', fontSize: '12px'}} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}