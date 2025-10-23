import { useState, useEffect } from 'react';
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

  const fetchTasks = async () => {
    try {
      const data = await getTasks(filter);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleAddTask = async () => {
    if (!newTask.trim() || !newDescription.trim()) return;

    try {
      await createTask(newTask, newDescription);
      setNewTask('');
      setNewDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await updateTaskStatus(taskId, !completed);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
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
          sx={{ width: 150, alignSelf: 'center' }}
        >
          Adicionar
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
          size="small"
        >
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
        }}
      >
        <List dense>
          {tasks.map((task) => (
            <ListItem
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
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
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
                        sx={{ mt: 1 }}
                      >
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
    </Box>
  );
}
