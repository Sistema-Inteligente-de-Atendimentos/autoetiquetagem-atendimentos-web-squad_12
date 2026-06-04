import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import logoImg from '../../assets/logo.png';

export default function Login() {
  const { login, register } = useAuth();
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      if (modo === 'login') {
        await login(email.trim().toLowerCase(), senha);
      } else {
        await register(nome.trim(), email.trim().toLowerCase(), senha);
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao autenticar');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#0f1117] p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={logoImg} alt="Logo" className="h-12 w-auto object-contain" />
        </div>

        <div className="bg-white dark:bg-[#1a1d2e] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center mb-1">
            {modo === 'login' ? 'Entrar' : 'Criar conta'}
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Sistema de Auto-Etiquetagem · Squad 12
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {modo === 'registro' && (
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nome</label>
                <input
                  type="text" value={nome} onChange={(e) => setNome(e.target.value)} required
                  placeholder="Seu nome"
                  className="w-full mt-1 p-2.5 bg-gray-50 dark:bg-[#232838] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">E-mail</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="voce@empresa.com"
                className="w-full mt-1 p-2.5 bg-gray-50 dark:bg-[#232838] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Senha</label>
              <input
                type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required
                placeholder="••••••"
                className="w-full mt-1 p-2.5 bg-gray-50 dark:bg-[#232838] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
            </div>

            {erro && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erro}</p>
            )}

            <button
              type="submit" disabled={carregando}
              className="w-full bg-[#cc142d] hover:bg-[#b01227] text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              {modo === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
              {carregando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-500">
            {modo === 'login' ? (
              <>Não tem conta?{' '}
                <button onClick={() => { setModo('registro'); setErro(null); }} className="text-[#cc142d] font-semibold hover:underline">
                  Criar conta
                </button>
              </>
            ) : (
              <>Já tem conta?{' '}
                <button onClick={() => { setModo('login'); setErro(null); }} className="text-[#cc142d] font-semibold hover:underline">
                  Entrar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
