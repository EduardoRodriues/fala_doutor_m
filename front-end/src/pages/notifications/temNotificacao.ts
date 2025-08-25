import { useState } from "react";

let valor = false;
let listeners: ((v: boolean) => void)[] = [];

export const setTemNotificacoes = (v: boolean) => {
  valor = v;
  listeners.forEach((l) => l(valor));
};

export const useTemNotificacoes = () => {
  const [notificacoes, setNotificacoes] = useState(valor);

  useState(() => {
    const listener = (v: boolean) => setNotificacoes(v);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  });

  return [notificacoes, setTemNotificacoes] as const;
};
