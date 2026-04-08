// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import Dashboard from './views/Dashboard';
import Atendimentos from './views/Atendimentos';
import Revisao from './views/Revisao';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#f8f9fa]">
        {/* Sidebar fixa na esquerda */}
        <Sidebar />

        {/* Área de conteúdo que muda conforme a rota */}
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/atendimentos" element={<Atendimentos />} />
            <Route path="/revisao" element={<Revisao />} />
            <Route path="/entrada" element={<div className="text-2xl font-bold">Tela de Entrada (Em breve)</div>} />
            
            {/* Redireciona qualquer rota inexistente para o Dashboard */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;