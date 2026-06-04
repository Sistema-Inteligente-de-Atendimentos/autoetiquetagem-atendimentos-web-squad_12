// src/App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import logoImg from './assets/logo.png';
import Dashboard from './views/Dashboard';
import Atendimentos from './views/Atendimentos';
import AtendimentoDetalhe from './views/Atendimentos/Detalhe';
import EntradaDados from './views/Entrada';
import Configuracoes from './views/Configuracoes';
import Login from './views/Login';
import { AuthProvider, useAuth } from './hooks/useAuth';

function AppShell() {
  const { usuario, carregando } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#0f1117]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!usuario) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <Sidebar aberta={menuAberto} onClose={() => setMenuAberto(false)} />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-10 flex items-center gap-3 bg-[#1e1a17] px-4 py-3">
          <button onClick={() => setMenuAberto(true)} className="p-1 text-gray-300 hover:text-white" aria-label="Abrir menu">
            <Menu size={24} />
          </button>
          <img src={logoImg} alt="Logo" className="h-7 w-auto object-contain" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/atendimentos" element={<Atendimentos />} />
            <Route path="/atendimentos/:protocoloId" element={<AtendimentoDetalhe />} />
            <Route path="/entrada" element={<EntradaDados />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
