import React, { useState, useEffect } from 'react';

// Recebemos 'props' (propriedades) do componente pai (o KanbanBoard)
// show: booleano que diz se o modal deve estar visível
// onClose: função para fechar o modal (ao clicar em Cancelar ou no 'X')
// onSave: função para salvar a tarefa (ao clicar em Salvar)
// taskToEdit: (opcional) um objeto de tarefa. Se ele existir, estamos no modo "Editar".
// status: (obrigatório ao criar) o status da nova tarefa (ex: "A Fazer")
function TaskModal({ show, onClose, onSave, taskToEdit, status }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // useEffect é um "hook" que roda quando os props mudam.
  // Usamos isso para pré-preencher o formulário se estivermos editando uma tarefa.
  useEffect(() => {
    if (taskToEdit) {
      // Modo Edição: preenche o formulário com dados da tarefa
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
    } else {
      // Modo Criação: limpa o formulário
      setTitle('');
      setDescription('');
    }
  }, [taskToEdit, show]); // Roda sempre que taskToEdit ou show mudarem

  // Função chamada ao clicar no botão "Salvar"
  const handleSave = () => {
    // Validação básica (exigida pelo PDF)
    if (!title) {
      alert('O título é obrigatório.');
      return;
    }

    // Prepara os dados da tarefa para enviar ao componente pai
    const taskData = {
      title,
      description,
      status: taskToEdit ? taskToEdit.status : status, // Mantém status se editando, ou usa o novo status se criando
    };
    
    // Se for edição, também precisamos passar o ID
    if (taskToEdit) {
      taskData.id = taskToEdit.id;
    }

    onSave(taskData);
  };

  // Se 'show' for falso, o componente não renderiza nada (retorna null)
  if (!show) {
    return null;
  }

  // Se 'show' for verdadeiro, renderiza o modal
  return (
    // O 'overlay' é o fundo escuro semi-transparente
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Cabeçalho do Modal */}
        <div className="modal-header">
          <h3 className="modal-title">
            {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h3>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        
        {/* Corpo do Modal (Formulário) */}
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="title">Título (obrigatório)</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição (opcional)</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Rodapé do Modal (Botões) */}
        <div className="modal-footer">
          <button className="modal-button-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="modal-button-save" onClick={handleSave}>
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
}

export default TaskModal;