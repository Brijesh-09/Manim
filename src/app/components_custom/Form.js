"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { generateVideo } from "../services/protected_service";
import { useState } from "react";

export function Form() {
  const placeholders = [
    "Explain MCP Servers",
    "What are Load Balancers?",
    "How to use Manim?",
  ];

  const [inputValue, setInputValue] = useState({
    prompt: ""
  });

  const handleChange = (e) => {
    setInputValue(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await generateVideo(inputValue);
    if (response.success) {
      console.log("Video generation successful:", response.data);
      router.push('/arena')
      // Handle success, e.g., show video or redirect
    } else {
      console.error("Video generation failed:", response.error);
      // Handle error, e.g., show error message
    }
    console.log("submitted", inputValue.prompt);
  };

  return (
    <div className="w-full max-w-lg p-4">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        name="prompt"
        value={inputValue.prompt}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}