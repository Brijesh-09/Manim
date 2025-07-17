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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${projectId}`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}${projectId}`);


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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}chat/${projectId}`, {
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
          const updatedRes = await fetch(`${process.env.BACKEND_URL}${projectId}`, {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2  bg-black">
        <img
          src="/logoo.png"
          alt="Logo"
          className="w-36 sm:w-40 h-auto object-contain cursor-pointer"
          onClick={() => window.location.href = "/"}
        />

        <h2 className="text-base sm:text-lg font-bold text-white text-center sm:text-left truncate max-w-full sm:max-w-xs">
          {latest?.prompt
            ? latest.prompt.split(" ").slice(0, 2).join(" ") +
            (latest.prompt.split(" ").length > 2 ? "..." : "")
            : "NA"}
        </h2>

        <div className="flex justify-center sm:justify-end">
          <span className="font-bold bg-white text-black px-3 py-1 rounded-lg">
            {user ? user.name : "Guest"}!
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-auto">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 flex flex-col p-4 bg-black rounded-lg max-h-[80vh]">

          <h1 className="text-white mb-2">⚡ made with <a href="https://www.manim.community/" className="underline text-gray-200"> Manim</a></h1>

          <div className="flex flex-col flex-grow overflow-hidden">

            {/* Scrollable message area */}
            <div className="overflow-y-auto space-y-4 pr-2 mb-2" style={{ maxHeight: 'calc(80vh - 100px)' }}>
              {project?.iterations?.map((iteration, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="p-2 rounded max-w-[80%] text-sm bg-blue-600 text-white break-words">
                      {iteration.prompt}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="p-2 rounded max-w-[80%] text-sm bg-gray-700 text-white whitespace-pre-wrap overflow-x-auto">
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

            {/* Chat input box - always visible at bottom */}
            <div className="mt-auto">
              <div className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded-lg">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow p-2 bg-[#333] rounded outline-none placeholder-gray-400 text-white text-sm"
                  value={inputChatValue}
                  onChange={(e) => {
                    setInputChatValue(e.target.value);
                    setIsWriting(e.target.value.trim().length > 0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isWriting) handleSendMessage();
                  }}
                />
                <button
                  disabled={!isWriting}
                  onClick={handleSendMessage}
                  className={`p-2 rounded ${isWriting
                    ? "bg-green-500 hover:bg-green-400"
                    : "bg-gray-600 cursor-not-allowed"
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



        {/* Video Content */}
        <div className="flex-1 p-4 bg-black rounded-lg overflow-y-auto">
          <h3 className="text-xl mb-4">Video</h3>
          <div className="bg-gray-800 rounded shadow p-4">
            {videoUrl ? (
              <ReactPlayer
                key={videoUrl}
                url={videoUrl}
                controls
                width="100%"
                height="auto"
                style={{ borderRadius: 12 }}
              />
            ) : (
              <p className="text-white">🎥 Waiting for video...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

}
