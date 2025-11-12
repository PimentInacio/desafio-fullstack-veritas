import React from 'react';

// Na Fase 3, este nome virá do contexto de autenticação.
const userName = "Inácio Pimenta"; 

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">Lista de Tarefas</h1>
      </div>
    </header>
  );
}

export default Header;