"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { fetchUser, generateVideo } from "../services/protected_service";
import { useState } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useRouter } from "next/navigation"; // Don't forget this!
import ArenaPage from "../arena/page";
import useInputStore from "@/store/inputStore";
import { useAuthModal } from '@/lib/AuthModalContext';

export function Form() {
  const placeholders = [
    "Explain MCP Servers",
    "What are Load Balancers?",
    "How to use Manim?",
  ];

  const { inputValue, setInputValue, setApiResponse, setLoading, setError } = useInputStore();
  const { triggerLoginModal } = useAuthModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target ? e.target.value : e;
    setInputValue({ [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  
    const user = await fetchUser();
    if (!user) {
      triggerLoginModal();
      return;
    }
  
    setLoading(true);
    setIsLoading(true);
  
    const response = await generateVideo(inputValue.prompt);
  
    if (response.success) {
      console.log("Video generation successful:", response.data);
      setIsLoading(false);
      setApiResponse(response);
  
      const projectId = response.projectId;
      if (projectId) {
        router.push(`/~/${projectId}`);
      } else {
        console.error("Project ID missing in response");
      }
  
    } else {
      console.error("Video generation failed:", response.error);
      setIsLoading(false);
    }
  
    console.log("submitted", inputValue.prompt);
  };
  


  return (
    <>
      {/* Input Area */}
      <div className="w-full max-w-lg p-4">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          name="prompt"
          value={inputValue.prompt}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
        {isLoading && (
    <div className="mt-2 text-sm text-blue-400 animate-pulse">
      Processing your request...
    </div>
  )}
      </div>
  
      {/* Quick Prompt Buttons */}
      <div className="flex justify-center gap-2 items-center">
        <div className="text-center">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            onClick={() => {
              console.log("How MCP Works clicked");
              setInputValue({ prompt: "How MCP Works" });
            }}
            className="dark:bg-white bg-black text-white dark:text-black flex items-center space-x-2"
          >
            <span>How MCP Works</span>
          </HoverBorderGradient>
        </div>
  
        <div className="text-center">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            onClick={() => {
              console.log("Explain Load Balancers clicked");
              setInputValue({ prompt: "Explain Load Balancers" });
            }}
            className="dark:bg-white bg-black text-white dark:text-black flex items-center space-x-2"
          >
            <span>Explain Load Balancers</span>
          </HoverBorderGradient>
        </div>
      </div>
    </>
  );
  
}
