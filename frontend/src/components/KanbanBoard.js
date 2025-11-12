import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskModal from './TaskModal';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard'; // Importa o TaskCard para o DragOverlay

const API_URL = 'http://localhost:8080/tasks/';

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
      axios.put(`${API_URL}${taskData.id}`, taskData)
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
    axios.delete(`${API_URL}${id}`)
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
  
  // --- LÓGICA DE MOVIMENTAÇÃO DE CARTÕES ---
  const handleMoveTask = (task, direction) => {
    const columnNamesArray = Object.values(COLUMN_NAMES); // ["A Fazer", "Em Progresso", "Concluídas"]
    const currentStatusIndex = columnNamesArray.indexOf(task.status);
    let newStatusIndex = currentStatusIndex;

    if (direction === 'left' && currentStatusIndex > 0) {
        newStatusIndex = currentStatusIndex - 1;
    } else if (direction === 'right' && currentStatusIndex < columnNamesArray.length - 1) {
        newStatusIndex = currentStatusIndex + 1;
    } else {
        // Não pode mover mais nesta direção
        return;
    }

    const newStatus = columnNamesArray[newStatusIndex];

    // Atualização Otimista (na UI)
    setTasks(prevTasks => {
        return prevTasks.map(t =>
            t.id === task.id ? { ...t, status: newStatus } : t
        );
    });

    // Atualização Persistente (no Backend)
    const updatedTaskData = { ...task, status: newStatus };
    axios.put(`${API_URL}${task.id}`, updatedTaskData)
        .then(response => {
            // Sucesso, nada a fazer pois a atualização otimista já ocorreu
        })
        .catch(err => {
            console.error("Erro ao mover tarefa:", err);
            alert("Não foi possível mover a tarefa. Revertendo.");
            // Reverte a atualização otimista
            setTasks(prevTasks => {
                return prevTasks.map(t =>
                    t.id === task.id ? { ...t, status: task.status } : t
                );
            });
        });
  };
  
  // --- RENDERIZAÇÃO ---
  if (loading) return <div className="loading-feedback">Carregando tarefas...</div>;
  if (error) return <div className="error-feedback">{error}</div>;

  return (
    <div className="kanban-board">
        
        <KanbanColumn
          id={COLUMN_NAMES.DO_TO} // Passa o ID da coluna
          title={COLUMN_NAMES.DO_TO}
          tasks={getTasksByStatus(COLUMN_NAMES.DO_TO)}
          onAddTask={() => openCreateModal(COLUMN_NAMES.DO_TO)}
          onEditTask={openEditModal}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
        />
        
        <KanbanColumn
          id={COLUMN_NAMES.IN_PROGRESS} // Passa o ID da coluna
          title={COLUMN_NAMES.IN_PROGRESS}
          tasks={getTasksByStatus(COLUMN_NAMES.IN_PROGRESS)}
          onAddTask={() => openCreateModal(COLUMN_NAMES.IN_PROGRESS)}
          onEditTask={openEditModal}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
        />
        
        <KanbanColumn
          id={COLUMN_NAMES.DONE} // Passa o ID da coluna
          title={COLUMN_NAMES.DONE}
          tasks={getTasksByStatus(COLUMN_NAMES.DONE)}
          onAddTask={() => openCreateModal(COLUMN_NAMES.DONE)}
          onEditTask={openEditModal}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
        />

        <TaskModal
          show={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
          status={newStatus}
        />
      </div>
  );
}

export default KanbanBoard;