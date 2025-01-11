import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KanbanBoard from './pages/KanbanBoard';
import MaterialTest from './pages/MaterialTest';
import ExpertiseForm from './pages/ExpertiseForm';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<KanbanBoard />} />
          <Route path="/material-test" element={<MaterialTest />} />
          <Route path="/expertise" element={<ExpertiseForm />} />
        </Routes>
      
    </Router>
  );
}

export default App;