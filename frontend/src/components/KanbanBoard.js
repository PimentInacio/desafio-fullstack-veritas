import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskModal from './TaskModal';
import KanbanColumn from './KanbanColumn'; // 1. Importa o novo componente

const API_URL = 'http://localhost:8080/tasks';

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // --- Funções de API (CRUD) ---
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
        setError('Não foi possível carregar as tarefas. O backend está rodando?');
        setLoading(false);
        console.error("Erro ao buscar tarefas:", err);
      });
  };

  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      // ATUALIZAÇÃO (PUT)
      axios.put(`${API_URL}/${taskData.id}`, taskData)
        .then(response => {
          setTasks(prevTasks => prevTasks.map(task =>
            task.id === taskData.id ? response.data : task
          ));
          closeModal();
        })
        .catch(err => {
          console.error("Erro ao atualizar tarefa:", err);
          alert("Não foi possível atualizar a tarefa.");
        });
    } else {
      // CRIAÇÃO (POST)
      axios.post(API_URL, taskData)
        .then(response => {
          setTasks(prevTasks => [...prevTasks, response.data]);
          closeModal();
        })
        .catch(err => {
          console.error("Erro ao criar tarefa:", err);
          alert("Não foi possível criar a tarefa.");
        });
    }
  };

  // 2. NOVA FUNÇÃO DE EXCLUSÃO (DELETE)
  const handleDeleteTask = (id) => {
    // Pede confirmação antes de excluir
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      axios.delete(`${API_URL}/${id}`)
        .then(() => {
          // Remove a tarefa da lista local (state)
          setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        })
        .catch(err => {
          console.error("Erro ao excluir tarefa:", err);
          alert("Não foi possível excluir a tarefa.");
        });
    }
  };

  // --- Funções de Controle do Modal ---
  const openCreateModal = (status) => {
    setTaskToEdit(null);
    setNewStatus(status);
    setIsModalOpen(true);
  };

  // Esta função agora será chamada pelo TaskCard
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

  // --- Funções de Feedback Visual ---
  if (loading) return <div className="loading-feedback">Carregando tarefas...</div>;
  if (error) return <div className="error-feedback">{error}</div>;

  // --- Funções de Renderização ---
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // 3. RENDERIZAÇÃO REFATORADA (MUITO MAIS LIMPA!)
  return (
    <div className="kanban-board">
      
      <KanbanColumn
        title="A Fazer"
        tasks={getTasksByStatus('A Fazer')}
        onAddTask={() => openCreateModal('A Fazer')}
        onEditTask={openEditModal}      // Passa a função de editar
        onDeleteTask={handleDeleteTask} // Passa a função de deletar
      />
      
      <KanbanColumn
        title="Em Progresso"
        tasks={getTasksByStatus('Em Progresso')}
        onAddTask={() => openCreateModal('Em Progresso')}
        onEditTask={openEditModal}
        onDeleteTask={handleDeleteTask}
      />
      
      <KanbanColumn
        title="Concluídas"
        tasks={getTasksByStatus('Concluídas')}
        onAddTask={() => openCreateModal('Concluídas')}
        onEditTask={openEditModal}
        onDeleteTask={handleDeleteTask}
      />

      {/* O Modal continua o mesmo */}
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