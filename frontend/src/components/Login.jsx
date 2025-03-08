import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaRocket } from "react-icons/fa";

function LoginPage() {
  const navigate = useNavigate();

  // Dummy login function to simulate authentication
  const login = () => {
    navigate("/write");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          AI Writing Assistant
        </h1>
        <p className="text-gray-600 mb-8">
          Elevate your writing with the power of AI
        </p>

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center mb-4"
        >
          <FaSignInAlt className="mr-2" />
          Login
        </button>

        <button
          onClick={login}
          className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center"
        >
          <FaRocket className="mr-2" />
          Get Started
        </button>

        <p className="mt-6 text-sm text-gray-500">
          New to AI Writing Assistant? Click 'Get Started' to create your account and begin your journey to better writing!
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
