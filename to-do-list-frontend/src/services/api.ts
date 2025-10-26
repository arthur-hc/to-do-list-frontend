import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

const TOKEN_KEY = 'auth_token';

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface LoginResponse {
  message: string;
  token: string;
  tokenType: string;
}

export const authenticate = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/authenticate', {
      email,
      password,
    });

    if (response.data.token) {
      saveToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Credenciais inválidas');
    }
    throw error;
  }
};

export const logout = () => {
  removeToken();
  window.location.href = '/login';
};

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
