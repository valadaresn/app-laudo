import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import KanbanBoard from './pages/KanbanBoard';
//import ExpertiseForm from './pages/ExpertiseForm';
//import Layout from './components/Layout';
import MobileLayout from './components/MobileLayout';
import MobileListBoard from './pages/MobileListBoard'; // Importar MobileListBoard

import CaseForm from './pages/CaseForm';
//import theme from '../styles/theme';
import { Status } from './models/Status';
import ExpertiseForm from './pages/ExpertiseForm';
import Layout from './components/Layout';

function CaseFormWrapper() {
  const { cardId } = useParams<{ cardId: string }>();
  return <CaseForm cardId={cardId ?? null} />;
}

function MobileListBoardWrapper() {
  const { activeColumn } = useParams<{ activeColumn: string }>();
  return <MobileListBoard activeColumn={activeColumn as Status} />;
}

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {isMobile ? (
          <MobileLayout>
            <Routes>
              <Route path="/" element={<KanbanBoard />} />              
              <Route path="/expertise" element={<ExpertiseForm />} />             
              <Route path="/case-form/:cardId" element={<CaseFormWrapper />} />
              <Route path="/mobile-list/:activeColumn" element={<MobileListBoardWrapper />} /> {/* Ajustar rota para MobileListBoard */}
            </Routes>
          </MobileLayout>
        ) : (
          <Layout>
          <Routes>
            <Route path="/" element={<KanbanBoard />} />            
            <Route path="/expertise" element={<ExpertiseForm />} />           
            <Route path="/case-form/:cardId" element={<CaseFormWrapper />} />
          </Routes>
          </Layout>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;