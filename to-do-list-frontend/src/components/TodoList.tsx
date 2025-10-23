import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Paper,
  Collapse,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MyToast from './MyToast';
import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from '../services/api';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [toastSeverity, setToastSeverity] = useState<
    'error' | 'warning' | 'info' | 'success'
  >('error');

  const showToast = (
    message: string,
    severity: 'error' | 'warning' | 'info' | 'success' = 'error'
  ) => {
    setErrorMessage(message);
    setToastSeverity(severity);
    setShowError(true);
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks(filter);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showToast('Erro ao carregar as tarefas. Tente novamente.', 'error');
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [filter, fetchTasks]);

  const handleAddTask = async () => {
    if (!newTask.trim() || !newDescription.trim()) return;

    try {
      await createTask(newTask, newDescription);
      setNewTask('');
      setNewDescription('');
      fetchTasks();
      showToast('Tarefa criada com sucesso!', 'success');
    } catch (error) {
      console.error('Error creating task:', error);
      showToast('Erro ao criar a tarefa', 'error');
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await updateTaskStatus(taskId, !completed);
      fetchTasks();
      const status = !completed ? 'concluída' : 'reaberta';
      showToast(`Tarefa ${status} com sucesso!`, 'success');
    } catch (error) {
      console.error('Error updating task:', error);
      showToast('Erro ao atualizar o status da tarefa', 'error');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
      showToast('Tarefa excluída com sucesso!', 'success');
    } catch (error) {
      console.error('Error deleting task:', error);
      showToast('Erro ao excluir a tarefa.', 'error');
    }
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  return (
    <Box sx={{ width: 600, height: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Minhas Tarefas
      </Typography>

      <Stack spacing={2} sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
        <TextField
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Digite o título da tarefa"
          variant="outlined"
          size="small"
        />
        <TextField
          fullWidth
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Digite a descrição da tarefa"
          variant="outlined"
          multiline
          rows={2}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleAddTask}
          disabled={!newTask.trim() || !newDescription.trim()}
          sx={{ width: 150, alignSelf: 'center' }}>
          Adicionar
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
          size="small">
          <ToggleButton value="all">TODOS</ToggleButton>
          <ToggleButton value="pending">PENDENTES</ToggleButton>
          <ToggleButton value="completed">CONCLUÍDOS</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Paper
        elevation={2}
        sx={{
          maxHeight: 400,
          overflow: 'auto',
          width: 500,
          mx: 'auto',
        }}>
        <List dense>
          {tasks.map((task) => (
            <ListItem
              sx={{ width: '100%' }}
              key={task.id}
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => toggleExpand(task.id)}>
                    {expandedTask === task.id ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id, task.completed)}
                />
              </ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </Typography>
                    <Collapse in={expandedTask === task.id}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, overflow: 'auto' }}>
                        {task.description}
                      </Typography>
                    </Collapse>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <MyToast
        open={showError}
        onClose={handleCloseError}
        severity={toastSeverity}
        message={errorMessage}
      />
    </Box>
  );
}
