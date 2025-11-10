import React from 'react';

// Recebe a tarefa específica (task) e as funções a serem chamadas (onEdit, onDelete)
function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4 className="task-card-title">{task.title}</h4>
        
        {/* Botões de Ação */}
        <div className="task-card-buttons">
          <button 
            className="task-card-button" 
            onClick={() => onEdit(task)} // Dispara a edição
            title="Editar Tarefa" // Adiciona o tooltip
          >
            ✏️
          </button>
          <button 
            className="task-card-button delete" 
            onClick={() => onDelete(task.id)} // Dispara a exclusão
            title="Excluir Tarefa" // Adiciona o tooltip
          >
            ️
          </button>
        </div>
      </div>
      
      {/* Exibe a descrição se ela existir */}
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}
    </div>
  );
}

export default TaskCard;