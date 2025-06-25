"use client";

import { useEffect, useState, useRef } from 'react';
import { fetchUser } from '../services/protected_service';
import useInputStore from '@/store/inputStore';
import ReactPlayer from 'react-player';
import { io } from 'socket.io-client';
import { useAuthModal } from '@/lib/AuthModalContext';
import { useRouter } from 'next/navigation';
export default function ArenaPage() {
  const { user, updateUser } = useAuthModal();
  const [inputChatValue, setInputChatValue] = useState('');
  const { inputValue, apiResponse } = useInputStore();
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      fetchUser().then(updateUser);
    }
    socketRef.current = io('http://localhost:8000');
    socketRef.current.on('videoReady', ({ videoUrl }) => {
      setVideoUrl(videoUrl);
    });
    return () => socketRef.current?.disconnect();
  }, [user, updateUser]);

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].type === 'user') {
      const userMsg = messages[messages.length - 1].text;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: 'ai', text: `AI says: "${userMsg}"` },
        ]);
      }, 800);
    }
  }, [messages]);

  const [videoUrl, setVideoUrl] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      
      <div className="flex items-center justify-between border-b-1 border-white p-2 bg-black">
        <img
          src="/logoo.png"
          alt="Logo"
          className="w-40 h-20 cursor-pointer"
          onClick={() => router.push('/')}
        />
        <h2 className='text-white font-bold'>{inputValue.prompt || 'NA'}</h2>
        <div className="flex items-center space-x-4">
          <span className="font-bold">
            Welcome, {user ? user.name : 'Guest'}!
          </span>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Sidebar */}
        <div
          className="flex flex-col w-1/4 m-4 bg-black rounded-lg"
          style={{ height: 'calc(100vh - 96px)' }}
        >
          {/* Prompt */}
          <h1 className='tex-white'>manai</h1>
          <div className="p-4  flex justify-end">
            <h2 className="p-2 bg-[#262626] rounded">
              {inputValue.prompt || 'NA'}
            </h2>
          </div>

          {/* Chat messages: scrollable */}
          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="flex-grow overflow-y-auto px-4 space-y-4 pr-2">
              {apiResponse?.success && apiResponse.aiResponse && (
                <div className="bg-gray-800 p-2 rounded text-xs">
                  <pre className="whitespace-pre-wrap">
                    {apiResponse.aiResponse}
                  </pre>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`p-2 rounded max-w-xs text-sm ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Input at bottom */}
            <div className="sticky bottom-0 bg-black pb-16">
              <div className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded-lg">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow p-2 bg-[#333] rounded outline-none placeholder-gray-400 text-white"
                  value={inputChatValue}
                  onChange={(e) => {
                    setInputChatValue(e.target.value);
                    setIsWriting(e.target.value.trim().length > 0);
                  }}
                />
                <button
                  disabled={!isWriting}
                  onClick={() => {
                    if (!inputChatValue.trim()) return;
                    setMessages((prev) => [
                      ...prev,
                      { type: 'user', text: inputChatValue.trim() },
                    ]);
                    setInputChatValue('');
                    setIsWriting(false);
                  }}
                  className={`p-2 rounded ${
                    isWriting
                      ? 'bg-green-500 hover:bg-green-400'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  <img
                    src="https://www.svgrepo.com/show/533306/send.svg"
                    alt="Send"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 m-4 p-6 bg-black rounded-lg overflow-y-auto">
          <h3 className="text-xl mb-4">Generated Content</h3>
          <div className="bg-white rounded shadow p-4">
            {videoUrl ? (
              <ReactPlayer
                url={videoUrl}
                controls
                width="100%"
                height="auto"
                style={{ borderRadius: 12 }}
              />
            ) : (
              <p className="text-black">🎥 Waiting for video...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

