"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          { headers: { Authorization: `Bearer ${response.access_token}` } }
        );

        const serverResponse = await axios.post(
          "http://localhost:8000/google-auth",
          {
            email: userInfoResponse.data.email,
            name: userInfoResponse.data.name,
            googleId: userInfoResponse.data.id,
            operation: "login",
          }
        );

        const { token, user } = serverResponse.data;
        
        // Store both token and googleId
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.googleId); // Store googleId as userId
        
        navigate("/StudentForm");
      } catch (error) {
        console.error("Google Login Error:", error.response || error.message);
        setError("User do not exist. Please signup.");
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      setError("Failed to login with Google. Please try again.");
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/users/login",
        {},
        {
          headers: { username, password },
        }
      );

      const { token, userId } = response.data;

      if (token && userId) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        navigate("/StudentForm");
      } else {
        setError("Invalid login response");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

 



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
              LOGIN
            </h2>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Google Login Button */}
            <div className="space-y-6">
              <Button
                type="button"
                onClick={googleLogin}
                disabled={isLoading}
                className="w-full py-6 border-gray-600 text-blue-500 hover:bg-gray-700 flex items-center justify-center space-x-2"
              >
                <svg
                  className="h-6 w-6"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="#4285F4"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                <span className="text-lg font-semibold">
                  Sign in with Google
                </span>
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800 px-2 text-gray-400">
                    Or sign in with email
                  </span>
                </div>
              </div>
            </div>

            {/* Email and Password Login Form */}
            <form onSubmit={onSubmit} className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-teal-300">
                  Email or Username
                </Label>
                <Input
                  id="username"
                  placeholder="student@example.com"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
                  disabled={isLoading}
                  className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-teal-100">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </div>
          <div className="p-4 bg-gray-900 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              New student?{" "}
              <a
                href="/signup"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
