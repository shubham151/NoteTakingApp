import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const createNote = async (title) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) { 
      console.error('No authentication token found') 
      throw new Error('No authentication token found');
    }
    const response = await api.post(
      '/notes/create',
      { title },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Create Note Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getNotes = async () => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await api.get('/notes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch Notes Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateNote = async (noteId, content, title) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("User not authenticated");

  return api.patch(
    `/notes/update/${noteId}`,
    { content, title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const shareNote = async (noteId, usernameOrEmail) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("User not authenticated");

  return api.patch(
    `/notes/share/${noteId}`,
    { usernameOrEmail },
    { headers: { Authorization: `Bearer ${token}` } }
  );


};


