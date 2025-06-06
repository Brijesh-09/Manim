"use client";

import { useEffect, useState } from "react";
import { loginUser, registerUser,  } from "../services/auth_service";
import { fetchUser, logoutUser } from "../services/protected_service";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUser();
      setUser(data); // will be null if not logged in
    };
    getUser();
  }, []);

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
      console.log("Registration successful:", response.data);
      setRegister(false);
    } else {
      console.error("Registration failed:", response.error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser(loginData);
    if (response.success) {
      console.log("Login successful:", response.data);
      setIsOpen(false);
      setUser(response.data.user); // store logged in user
      // router.push('/arena');
    } else {
      console.error("Login failed:", response.error);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push('/');
  };

  return (
    <>
      <div className="flex items-center justify-between p-2 bg-black">
        <img
          src="/logoo.png"
          alt="Share Icon"
          className="w-60 h-30 cursor-pointer"
          onClick={() => router.push("/")}
        />

        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-white font-semibold">
                Welcome<span className="font-bold bg-gray-800 rounded-md p-2 "> {user.name || user.email?.split('@')[0]}
                  </span> 
              </span>
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="text-white bg-gray-900 p-2 rounded-md hover:bg-gray-600"
                onClick={openModal}
              >
                Sign In
              </button>

              <button
                className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={getStarted}
              >
                Get Started
              </button>
            </>
          )}
        </div>
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
                <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Sign In with Email</h2>
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="w-full p-2 bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginChange}
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

      {/* Register modal */}
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
              <input
                type="text"
                name="name"
                placeholder="Username"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm">
                Register
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
