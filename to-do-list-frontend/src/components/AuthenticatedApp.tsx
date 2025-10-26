import React from 'react';
import { Container } from '@mui/material';
import { useAuthInterceptor } from '../hooks/useAuthInterceptor';
import TodoList from './TodoList';

interface AuthenticatedAppProps {
  onLogout: () => void;
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({ onLogout }) => {
  useAuthInterceptor();

  return (
    <Container>
      <TodoList onLogout={onLogout} />
    </Container>
  );
};

export default AuthenticatedApp;
