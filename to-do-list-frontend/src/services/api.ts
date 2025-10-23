import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export const getTasks = async (filter?: 'all' | 'pending' | 'completed') => {
  let params = {};
  if (filter && filter !== 'all') {
    params = { completed: filter === 'completed' };
  }

  const response = await api.get<Task[]>('/tasks', { params });
  return response.data;
};

export const createTask = async (title: string, description: string) => {
  const response = await api.post<Task>('/tasks', { title, description });
  return response.data;
};

export const updateTaskStatus = async (taskId: string, completed: boolean) => {
  const response = await api.patch<Task>(`/tasks/${taskId}/status`, {
    completed,
  });
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  await api.delete(`/tasks/${taskId}`);
};
