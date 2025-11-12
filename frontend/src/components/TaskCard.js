import React from 'react';

function TaskCard({ task, onEdit, onDelete, onMoveTask, currentColumnStatus }) {
  const COLUMN_NAMES = {
    DO_TO: 'A Fazer',
    IN_PROGRESS: 'Em Progresso',
    DONE: 'Concluídas',
  };
  const columnNamesArray = Object.values(COLUMN_NAMES);
  const currentColumnIndex = columnNamesArray.indexOf(currentColumnStatus);

  return (
    <div className="task-card">
      <h4 className="task-card-title">{task.title}</h4>
      
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      <div className="task-card-actions-container">
        <button
            onClick={() => onMoveTask(task, 'left')}
            disabled={currentColumnIndex === 0}
            className="task-action-button move-left"
            title="Mover para a esquerda"
        >
            ◀️
        </button>
        <button
            onClick={() => onMoveTask(task, 'right')}
            disabled={currentColumnIndex === columnNamesArray.length - 1}
            className="task-action-button move-right"
            title="Mover para a direita"
        >
            ▶️
        </button>
        <button onClick={() => onEdit(task)} className="task-action-button edit" title="Editar Tarefa">
          ✏️
        </button>
        <button onClick={() => onDelete(task.id)} className="task-action-button delete" title="Excluir Tarefa">
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TaskCard;