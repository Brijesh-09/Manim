import useInputStore from '@/store/inputStore';
import axios from 'axios';

axios.defaults.withCredentials = true; // so cookies (session) are sent

export const fetchUser = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/v1/auth/me', {
      withCredentials: true
    });
    console.log('Logged in user:', res.data.user);
    return res.data.user;
  } catch (err) {
    console.log('Not logged in');
    return null;
  }
};

export const generateVideo = async (prompt, handleUnauthorized) => {
  const {
    setApiResponse,
    setPrompt,
    setLoading,
    setError
  } = useInputStore.getState();

  try {
    setLoading(true);

    const res = await axios.post(
      'http://localhost:8000/api/v1/video/create',
      { prompt },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 401) {
      console.log('Session expired or unauthorized.');
      if (handleUnauthorized) handleUnauthorized();
      throw new Error('Unauthorized');
    }

    const data = res.data;
    console.log('Video generation response:', data);

    // Save the prompt and response to Zustand
    setApiResponse(data);       // Store all response fields
    setPrompt(data.prompt);     // Optional: store just the prompt

    return data;

  } catch (err) {
    console.error('Error generating video:', err);
    setError(err.message || 'An error occurred');
    throw err;
  }
};