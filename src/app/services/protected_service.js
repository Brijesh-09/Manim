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

//chat Interaction 

export const handleSendMessage = async () => {
  if (!inputChatValue.trim() || !projectId) return;

  const userMessage = inputChatValue;
  setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
  setInputChatValue('');
  setIsWriting(false);
  setIsTyping(true);

  try {
    const res = await fetch(`http://localhost:8000/api/v1/video/chat/${projectId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Chat failed");

    // Show AI message
    setMessages(prev => [...prev, { type: 'ai', text: data.text }]);

    // 👇 OPTIONAL: Update project state with new iteration if needed
    const updatedProjectRes = await fetch(`http://localhost:8000/api/v1/video/${projectId}`, {
      credentials: "include",
    });
    const updatedProjectData = await updatedProjectRes.json();
    if (updatedProjectData.success) {
      setProject(updatedProjectData.project);
    }

  } catch (err) {
    console.error('❌ Chat error:', err);
    setMessages(prev => [...prev, { type: 'ai', text: '⚠️ AI failed to respond.' }]);
  } finally {
    setIsTyping(false);
  }
};

