import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Nosso TaskCard agora usa o hook 'useSortable'
function TaskCard({ task, onEdit, onDelete }) {
  
  // 1. Hook do Dnd-Kit
  const {
    attributes, // Propriedades do sensor (ex: onMouseDown)
    listeners,  // Eventos (ex: onKeyDown para acessibilidade)
    setNodeRef, // A referência do DOM para o item
    transform,  // Posição (x, y) durante o arraste
    transition, // Animação
    isDragging  // Estado booleano
  } = useSortable({ id: task.id }); // O ID único da tarefa

  // 2. Estilos para o arraste
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Fica semi-transparente ao arrastar
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    // 3. Aplicamos as props do dnd-kit ao card
    <div 
      ref={setNodeRef} 
      style={style} 
      className="task-card"
    >
      <div className="task-card-header">
        
        {/* 4. O 'attributes' e 'listeners' são aplicados ao título
            para que ele seja a "alça" de arraste. */}
        <h4 
          className="task-card-title" 
          {...attributes} 
          {...listeners}
        >
          {task.title}
        </h4>
        
        {/* Os botões continuam funcionando normalmente */}
        <div className="task-card-buttons">
          <button 
            className="task-card-button" 
            onClick={() => onEdit(task)}
            title="Editar Tarefa"
          >
            ✏️
          </button>
          <button 
            className="task-card-button delete" 
            onClick={() => onDelete(task.id)}
            title="Excluir Tarefa"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}
    </div>
  );
}

export default TaskCard;