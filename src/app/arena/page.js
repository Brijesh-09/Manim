"use client";

import { useEffect, useState } from 'react';
import { fetchUser } from '../services/protected_service';

export default function ArenaPage() {
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUser();
      setUser(data); // will be null if not logged in
    };
    getUser();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black">
        <img src="/logoo.png" alt="Share Icon" className="w-60 h-30 cursor-pointer"
                
                onClick={() => router.push("/")} />

        <div className="space-x-4 flex">
          <button className="text-white bg-gray-200 p-2  flex  gap-2 rounded-md hover:bg-gray-600">
            <img src="https://www.svgrepo.com/show/506317/share-2.svg" alt="Google" className="w-5 h-5" />
          </button>

          <h2 className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Welcome {user ? user.name : 'Guest'}!
          </h2>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-row bg-black h-screen">
        {/* Left Sidebar */}

        <div className="w-1/3 rounded-lg m-6 text-white flex flex-col justify-between p-4" style={{ backgroundColor: "#000000" }}>
          {/* Header aligned top-right */}
          <div className="flex justify-end">
            <h2 className="text-l text-white  border-md p-2 rounded-md" style={{ backgroundColor: "#262626" }}>What are Load Balancers</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto flex flex-col items-start mt-4 space-y-2 pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className=" p-2 rounded max-w-xs text-left "style={{ backgroundColor: "#262626" }}
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 mt-2 w-full">
  <input
    type="text"
    placeholder="Type your message here..."
    className="flex-grow p-2  outline-2 outline-offset-2 outline-blue-500 text-white rounded"
    value={inputValue}
    onChange={(e) => {
      setInputValue(e.target.value);
      setIsWriting(e.target.value.length > 0);
    }}
  />
  {isWriting && (
    <button
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
      onClick={() => {
        if (inputValue.trim()) {
          setMessages((prev) => [...prev, inputValue]);
          setInputValue('');
          setIsWriting(false);
        }
      }}
    >
       <img src="https://www.svgrepo.com/show/533306/send.svg"  alt="send" className="w-5 h-5" />
    </button>
  )}
</div>

        </div>

        {/* Right Content Area */}
        <div className="w-2/3 p-6 rounded-lg m-6 outline overflow-y-auto"style={{ backgroundColor: "#000000" }}>
          <h1 className="text-3xl font-bold mb-4 text-gray-700">Main Code Area</h1>
          <p className=''>This is where the main app content goes.</p>
          <div className="bg-white p-4 rounded shadow mt-6">
            {/* <code>
              Start prompting (or editing) to see magic happen :)
            </code> */}

          <videoplayer>
            Video Player Placeholder
          </videoplayer>
          </div>
        </div>
      </div>
    </>
  );
}
