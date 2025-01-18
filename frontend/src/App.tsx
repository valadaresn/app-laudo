import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import KanbanBoard from './pages/KanbanBoard';
import MaterialTest from './pages/MaterialTest';
import ExpertiseForm from './pages/ExpertiseForm';
import SimplePage from './pages/SimplePage';
//import Layout from './components/Layout';
import MobileLayout from './components/MobileLayout';
import MobileListBoard from './pages/MobileListBoard'; // Importar MobileListBoard

import CaseForm from './pages/CaseForm';
//import theme from '../styles/theme';
import { Status } from './models/Status';

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
              <Route path="/material-test" element={<MaterialTest />} />
              <Route path="/expertise" element={<ExpertiseForm />} />
              <Route path="/simple" element={<SimplePage />} />
              <Route path="/case-form/:cardId" element={<CaseFormWrapper />} />
              <Route path="/mobile-list/:activeColumn" element={<MobileListBoardWrapper />} /> {/* Ajustar rota para MobileListBoard */}
            </Routes>
          </MobileLayout>
        ) : (
          <Routes>
            <Route path="/" element={<KanbanBoard />} />
            <Route path="/material-test" element={<MaterialTest />} />
            <Route path="/expertise" element={<ExpertiseForm />} />
            <Route path="/simple" element={<SimplePage />} />
            <Route path="/case-form/:cardId" element={<CaseFormWrapper />} />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;