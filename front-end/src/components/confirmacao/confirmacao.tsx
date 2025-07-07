import "./confirmacao.css";

interface ConfirmacaoDialogProps {
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

function ConfirmacaoDialog({ mensagem, onConfirmar, onCancelar }: ConfirmacaoDialogProps) {
  return (
    <div className="modal-fundo" onClick={onCancelar} role="dialog" aria-modal="true">
      <div className="confirmacao-conteudo" onClick={(e) => e.stopPropagation()}>
        <p>{mensagem}</p>
        <div className="botoes-confirmacao">
          <button className="btn-nao" onClick={onCancelar}>Não</button>
          <button className="btn-sim" onClick={onConfirmar}>Sim</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmacaoDialog;
