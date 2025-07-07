import { useState, type FormEvent } from "react";
import "./formulario-plano.css";
import type { Plano } from "../../types/plano";
import { criarPlano } from "../../services/planos/criarPlanos";
import { editarPlano } from "../../services/planos/editarPlano";

interface FormularioPlano {
  plano?: Plano;
  onSuccess: () => void;
}

function FormularioPlano({ plano, onSuccess }: FormularioPlano) {
  const [nome, setNome] = useState(plano?.nome ?? "");
  const [descricao, setDescricao] = useState(plano?.descricao ?? "");
  const [preco, setPreco] = useState(
    plano?.preco
      ? Number(plano.preco).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : ""
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const precoNumerico = Number(preco.replace(/\D/g, "")) / 100;

    const novoPlano: Plano = {
      id: plano?.id ?? 1,
      nome,
      descricao,
      preco: precoNumerico,
    };

    if (plano) {
      await editarPlano(novoPlano);
    } else {
      await criarPlano(novoPlano);
    }

    onSuccess();
  }

  function handleCancelar() {
    setNome("");
    setDescricao("");
    setPreco("");
    onSuccess();
  }

  function formatarPreco(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = e.target.value.replace(/\D/g, "");
    const numero = (Number(valor) / 100).toFixed(2);
    const formatado = Number(numero).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setPreco(formatado);
  }

  return (
    <form className="formulario-plano" onSubmit={handleSubmit}>
      <h2>{plano ? "Editar Plano" : "Adicionar Novo Plano"}</h2>
      <p className="subtitulo">
        Preencha os dados abaixo para {plano ? "editar" : "adicionar"} um plano
        ao sistema.
      </p>

      <div className="campos-duas-colunas com-espaco-entre">
        <label>
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>

        <label>
          Descrição:
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </label>

        <label>
          Preço:
          <input
            type="text"
            value={preco}
            onChange={formatarPreco}
            required
          />
        </label>
      </div>

      <div className="botoes-formulario">
        <button type="button" onClick={handleCancelar} className="btn-cancelar">
          Cancelar
        </button>
        <button type="submit" className="btn-cadastrar">
          {plano ? "Salvar Alterações" : "Cadastrar Plano"}
        </button>
      </div>
    </form>
  );
}

export default FormularioPlano;
