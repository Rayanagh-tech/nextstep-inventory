import API from './api';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  department?: string;
  job_title?: string;
}

// Register
export const registerUser = async (formData: RegisterForm) => {
  const res = await API.post('/auth/register', formData);
  return res.data; // { user, token }
};

// Login
export const loginUser = async (email: string, password: string) => {
  const res = await API.post('/auth/login', { email, password });
  return res.data; // { user, token }
};
