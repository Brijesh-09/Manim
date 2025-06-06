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

export const generateVideo = async (prompt) => {
  try{
    const res =  await axios.post('http://localhost:5000/api/v1/generate' , prompt,{
       withCredentials: true,
       headers: {
          "Content-Type": "application/json", // explicitly define
        },
    } );
    console.log('Video generation response:', res.data);
    return res.data;
    }
  
  catch (err) {
    console.error('Error generating video:', err);
    throw err; // rethrow to handle it in the calling function
  }
}
