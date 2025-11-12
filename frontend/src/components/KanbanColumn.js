import React from 'react';
import TaskCard from './TaskCard';

// Recebe um 'id' (o nome da coluna)
function KanbanColumn({ 
  id,
  title, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  onMoveTask // Nova prop
}) {
  
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
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMoveTask={onMoveTask} // Passa a nova prop
              currentColumnStatus={id} // Passa o status da coluna atual
            />
          ))}
      </div>
    </div>
  );
}

export default KanbanColumn;