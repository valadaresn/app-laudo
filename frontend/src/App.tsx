import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KanbanBoard from './pages/KanbanBoard';
import MaterialTest from './pages/MaterialTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KanbanBoard />} />
        <Route path="/material-test" element={<MaterialTest />} />
      </Routes>
    </Router>
  );
}

export default App;