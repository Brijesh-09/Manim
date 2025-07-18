"use client";


import { loginUser, registerUser } from "../services/auth_service";
import { fetchUser, logoutUser, } from "../services/protected_service";


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/lib/AuthModalContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [register, setRegister] = useState(false);
  const [emailSignIn, setEmailSignIn] = useState(false);
  const router = useRouter();
  const [menuOpen , setMenuOpen] = useState(false);
  // Use the context
  const { shouldOpenModal, resetModalTrigger } = useAuthModal();

  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUser();
      setUser(data); // will be null if not logged in
    };
    getUser();
  }, []);

  // Watch for modal trigger from form
  useEffect(() => {
    if (shouldOpenModal && !user) {
      openModal();
      resetModalTrigger();
    }
  }, [shouldOpenModal, user, resetModalTrigger]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginChange = (e) => {
    setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openModal = () => {
    setIsOpen(true);
    setEmailSignIn(false); // Reset email form on open
  };

  const getStarted = () => {
    setIsOpen(false);
    setRegister(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerUser(formData);
    if (response.success) {
      // console.log("Registration successful:", response.data);
      setRegister(false);
      setUser(response.data.user); // Update user state after registration
    } else {
      // console.log("Registration failed:", response.error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser(loginData);
    if (response.success) {
      // console.log("Login successful:", response.data);
      setIsOpen(false);
      setUser(response.data.user); // store logged in user
    } else {
      // console.log("Login failed:", response.error);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push('/');
  };

  const GoogleLogin = async () => {
    // console.log("Google login clicked");
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL_AUTH}google`;
  
  }

  
  return (
    <>
      {/* Navbar */}
      <div className="flex items-center justify-between bg-black px-4 py-3 sm:py-2 relative">
        {/* Logo */}
        <img
          src="/logoo.png"
          alt="Promanim Logo"
          className="w-32 sm:w-40 h-auto cursor-pointer"
          onClick={() => router.push("/")}
        />
  
        {/* Hamburger icon - visible only on mobile */}
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
  
        {/* Buttons - visible only on larger screens */}
        <div className="hidden sm:flex sm:items-center sm:space-x-4">
          {user ? (
            <>
              <span className="text-white text-sm sm:text-base font-medium">
                Welcome{" "}
                <span className="font-bold bg-gray-800 px-3 py-1 rounded-md ml-1 inline-block">
                  {user.name || user.email?.split("@")[0]}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm sm:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openModal}
                className="bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm sm:text-base"
              >
                Sign In
              </button>
              <button
                onClick={getStarted}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded text-sm sm:text-base"
              >
                Get Started
              </button>
            </>
          )}
        </div>
  
        {/* Dropdown Menu for Mobile */}
        {menuOpen && (
          <div className="absolute top-full right-4 bg-gray-900 text-white rounded-md p-4 flex flex-col gap-2 w-48 shadow-lg sm:hidden z-50">
            {user ? (
              <>
                <span className="text-sm font-medium">
                  Welcome{" "}
                  <span className="block bg-gray-800 px-2 py-1 rounded mt-1">
                    {user.name || user.email?.split("@")[0]}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openModal}
                  className="bg-gray-800 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={getStarted}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        )}
      </div>
  
      {/* Sign In Modal */}
      {isOpen && (
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
                <h2 className="text-3xl font-extrabold text-center mb-2 text-blue-500">Welcome to <span className="text-blue-600">ManimAI</span></h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  Log in to your existing account or create a new one using the options below.
                </p>
  
                <button
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition mb-3 flex items-center justify-center gap-2 shadow-sm"
                  onClick={() => {GoogleLogin()}}
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
                <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Sign In with Email</h2>
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="w-full p-2 bg-gray-200 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full p-2 bg-gray-200 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
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
  
      {/* Register Modal */}
      {register && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-gray-800 dark:bg-gray-900 text-gray-800 dark:text-white p-8 rounded-xl shadow-2xl w-full max-w-md relative animate-fadeIn">
            <button
              onClick={() => setRegister(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
              aria-label="Close"
            >
              ✕
            </button>
  
            <h2 className="text-3xl font-extrabold text-center mb-2 text-blue-500">Create an Account</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Fill in the details below to create your account.
            </p>
  
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* <input
                type="text"
                name="name"
                placeholder="Username"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 bg-gray-200 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              /> */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 bg-gray-200 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 bg-gray-200 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Register
              </button>
              <h2 className="text-gray-400 flex justify-center">
              --- or ---
            </h2>
            <button
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition mb-3 flex items-center justify-center gap-2 shadow-sm"
                  onClick={() => {GoogleLogin()}}
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </button>

            </form>
           
  
            <p className="text-xs text-center text-gray-400 mt-4">
              By registering, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      )}
    </>
  );
}  