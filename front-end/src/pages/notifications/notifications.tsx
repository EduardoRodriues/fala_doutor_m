import { useCallback, useEffect, useState, type JSX } from "react";
import "./notifications.css";
import { listarConsultas } from "../../services/consultas/apiConsultas";
import type { Consulta } from "../../types/consultas/consulta";
import { filtrarConsultasHoje } from "../utils/notificacaoUtils";

function Notificacoes(): JSX.Element {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [consultasHoje, setConsultasHoje] = useState<Consulta[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [, setTotalPaginas] = useState(1);
  const [limit] = useState(10);

  const fetchConsultas = useCallback(
    async (paginaAtual = 1, limitAtual = limit) => {
      const resposta = await listarConsultas(paginaAtual, limitAtual);
      setConsultas(resposta.data);
      setPaginaAtual(resposta.paginaAtual);
      setTotalPaginas(resposta.totalPaginas);
    },
    [limit]
  );

  useEffect(() => {
    fetchConsultas(paginaAtual, limit);
  }, [paginaAtual, limit, fetchConsultas]);

  useEffect(() => {
    setConsultasHoje(filtrarConsultasHoje(consultas));
  }, [consultas]);

  return (
    <div className="divNoti">
      <h2 className="h2Noti">Consultas de Hoje</h2>
      <ul className="ulNoti">
        {consultasHoje.map((c) => (
          <li className="liNoti" key={c.id}>
            O {c.pacienteNome} tem uma consulta marcada com o {c.medicoNome} hoje!
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notificacoes;
