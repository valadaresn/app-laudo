import React, { useState } from 'react';
import { TextField, Button, Typography, Link as MuiLink } from '@mui/material';
import { useAuth } from './authContext';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await login(email, password);
      navigate('/'); // Redireciona para a página inicial após login bem-sucedido
    } catch  {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Não tem uma conta? <MuiLink component={Link} to="/register">Registre-se</MuiLink>
      </Typography>
    </div>
  );
};

export default Login;