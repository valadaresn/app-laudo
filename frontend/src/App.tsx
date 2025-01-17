import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import KanbanBoard from './pages/KanbanBoard';
import MaterialTest from './pages/MaterialTest';
import ExpertiseForm from './pages/ExpertiseForm';
import SimplePage from './pages/SimplePage';
import Layout from './components/Layout';
import theme from './theme';
import CaseForm from './pages/CaseForm';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        {/* <Layout> */}
          <Routes>
            <Route path="/" element={<KanbanBoard />} />
            <Route path="/material-test" element={<MaterialTest />} />
            <Route path="/expertise" element={<ExpertiseForm />} />
            <Route path="/simple" element={<SimplePage />} />
            <Route path="/case-form/:cardId" element={<CaseForm/>} /> {/* Nova rota para CaseForm */}
          </Routes>
        {/* </Layout> */}
      </Router>
    </ThemeProvider>
  );
}

export default App;