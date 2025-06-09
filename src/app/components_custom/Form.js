"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { generateVideo } from "../services/protected_service";
import { useState } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useRouter } from "next/navigation"; // Don't forget this!

export function Form() {
  const placeholders = [
    "Explain MCP Servers",
    "What are Load Balancers?",
    "How to use Manim?",
  ];

  const [inputValue, setInputValue] = useState({
    prompt: ""
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Fixed state setter name
  const [emailSignIn, setEmailSignIn] = useState(false); // Added this state for the email sign-in
  const [loginData, setLoginData] = useState({ email: "", password: "" }); // Added state for login data
  const [isOpen, setIsOpen] = useState(false); // Added state to control modal visibility
  const router = useRouter(); // Added useRouter hook

  const handleChange = (e) => {
    setInputValue(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in before proceeding
    if (!isLoggedIn) {
      handleUnauthorized();
      return; // Prevent submitting if not logged in
    }

    const response = await generateVideo(inputValue);
    if (response.success) {
      console.log("Video generation successful:", response.data);
      router.push('/arena');
    } else {
      console.error("Video generation failed:", response.error);
    }
    console.log("submitted", inputValue.prompt);
  };

  const handleUnauthorized = () => {
    // console.error("Unauthorized access. Please log in.");
    setIsLoggedIn(false); // Ensure logged-in state is false
    setIsOpen(true); // Open the modal to ask the user to log in
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here (you'll probably want to call an API to authenticate)
    const response = await loginUser(loginData); // Example loginUser function
    if (response.success) {
      setIsLoggedIn(true); // Set the user as logged in
      setIsOpen(false); // Close the modal
      router.push('/arena'); // Redirect after login
    } else {
      console.error("Login failed:", response.error);
    }
  };

  return (
    <>
      <div className="w-full max-w-lg p-4">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          name="prompt"
          value={inputValue.prompt}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>

      <div className="flex justify-center gap-2 items-center">
        {/* Examples */}
        <div className="text-center">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            onClick={() => {
              console.log("How MCP Works clicked");
              setInputValue(prev => ({ ...prev, prompt: "How MCP Works" }));
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
              setInputValue(prev => ({ ...prev, prompt: "Explain Load Balancers" }));
            }}
            className="dark:bg-white bg-black text-white dark:text-black flex items-center space-x-2"
          >
            <span>Explain Load Balancers</span>
          </HoverBorderGradient>
        </div>
      </div>

      {/* Show Modal if not logged in */}
      {!isLoggedIn && isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-gray-800 dark:bg-gray-900 text-gray-800 dark:text-white p-8 rounded-xl shadow-2xl w-full max-w-md relative animate-fadeIn">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
              aria-label="Close"
            >
              ✕
            </button>

            {!emailSignIn ? (
              <>
                <h2 className="text-3xl font-extrabold text-center mb-2 text-blue-500">
                  Welcome to <span className="text-blue-600">ManimAI</span>
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  Log in to your existing account or create a new one using the options below.
                </p>

                <button
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition mb-3 flex items-center justify-center gap-2 shadow-sm"
                  // onClick={GoogleSignin}
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </button>

                <button
                  className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm"
                  onClick={() => setEmailSignIn(true)}
                >
                  Sign in with Email
                </button>

                <p className="text-xs text-center text-gray-400 mt-4">
                  By continuing, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">
                  Sign In with Email
                </h2>
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full p-2 bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full p-2 bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm"
                  >
                    Sign In
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
