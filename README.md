# Desafio Fullstack Veritas - Kanban Board

Este projeto implementa um Kanban Board completo, com um frontend em React e um backend em Go. Ele permite aos usuários criar, visualizar, editar e mover tarefas entre diferentes estágios (A Fazer, Em Progresso, Concluídas) de forma intuitiva.

## Funcionalidades

-   **Criação de Tarefas:** Adicione novas tarefas com título, descrição e status inicial.
-   **Visualização de Tarefas:** Veja todas as tarefas organizadas em colunas de Kanban.
-   **Edição de Tarefas:** Modifique o título, descrição e status de tarefas existentes.
-   **Exclusão de Tarefas:** Remova tarefas do quadro.
-   **Movimentação de Tarefas:** Mova tarefas entre as colunas "A Fazer", "Em Progresso" e "Concluídas" usando botões de navegação.

## Tecnologias Utilizadas

### Frontend
-   **React:** Biblioteca JavaScript para construção de interfaces de usuário.
-   **Axios:** Cliente HTTP para fazer requisições ao backend.
-   **CSS Modules / Variáveis CSS:** Para estilização e consistência visual.

### Backend
-   **Go:** Linguagem de programação para o servidor.
-   **`net/http`:** Pacote padrão do Go para criação de servidores web.
-   **`encoding/json`:** Para manipulação de JSON.
-   **`sync`:** Para garantir segurança em operações concorrentes no banco de dados em memória.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

-   `backend/`: Contém o código-fonte do servidor Go.
-   `frontend/`: Contém o código-fonte da aplicação React.

```
.
├── backend/
│   ├── go.mod
│   ├── handlers.go
│   ├── main.go
│   └── models.go
├── frontend/
│   ├── public/
│   ├── src/
│   └── ...
├── package.json
├── package-lock.json
└── README.md
```

## Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

-   **Node.js** e **npm** (para o frontend)
-   **Go** (para o backend)

### 1. Iniciar o Backend

1.  Navegue até o diretório `backend`:
    ```bash
    cd backend
    ```
2.  Execute o servidor Go:
    ```bash
    go run .
    ```
    O backend será iniciado na porta `8080`. Você verá uma mensagem no console indicando que o servidor está pronto.

### 2. Iniciar o Frontend

1.  Abra um **novo terminal** e navegue até o diretório `frontend`:
    ```bash
    cd frontend
    ```
2.  Instale as dependências do Node.js:
    ```bash
    npm install
    ```
3.  Inicie a aplicação React:
    ```bash
    npm start
    ```
    A aplicação será aberta automaticamente no seu navegador em `http://localhost:3000`.

## Uso

-   **Visualizar Tarefas:** As tarefas serão carregadas automaticamente nas colunas "A Fazer", "Em Progresso" e "Concluídas".
-   **Criar Nova Tarefa:** Clique no botão `+` no cabeçalho de cada coluna para adicionar uma nova tarefa.
-   **Editar Tarefa:** Clique no ícone `✏️` no cartão da tarefa para abrir o modal de edição.
-   **Excluir Tarefa:** Clique no ícone `🗑️` no cartão da tarefa para removê-la.
-   **Mover Tarefa:** Use os botões `◀️` e `▶️` no canto inferior esquerdo de cada cartão para mover a tarefa para a coluna adjacente. Os botões serão desabilitados nas colunas de extremidade.
