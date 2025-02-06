import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import KanbanBoard from './pages/KanbanBoard';
import MobileLayout from './components/MobileLayout';
import MobileListBoard from './pages/MobileListBoard';
import { Status } from './models/Status';
import DesktopLayout from './components/layout/desktop/DesktopLayout';
import themes from './styles/theme';
import AuthProvider from './components/auth/AuthProvider';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Register from './components/auth/Register';

function MobileListBoardWrapper() {
  const { activeColumn } = useParams<{ activeColumn: string }>();
  return <MobileListBoard activeColumn={activeColumn as Status} />;
}

function App() {
  const theme = themes.purple;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          {isMobile ? (
            <MobileLayout>
              <Routes>
                <Route path="/" element={<KanbanBoard />} />
                <Route path="/mobile-list/:activeColumn" element={<MobileListBoardWrapper />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </MobileLayout>
          ) : (
            <DesktopLayout>
              <Routes>
                <Route path="/" element={<KanbanBoard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </DesktopLayout>
          )}
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;