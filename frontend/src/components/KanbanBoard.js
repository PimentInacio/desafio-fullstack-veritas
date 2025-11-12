import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskModal from './TaskModal';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard'; // Importa o TaskCard para o DragOverlay

// 1. Imports do Dnd-Kit
import { 
  DndContext, 
  closestCorners, 
  DragOverlay
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const API_URL = 'http://localhost:8080/tasks';

// 2. IDs das Colunas (Constantes)
const COLUMN_NAMES = {
  DO_TO: 'A Fazer',
  IN_PROGRESS: 'Em Progresso',
  DONE: 'Concluídas',
};

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // 3. Estado para o Drag and Drop
  // 'activeTask' armazena a tarefa que está sendo arrastada no momento
  const [activeTask, setActiveTask] = useState(null); 

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setLoading(true);
    axios.get(API_URL)
      .then(response => {
        setTasks(response.data || []);
        setLoading(false);
      })
      .catch(err => {
        // ... (código de erro
        setError('Não foi possível carregar as tarefas. O backend está rodando?');
        setLoading(false);
        console.error("Erro ao buscar tarefas:", err);
      });
  };

  const handleSaveTask = (taskData) => {
    if (taskData.id) { // ATUALIZAÇÃO (PUT)
      axios.put(`${API_URL}/${taskData.id}`, taskData)
        .then(response => {
          setTasks(prevTasks => prevTasks.map(task =>
            task.id === taskData.id ? response.data : task
          ));
          closeModal();
        })
        .catch(err => alert("Não foi possível atualizar a tarefa."));
    } else { // CRIAÇÃO (POST)
      axios.post(API_URL, taskData)
        .then(response => {
          setTasks(prevTasks => [...prevTasks, response.data]);
          closeModal();
        })
        .catch(err => alert("Não foi possível criar a tarefa."));
    }
  };

  const handleDeleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      })
      .catch(err => alert("Não foi possível excluir a tarefa."));
  };

  // --- Funções de Controle do Modal ---
  const openCreateModal = (status) => {
    setTaskToEdit(null);
    setNewStatus(status);
    setIsModalOpen(true);
  };
  const openEditModal = (task) => {
    setTaskToEdit(task);
    setNewStatus('');
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
    setNewStatus('');
  };

  // --- Funções de Renderização ---
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };
  
  // --- LÓGICA DO DRAG AND DROP ---

  // 4. Encontra a tarefa pelo ID
  const findTaskById = (id) => tasks.find(task => task.id === id);

  // 5. Chamado quando o arraste COMEÇA
  const handleDragStart = (event) => {
    const { active } = event;
    const task = findTaskById(active.id);
    setActiveTask(task); // Armazena a tarefa ativa no state
  };

  // 6. Chamado quando o arraste TERMINA
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Se não soltou sobre uma área válida, reseta
    if (!over) {
      setActiveTask(null);
      return;
    }

    const originalTask = findTaskById(active.id);
    const newStatus = over.id; // O 'id' da coluna (ex: "A Fazer")

    // Se soltou na mesma coluna
    if (originalTask.status === newStatus) {
      // (Opcional: lógica para reordenar dentro da mesma coluna)
      // Por enquanto, apenas resetamos.
      setActiveTask(null);
      return;
    }

    // --- MUDOU DE COLUNA ---

    // 1. Atualização Otimista (na UI)
    // Atualiza o state local do React IMEDIATAMENTE para a UI ficar fluida
    setTasks(prevTasks => {
      return prevTasks.map(task => 
        task.id === originalTask.id 
          ? { ...task, status: newStatus } 
          : task
      );
    });

    // 2. Atualização Persistente (no Backend)
    // Prepara os dados para a API
    const updatedTaskData = {
      ...originalTask,
      status: newStatus,
    };
    
    // Chama a API PUT para salvar a mudança de status
    axios.put(`${API_URL}/${originalTask.id}`, updatedTaskData)
      .then(response => {
        // Sucesso! O backend confirmou.
      })
      .catch(err => {
        // Erro! Reverte a mudança otimista
        console.error("Erro ao mover tarefa:", err);
        alert("Não foi possível mover a tarefa. Revertendo.");
        setTasks(prevTasks => {
          return prevTasks.map(task => 
            task.id === originalTask.id 
              ? { ...task, status: originalTask.status } // Volta ao status original
              : task
          );
        });
      });

    // Limpa a tarefa ativa
    setActiveTask(null);
  };
  
  // --- RENDERIZAÇÃO ---
  if (loading) return <div className="loading-feedback">Carregando tarefas...</div>;
  if (error) return <div className="error-feedback">{error}</div>;

  return (
    // 7. Envolvemos tudo no DndContext
    <DndContext 
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        
        <KanbanColumn
          id={COLUMN_NAMES.DO_TO} // Passa o ID da coluna
          title={COLUMN_NAMES.DO_TO}
          tasks={getTasksByStatus(COLUMN_NAMES.DO_TO)}
          onAddTask={() => openCreateModal(COLUMN_NAMES.DO_TO)}
          onEditTask={openEditModal}
          onDeleteTask={handleDeleteTask}
        />
        
        <KanbanColumn
          id={COLUMN_NAMES.IN_PROGRESS} // Passa o ID da coluna
          title={COLUMN_NAMES.IN_PROGRESS}
          tasks={getTasksByStatus(COLUMN_NAMES.IN_PROGRESS)}
          onAddTask={() => openCreateModal(COLUMN_NAMES.IN_PROGRESS)}
          onEditTask={openEditModal}
          onDeleteTask={handleDeleteTask}
        />
        
        <KanbanColumn
          id={COLUMN_NAMES.DONE} // Passa o ID da coluna
          title={COLUMN_NAMES.DONE}
          tasks={getTasksByStatus(COLUMN_NAMES.DONE)}
          onAddTask={() => openCreateModal(COLUMN_NAMES.DONE)}
          onEditTask={openEditModal}
          onDeleteTask={handleDeleteTask}
        />

        <TaskModal
          show={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
          status={newStatus}
        />
        
        {/* 8. DragOverlay (Opcional, mas profissional)
           Renderiza o 'card flutuante' enquanto arrastamos */}
        <DragOverlay>
          {activeTask ? (
            <TaskCard 
              task={activeTask} 
              onEdit={() => {}} 
              onDelete={() => {}} 
            />
          ) : null}
        </DragOverlay>

      </div>
    </DndContext>
  );
}

export default KanbanBoard;