import { useState } from 'react';
import { Calendar } from 'lucide-react';

export type Periodo = { inicio: string | null; fim: string | null };

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

type Atalho = 'tudo' | 'hoje' | '7' | '30' | 'custom';

export function SeletorPeriodo({ value, onChange }: { value: Periodo; onChange: (p: Periodo) => void }) {
  const [ativo, setAtivo] = useState<Atalho>('tudo');
  const [mostrarCustom, setMostrarCustom] = useState(false);

  function aplicarAtalho(a: Atalho) {
    setAtivo(a);
    const hoje = new Date();
    if (a === 'tudo') {
      setMostrarCustom(false);
      onChange({ inicio: null, fim: null });
    } else if (a === 'hoje') {
      setMostrarCustom(false);
      onChange({ inicio: ymd(hoje), fim: ymd(hoje) });
    } else if (a === '7') {
      setMostrarCustom(false);
      const ini = new Date(hoje);
      ini.setDate(ini.getDate() - 6);
      onChange({ inicio: ymd(ini), fim: ymd(hoje) });
    } else if (a === '30') {
      setMostrarCustom(false);
      const ini = new Date(hoje);
      ini.setDate(ini.getDate() - 29);
      onChange({ inicio: ymd(ini), fim: ymd(hoje) });
    } else if (a === 'custom') {
      setMostrarCustom(true);
    }
  }

  const atalhos: { id: Atalho; label: string }[] = [
    { id: 'tudo', label: 'Tudo' },
    { id: 'hoje', label: 'Hoje' },
    { id: '7', label: '7 dias' },
    { id: '30', label: '30 dias' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {atalhos.map((a) => (
          <button
            key={a.id}
            onClick={() => aplicarAtalho(a.id)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              ativo === a.id ? 'bg-white text-[#cc142d] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {a.label}
          </button>
        ))}
        <button
          onClick={() => aplicarAtalho('custom')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
            ativo === 'custom' ? 'bg-white text-[#cc142d] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calendar size={12} /> Período
        </button>
      </div>

      {mostrarCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={value.inicio || ''}
            onChange={(e) => onChange({ ...value, inicio: e.target.value || null })}
            className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
          <span className="text-gray-400 text-xs">até</span>
          <input
            type="date"
            value={value.fim || ''}
            onChange={(e) => onChange({ ...value, fim: e.target.value || null })}
            className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      )}
    </div>
  );
}
