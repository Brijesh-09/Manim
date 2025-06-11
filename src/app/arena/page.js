"use client";

import { useEffect, useState } from 'react';
import { fetchUser } from '../services/protected_service';
import useInputStore from '@/store/inputStore';

export default function ArenaPage() {
  const [user, setUser] = useState(null);
  const [inputChatValue, setInputChatValue] = useState('');
  const { inputValue, apiResponse, isLoading, error } = useInputStore();
  const [isWriting, setIsWriting] = useState(false);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUser();
      setUser(data);
    };
    getUser();
  }, []);

  // Simulate AI reply after user sends a message
  useEffect(() => {
    if (messages.length && messages[messages.length - 1].type === 'user') {
      const userMsg = messages[messages.length - 1].text;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: 'ai', text: `AI response to: "${userMsg}"` },
        ]);
      }, 800);
    }
  }, [messages]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black">
        <img
          src="/logoo.png"
          alt="Share Icon"
          className="w-60 h-30 cursor-pointer"
          onClick={() => router.push("/")}
        />
        <div className="space-x-4 flex">
          <button className="text-white bg-gray-200 p-2  flex  gap-2 rounded-md hover:bg-gray-600">
            <img
              src="https://www.svgrepo.com/show/506317/share-2.svg"
              alt="Google"
              className="w-5 h-5"
            />
          </button>
          <h2 className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Welcome {user ? user.name : 'Guest'}!
          </h2>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-row bg-black h-screen">
        {/* Left Sidebar */}
        <div
          className="w-1/3 rounded-lg m-6 text-white flex flex-col justify-between p-4"
          style={{ backgroundColor: "#000000" }}
        >
          {/* Prompt at top right */}
          <div className="flex justify-end">
            <h2
              className="text-l text-white border-md p-2 rounded-md"
              style={{ backgroundColor: "#262626" }}
            >
              {inputValue.prompt || "NA"}
            </h2>
          </div>

          {/* Scrollable Response + Chat Area */}
          <div className="flex-1 overflow-y-auto flex flex-col mt-4 space-y-4 pr-2">
            {/* AI Main Response: Manim Code */}
            {apiResponse && apiResponse.success && apiResponse.manimCode?.content && (
              <div className="bg-gray-800 p-2 rounded text-xs">
                {/* <h4 className="text-white mb-1">Manim Code:</h4> */}
                <pre className="overflow-auto whitespace-pre-wrap">
                  {apiResponse.manimCode.content}
                </pre>
                <p className="text-gray-400 text-xs mt-2">
                  Created: {apiResponse.prompt?.createdAt
                    ? new Date(apiResponse.prompt.createdAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            )}

            {/* Message Thread */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
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

          {/* Input Area */}
          <div className="flex items-center gap-2 mt-2 w-full">
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-grow p-2 outline-2 outline-offset-2 outline-blue-500 text-white rounded"
              value={inputChatValue}
              onChange={(e) => {
                setInputChatValue(e.target.value);
                setIsWriting(e.target.value.length > 0);
              }}
            />
            {isWriting && (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
                onClick={() => {
                  if (inputChatValue.trim()) {
                    setMessages((prev) => [
                      ...prev,
                      { type: 'user', text: inputChatValue },
                    ]);
                    setInputChatValue('');
                    setIsWriting(false);
                  }
                }}
              >
                <img
                  src="https://www.svgrepo.com/show/533306/send.svg"
                  alt="send"
                  className="w-5 h-5"
                />
              </button>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div
          className="w-2/3 p-6 rounded-lg m-6 outline overflow-y-auto"
          style={{ backgroundColor: "#000000" }}
        >
          <h1 className="text-3xl font-bold mb-4 text-gray-700">
            Main Code Area
          </h1>
          <p>This is where the main app content goes.</p>
          <div className="bg-white p-4 rounded shadow mt-6">
            <videoplayer>Video Player Placeholder</videoplayer>
          </div>
        </div>
      </div>
    </>
  );
}
