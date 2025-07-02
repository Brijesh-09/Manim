"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import ReactPlayer from "react-player";
import { fetchUser } from "@/app/services/protected_service";

export default function ProjectPage() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputChatValue, setInputChatValue] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Force player refresh trigger
  const [playerKey, setPlayerKey] = useState(Date.now());

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!projectId) return;
  
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/video/${projectId}`, {
          credentials: "include",
        });
        const data = await res.json();
  
        if (data.success) {
          const latest = data.project.iterations?.at(-1);
          setProject(data.project);
          console.log("Fetched project:", data.project.iterations);
  
          if (latest?.videoUrl?.endsWith(".mp4")) {
            const urlWithTimestamp = `${latest.videoUrl}?t=${Date.now()}`;
            setVideoUrl(urlWithTimestamp);
            setPlayerKey(Date.now());
            return true; // ✅ Done
          }
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      }
  
      return false; // not ready yet
    };
  
    const pollUntilVideoReady = async (retries = 10, delay = 2000) => {
      for (let i = 0; i < retries; i++) {
        console.log(`Polling attempt ${i + 1}/${retries}`);
        const isReady = await fetchProject();
        if (isReady) break;
        await new Promise(res => setTimeout(res, delay));
      }
    };
  
    pollUntilVideoReady();
  
  }, [projectId]);
  

  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUser();
      setUser(data);
    };
    getUser();
  }, []);

  const handleSendMessage = async () => {
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

      setMessages(prev => [...prev, { type: 'ai', text: data.text }]);

      const pollForVideo = async (retries = 20, delay = 1500) => {
        for (let i = 0; i < retries; i++) {
          const updatedRes = await fetch(`http://localhost:8000/api/v1/video/${projectId}`, {
            credentials: "include",
          });
          const updatedData = await updatedRes.json();

          if (updatedData?.success && updatedData.project?.iterations?.length) {
            const latest = updatedData.project.iterations.at(-1);
            if (latest?.videoUrl?.endsWith(".mp4") && latest.videoUrl !== videoUrl) {
              setProject(updatedData.project);
              setVideoUrl(latest.videoUrl);
              setPlayerKey(Date.now()); // 👈 force refresh video
              break;
            }
          }

          await new Promise(res => setTimeout(res, delay));
        }
      };

      await pollForVideo();
    } catch (err) {
      console.error('❌ Chat error:', err);
      setMessages(prev => [...prev, { type: 'ai', text: '⚠️ AI failed to respond.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const latest = project?.iterations?.at(-1); // Define latest here

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <div className="flex items-center justify-between border-b border-gray-400 border-opacity-50 pr-2 mt-4 bg-black">
        <img
          src="/logoo.png"
          alt="Logo"
          className="w-40 h-20 cursor-pointer"
          onClick={() => window.location.href = "/"}
        />
        
        <h2 className="text-white font-bold">{latest?.prompt}</h2>
        <div className="flex items-center space-x-4">
          <span className="font-bold">Welcome, {user ? user.name : "Guest"}!</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Sidebar */}
        <div className="flex flex-col w-1/4 m-4 bg-black rounded-lg" style={{ height: 'calc(100vh - 96px)' }}>
          <h1 className="text-white">manai</h1>

          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="flex-grow overflow-y-auto px-4 space-y-4 pr-2">
              {project?.iterations?.map((iteration, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="p-2 rounded max-w-xs text-sm bg-blue-600 text-white">
                      {iteration.prompt}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="p-2 rounded max-w-xs text-sm bg-gray-700 text-white whitespace-pre-wrap overflow-x-auto">
                      {/* <code>{iteration.code}</code> */}
                      <code>{iteration.aiResponse}</code>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-white text-sm px-4 py-2 rounded animate-pulse">
                    AI is typing...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="sticky bottom-0 bg-black pb-16">
              <div className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded-lg">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow p-2 bg-[#333] rounded outline-none placeholder-gray-400 text-white"
                  value={inputChatValue}
                  onChange={(e) => {
                    setInputChatValue(e.target.value);
                    setIsWriting(e.target.value.trim().length > 0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isWriting) handleSendMessage();
                  }}
                />
                <button
                  disabled={!isWriting}
                  onClick={handleSendMessage}
                  className={`p-2 rounded ${isWriting ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-600 cursor-not-allowed'}`}
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
        <div className="flex-1 m-4 p-6 bg-black rounded-md overflow-y-auto">
          <h3 className="text-xl mb-4">Video</h3>
          <div className="flex-1 m-4 p-6 bg-black rounded-md overflow-y-auto">
            <div className="bg-gray-800 rounded shadow p-4">
              {videoUrl ? (
                <ReactPlayer
                  key={videoUrl} // ensures re-render
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
    </div>
  );
}
