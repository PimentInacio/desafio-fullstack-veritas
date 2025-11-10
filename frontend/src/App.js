import React from 'react';
import KanbanBoard from './components/KanbanBoard';
import './index.css'; // Importando nossos estilos mínimos

function App() {
  return (
    <div className="app">
      <KanbanBoard />
    </div>
  );
}

export default App;