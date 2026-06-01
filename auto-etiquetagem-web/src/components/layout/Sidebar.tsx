import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTree, Database, Settings, LogOut, X } from 'lucide-react';
import logoImg from '../../assets/logo.png';

type SidebarProps = {
  aberta: boolean;
  onClose: () => void;
};

export const Sidebar = ({ aberta, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay (apenas mobile, quando aberta) */}
      {aberta && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-64 h-screen bg-[#1e1a17] text-gray-400 flex flex-col p-4 fixed left-0 top-0 z-30
          transform transition-transform duration-300 ease-in-out
          ${aberta ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Botão fechar (apenas mobile) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white lg:hidden"
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-center mb-10 px-2 pt-6">
          <img
            src={logoImg}
            alt="Logo Empresa"
            className="h-10 w-auto object-contain"
          />
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" active={location.pathname === '/'} onClick={onClose} />
          <NavItem to="/atendimentos" icon={<ListTree size={18} />} label="Lista de Atendimentos" active={location.pathname === '/atendimentos'} onClick={onClose} />
          <NavItem to="/entrada" icon={<Database size={18} />} label="Entrada de dados" active={location.pathname === '/entrada'} onClick={onClose} />
          <NavItem to="/configuracoes" icon={<Settings size={18} />} label="Configurações" active={location.pathname === '/configuracoes'} onClick={onClose} />
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 hover:text-white transition-colors mt-auto border-t border-gray-800 text-sm">
          <LogOut size={18} />
          <span>Signout</span>
        </button>
      </aside>
    </>
  );
};

const NavItem = ({ to, icon, label, active, onClick }: { to: string, icon: React.ReactNode, label: string, active: boolean, onClick?: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
      active
        ? 'bg-[#cc142d] text-white shadow-lg shadow-red-900/20'
        : 'hover:bg-white/5 hover:text-white'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);
