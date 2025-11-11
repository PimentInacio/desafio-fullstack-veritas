import React from 'react';

// Por enquanto, o nome está estático.
// Na Fase 3 (Autenticação), vamos receber o nome do usuário dinamicamente.
const userName = "Inácio Pimenta"; 

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        {/* Este é o título dinâmico que você pediu */}
        <h1 className="header-title">Tarefas de {userName}</h1>
        
        <div className="header-actions">
          {/* Este é o botão de personalização que você pediu */}
          <button className="header-button" title="Personalizar Background">
            🎨 Personalizar
          </button>
          
          {/* Na Fase 3, este será um ícone de perfil com menu dropdown */}
          <div className="user-profile-placeholder" title="Perfil e Sair">
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;