package main

import (
	"errors"
	"sync"
)

// Task representa a estrutura de um cartão (post-it) no Kanban.
type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"` // Ex: "A Fazer", "Em Progresso", "Concluídas"
}

// --- Banco de Dados em Memória ---
// Usamos sync.RWMutex para lidar com concorrência (várias requisições ao mesmo tempo)
// de forma segura, evitando que o slice seja modificado por duas funções ao mesmo tempo.
var (
	tasks   = make(map[int]Task) // Usar um map é mais eficiente para buscar/deletar por ID
	nextID  = 1
	tasksMu sync.RWMutex
)

// --- Funções CRUD (Create, Read, Update, Delete) ---

// GetAllTasks retorna uma lista de todas as tarefas.
func GetAllTasks() []Task {
	tasksMu.RLock() // Bloqueia para Leitura (Read Lock)
	defer tasksMu.RUnlock()

	result := make([]Task, 0, len(tasks))
	for _, task := range tasks {
		result = append(result, task)
	}
	return result
}

// CreateTask adiciona uma nova tarefa ao nosso map.
func CreateTask(title, description, status string) Task {
	tasksMu.Lock() // Bloqueia para Escrita (Write Lock)
	defer tasksMu.Unlock()

	task := Task{
		ID:          nextID,
		Title:       title,
		Description: description,
		Status:      status,
	}
	tasks[task.ID] = task
	nextID++
	return task
}

// UpdateTask atualiza uma tarefa existente (para editar ou mover).
func UpdateTask(id int, title, description, status string) (Task, error) {
	tasksMu.Lock()
	defer tasksMu.Unlock()

	task, exists := tasks[id]
	if !exists {
		return Task{}, errors.New("tarefa não encontrada")
	}

	// Atualiza os campos
	task.Title = title
	task.Description = description
	task.Status = status
	tasks[id] = task // Salva a tarefa atualizada de volta no map

	return task, nil
}

// DeleteTask remove uma tarefa do map.
func DeleteTask(id int) error {
	tasksMu.Lock()
	defer tasksMu.Unlock()

	_, exists := tasks[id]
	if !exists {
		return errors.New("tarefa não encontrada")
	}

	delete(tasks, id)
	return nil
}