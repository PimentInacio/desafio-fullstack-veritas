import React from 'react';
import TaskCard from './TaskCard';

// Recebe todas as props necessárias do KanbanBoard
function KanbanColumn({ 
  title, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask 
}) {
  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <h3>{title}</h3>
        {/* Botão '+' chama a função que o pai (KanbanBoard) passou */}
        <button 
          className="add-task-button" 
          onClick={onAddTask}
          title="Nova Tarefa" // Adiciona o tooltip
        >
          +
        </button>
      </div>
      
      {/* Corpo da Coluna: Mapeia as tarefas para TaskCards */}
      <div className="kanban-column-body">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}     // Passa a função de editar para o card
            onDelete={onDeleteTask} // Passa a função de deletar para o card
          />
        ))}
      </div>
    </div>
  );
}

export default KanbanColumn;