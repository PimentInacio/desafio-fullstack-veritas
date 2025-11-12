package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
)

// writeJSON é uma função auxiliar para escrever respostas JSON padronizadas.
func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		log.Printf("Erro ao escrever JSON: %v", err)
	}
}

// handleTasks é o nosso roteador principal para a rota /tasks/
// Ele decide qual função de lógica chamar com base no Método (GET, POST)
// ou na presença de um ID na URL (PUT, DELETE).
func handleTasks(w http.ResponseWriter, r *http.Request) {
	// O roteador padrão do Go não remove o prefixo da rota. Fazemos isso manualmente.
	// Para uma requisição a "/tasks/1", o resultado de path será "1".
	// Para uma requisição a "/tasks/", o resultado de path será "".
	path := strings.TrimPrefix(r.URL.Path, "/tasks/")

	// Caso 1: A requisição é para a coleção de tarefas (path resultante é vazio)
	if path == "" {
		switch r.Method {
		case http.MethodGet:
			getTasksHandler(w, r)
		case http.MethodPost:
			createTaskHandler(w, r)
		default:
			http.Error(w, "Método não permitido para /tasks/", http.StatusMethodNotAllowed)
		}
		return
	}

	// Caso 2: A requisição é para um item específico (path resultante é o ID)
	id, err := strconv.Atoi(path)
	if err != nil {
		http.Error(w, "ID inválido na URL. Esperado /tasks/{id}", http.StatusBadRequest)
		return
	}

	// A rota é /tasks/{id}, então usamos os métodos correspondentes
	switch r.Method {
	case http.MethodPut:
		updateTaskHandler(w, r, id)
	case http.MethodDelete:
		deleteTaskHandler(w, r, id)
	default:
		http.Error(w, "Método não permitido para /tasks/{id}", http.StatusMethodNotAllowed)
	}
}

// getTasksHandler lida com GET /tasks
func getTasksHandler(w http.ResponseWriter, r *http.Request) {
	tasks := GetAllTasks()
	writeJSON(w, http.StatusOK, tasks)
}

// createTaskHandler lida com POST /tasks
func createTaskHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Status      string `json:"status"`
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erro ao ler o corpo da requisição", http.StatusInternalServerError)
		return
	}

	if err := json.Unmarshal(body, &input); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	// --- Validação Obrigatória  ---
	if input.Title == "" {
		http.Error(w, "O título é obrigatório", http.StatusBadRequest)
		return
	}
	// Validação de status (baseada nas 3 colunas fixas)
	if input.Status != "A Fazer" && input.Status != "Em Progresso" && input.Status != "Concluídas" {
		http.Error(w, "Status inválido. Deve ser 'A Fazer', 'Em Progresso' ou 'Concluídas'", http.StatusBadRequest)
		return
	}
	// --- Fim da Validação ---

	task := CreateTask(input.Title, input.Description, input.Status)
	writeJSON(w, http.StatusCreated, task)
}

// updateTaskHandler lida com PUT /tasks/{id}
func updateTaskHandler(w http.ResponseWriter, r *http.Request, id int) {
	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Status      string `json:"status"`
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Erro ao ler o corpo da requisição", http.StatusInternalServerError)
		return
	}

	if err := json.Unmarshal(body, &input); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	// --- Validação Obrigatória  ---
	if input.Title == "" {
		http.Error(w, "O título é obrigatório", http.StatusBadRequest)
		return
	}
	if input.Status != "A Fazer" && input.Status != "Em Progresso" && input.Status != "Concluídas" {
		http.Error(w, "Status inválido.", http.StatusBadRequest)
		return
	}
	// --- Fim da Validação ---

	task, err := UpdateTask(id, input.Title, input.Description, input.Status)
	if err != nil {
		// Checa se o erro é "tarefa não encontrada" do models.go
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, http.StatusOK, task)
}

// deleteTaskHandler lida com DELETE /tasks/{id}
func deleteTaskHandler(w http.ResponseWriter, r *http.Request, id int) {
	err := DeleteTask(id)
	if err != nil {
		// Checa se o erro é "tarefa não encontrada" do models.go
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// 204 No Content é a resposta padrão para um DELETE bem-sucedido
	w.WriteHeader(http.StatusNoContent)
}