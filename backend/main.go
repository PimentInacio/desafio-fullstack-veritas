package main

import (
	"log"
	"net/http"
)

// corsMiddleware envolve um http.Handler e adiciona os cabeçalhos CORS obrigatórios.
// Isso permite que o seu frontend (React) faça requisições para este backend.
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Define quais origens são permitidas. "*" é para desenvolvimento.
		// Em produção, você colocaria o domínio do seu Vercel (ex: "meu-kanban.vercel.app")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Define quais métodos HTTP são permitidos
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// Define quais cabeçalhos podem ser enviados pelo frontend
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Se a requisição for um 'OPTIONS' (pre-flight request), apenas retorne OK.
		// Isso é uma verificação que o navegador faz antes de enviar o PUT ou DELETE.
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Chama o próximo handler (no nosso caso, o 'handleTasks')
		next.ServeHTTP(w, r)
	})
}

func main() {
	// 1. Cria um novo roteador (ServeMux)
	mux := http.NewServeMux()

	// 2. Registra o nosso handler principal
	taskHandler := http.HandlerFunc(handleTasks)
	mux.Handle("/tasks", taskHandler)
	mux.Handle("/tasks/", taskHandler)

	// 3. Envolve o roteador com o middleware CORS
	handler := corsMiddleware(mux)

	// 4. Imprime uma mensagem de log informando que o servidor está pronto
	log.Println("Iniciando servidor backend na porta :8080...")
	log.Println("Endpoints disponíveis: /tasks e /tasks/{id}")

	// 5. Inicia o servidor na porta 8080 com o handler CORS
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatalf("Erro fatal ao iniciar o servidor: %v", err)
	}
}