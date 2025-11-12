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
      <div className="task-card-header">
        <h4 className="task-card-title">{task.title}</h4>
      </div>
      
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      <div className="task-card-actions">
        <button
            onClick={() => onMoveTask(task, 'left')}
            disabled={currentColumnIndex === 0}
            className="move-button left-arrow"
        >
            ←
        </button>
        <button onClick={() => onEdit(task)} className="edit-button">Editar</button>
        <button onClick={() => onDelete(task.id)} className="delete-button">Excluir</button>
        <button
            onClick={() => onMoveTask(task, 'right')}
            disabled={currentColumnIndex === columnNamesArray.length - 1}
            className="move-button right-arrow"
        >
            →
        </button>
      </div>
    </div>
  );
}

export default TaskCard;