import axios from 'axios';

export const registerUser = async (formData) => {
  try {
    const res = await axios.post('http://localhost:5000/auth/register', formData);
    return { success: true, data: res.data };
  } catch (err) {
    console.error('Registration failed:', err.response || err.message || err);
    return {
      success: false,
      error: err.response?.data?.error || 'Registration failed. Please try again.',
    };
  }
};


export const loginUser = async (formData) => {
  try {
    const res = await axios.post('http://localhost:5000/auth/login', formData, {
      withCredentials: true, // ✅ CRUCIAL FOR COOKIES
    });
    return { success: true, data: res.data };
  } catch (err) {
    console.error('Login failed:', err.response || err.message);
    return {
      success: false,
      error: err.response?.data?.error || 'Login failed. Please try again.',
    };
  }
};
