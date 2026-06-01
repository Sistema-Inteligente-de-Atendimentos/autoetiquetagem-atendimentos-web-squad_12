import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'tema';

function getTemaInicial(): Theme {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo === 'dark' || salvo === 'light') return salvo;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function aplicarTema(tema: Theme) {
  const root = document.documentElement;
  if (tema === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function useTheme() {
  const [tema, setTema] = useState<Theme>(getTemaInicial);

  useEffect(() => {
    aplicarTema(tema);
    localStorage.setItem(STORAGE_KEY, tema);
  }, [tema]);

  function alternarTema() {
    setTema((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  return { tema, setTema, alternarTema };
}

export function inicializarTema() {
  aplicarTema(getTemaInicial());
}
