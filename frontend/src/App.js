import React from 'react';
import KanbanBoard from './components/KanbanBoard';
import Header from './components/Header'; // Importa o Header
import Footer from './components/Footer'; // Importa o Footer
import './index.css';

function App() {
  return (
    // 'app-layout' vai organizar o Header, Main e Footer
    <div className="app-layout">
      <Header />
      
      {/* 'app-main' é o contêiner do seu background de paisagem */}
      <main className="app-main">
        <KanbanBoard />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;