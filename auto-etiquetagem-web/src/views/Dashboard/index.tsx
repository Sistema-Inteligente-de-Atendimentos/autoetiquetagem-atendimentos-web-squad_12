
import { FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header da Tela */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
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
        <div className="h-80 bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-center text-gray-400">
          Gráfico: Atendimentos Mensais (Aguardando Recharts)
        </div>
        <div className="h-80 bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-center text-gray-400">
          Gráfico: Distribuição de Sentimento
        </div>
      </div>
    </div>
  );
}