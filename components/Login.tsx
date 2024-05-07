"use client";

import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { getProviders, signIn } from "next-auth/react";
import { LoginHelper } from "@/utils/loginHelper";
import { useRouter } from "next/navigation";

interface Errors {
  username?: string;
  password?: string;
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate form fields
    const validationErrors: Errors = {};
    if (username.trim() === "") {
      validationErrors.username = "Username is required";
    }
    if (password.trim() === "") {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Process the form submission logic here
    console.log("Username:", username);
    console.log("Password:", password);

    const loginres = await LoginHelper({
      username,
      password,
    });

    if (loginres && loginres.ok) {
      setUsername("");
      setPassword("");
      setErrors({});
      router.push("/");
    }
    // Reset the form fields and errors
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="max-w-md w-full mx-5 my-24 md:m-28 p-6 bg-black rounded shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          Sign In
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-white text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className={`w-full px-3 py-2 border-b text-white bg-inherit rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-white text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={`w-full px-3 py-2 border-b bg-inherit text-white rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-[70%] transform -translate-y-1/2 text-gray-500"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="w-full flex">
            <button
              type="submit"
              className="w-[40%] mx-auto bg-white text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-white text-center font-sans font-semibold my-3 text-base">
          -----&nbsp;or&nbsp;-----
        </p>
        <p className="text-white text-center font-sans font-semibold mb-5 text-base">
          Sign Up with
        </p>
        <div className="flex gap-3 justify-evenly my-5">
          <div
            onClick={() => {
              signIn("google");
            }}
            className=" w-full py-3 px-5 bg-white shadow-xl rounded-md flex gap-2 justify-center items-center cursor-pointer"
          >
            {/* <Image src={google_logo} alt="" className="w-[20px] h-[20px]" /> */}
            <button>Google</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
