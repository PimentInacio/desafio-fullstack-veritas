import React from 'react';

// Na Fase 3, este nome virá do contexto de autenticação.
const userName = "Inácio Pimenta"; 

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">Tarefas de {userName}</h1>
        
        <div className="header-actions">
          <button className="header-button" title="Personalizar Background">
             Personalizar
          </button>
          
          <div className="user-profile-placeholder" title="Perfil e Sair">
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;