import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTree, ClipboardCheck, Database, LogOut } from 'lucide-react';
import logoImg from '../../assets/logo.png'; 

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-[#1e1a17] text-gray-400 flex flex-col p-4 fixed left-0 top-0 z-10">
      <div className="flex items-center justify-center mb-10 px-2 pt-6">
        <img 
          src={logoImg} 
          alt="Logo Empresa" 
          className="h-10 w-auto object-contain"
        />
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem 
          to="/" 
          icon={<LayoutDashboard size={18} />} 
          label="Dashboard" 
          active={location.pathname === '/'} 
        />
        <NavItem 
          to="/atendimentos" 
          icon={<ListTree size={18} />} 
          label="Lista de Atendimentos" 
          active={location.pathname === '/atendimentos'} 
        />
        <NavItem 
          to="/revisao" 
          icon={<ClipboardCheck size={18} />} 
          label="Revisão Humana" 
          active={location.pathname === '/revisao'} 
        />
        <NavItem 
          to="/entrada" 
          icon={<Database size={18} />} 
          label="Entrada de dados" 
          active={location.pathname === '/entrada'} 
        />
      </nav>

      <button className="flex items-center gap-3 px-4 py-3 hover:text-white transition-colors mt-auto border-t border-gray-800 text-sm">
        <LogOut size={18} />
        <span>Signout</span>
      </button>
    </aside>
  );
};

const NavItem = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link 
    to={to} 
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