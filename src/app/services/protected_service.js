import axios from 'axios';

axios.defaults.withCredentials = true; // so cookies (session) are sent

export const fetchUser = async () => {
  try {
    const res = await axios.get('http://localhost:5000/auth/me', {
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
  try {
    const res = await axios.post(
      'http://localhost:5000/api/v1/generate',
      { prompt },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check for 401 Unauthorized
    if (res.status === 401) {
      console.log('Session expired or unauthorized.');
      if (handleUnauthorized) {
        handleUnauthorized(); // Call the callback passed from the component
      }
      throw new Error('Unauthorized');
    }

    console.log('Video generation response:', res.data);
    return res.data;

  } catch (err) {
    console.error('Error generating video:', err);
    throw err; // rethrow to handle it in the calling function
  }
};

