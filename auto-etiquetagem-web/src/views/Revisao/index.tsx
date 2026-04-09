import { ThumbsUp, ThumbsDown, UserCheck, MessageSquare, Info } from 'lucide-react';

export default function Revisao() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Validação Humana</h1>
          <p className="text-gray-500">Revise e valide as classificações feitas pela IA</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
          <span className="text-sm font-bold text-gray-400">ITEM <span className="text-[#cc142d]">1 DE 1</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo: Dados Originais e Justificativa (Col 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={18} className="text-gray-400" />
              <h3 className="font-bold text-gray-800">Chat Original</h3>
              <span className="text-xs text-gray-400 ml-auto">ID: ATD-002</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 text-sm text-gray-700 leading-relaxed max-h-64 overflow-y-auto italic">
              <p><strong>Cliente:</strong> Olá, estou com problema no pagamento.</p>
              <p><strong>Atendente:</strong> Olá! Vou verificar isso para você imediatamente.</p>
              <p><strong>Cliente:</strong> Obrigado!</p>
              <p><strong>Atendente:</strong> Identifiquei o problema. Vou processar o estorno.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className="text-gray-400" />
              <h3 className="font-bold text-gray-800">Justificativa da IA</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 text-sm text-gray-500 leading-relaxed">
              O atendimento foi cordial e resolutivo, porém faltou uma explicação mais detalhada sobre o motivo do problema inicial.
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-[0.98]">
              <ThumbsDown size={20} /> Rejeitar
            </button>
            <button className="flex-2 bg-[#cc142d] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#b01227] transition-all shadow-lg active:scale-[0.98] w-full">
              <ThumbsUp size={20} /> Aprovar Classificação
            </button>
          </div>
        </div>

        {/* Lado Direito: Scores e Tags (Col 1/3) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <UserCheck size={18} className="text-gray-400" /> Classificação da IA
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Categoria</p>
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold text-sm border border-gray-200">
                  Comercial
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sentimento</p>
                  <span className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg font-bold text-xs border border-yellow-100 uppercase">
                    Neutro
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Criticidade</p>
                  <span className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg font-bold text-xs border border-orange-100 uppercase">
                    Média
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-6">Scores de Qualidade</h3>
            <div className="grid grid-cols-1 gap-6">
              <ScoreCircle label="Empatia" score={7.2} color="text-green-500" />
              <ScoreCircle label="Clareza" score={8.1} color="text-red-700" />
              <ScoreCircle label="Resolutividade" score={6.8} color="text-orange-500" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ScoreCircle({ label, score, color }: { label: string, score: number, color: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className={`text-lg font-black ${color}`}>{score.toFixed(1)}</span>
    </div>
  );
}