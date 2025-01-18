import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import KanbanBoard from './pages/KanbanBoard';
import MaterialTest from './pages/MaterialTest';
import ExpertiseForm from './pages/ExpertiseForm';
import Layout from './components/Layout';
import theme from './styles/theme';

function App() {
  return (
     <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>y
            <Route path="/" element={<KanbanBoard />} />
            <Route path="/material-test" element={<MaterialTest />} />
            <Route path="/expertise" element={<ExpertiseForm />} />
          </Routes>
        </Layout>
      </Router>
     </ThemeProvider>
  );
}

export default App;