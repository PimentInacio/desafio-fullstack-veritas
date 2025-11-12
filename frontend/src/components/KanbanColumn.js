import React from 'react';
import TaskCard from './TaskCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// Recebe um 'id' (o nome da coluna)
function KanbanColumn({ 
  id,
  title, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask 
}) {
  
  // 1. Cria um array apenas com os IDs das tarefas [1, 2, 3]
  // O SortableContext precisa disso.
  const taskIds = tasks.map(task => task.id);

  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <h3>{title}</h3>
        <button 
          className="add-task-button" 
          onClick={onAddTask}
          title="Nova Tarefa"
        >
          +
        </button>
      </div>
      
      <div className="kanban-column-body">
        {/* 2. Envolvemos a lista de cards no 'SortableContext' */}
        <SortableContext 
          items={taskIds} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default KanbanColumn;