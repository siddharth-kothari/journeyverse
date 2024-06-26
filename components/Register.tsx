"use client";

import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { api } from "@/app/api";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LoginHelper } from "@/utils/loginHelper";
import defaultPic from "./../assets/default-avatar.png";
import Image from "next/image";
import bcrypt from "bcryptjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { computeSHA256 } from "@/utils";
import { getSignedURL } from "@/actions";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showtoast, setShowToast] = useState(false);
  const [apiStatus, setApiStatus] = useState(0);

  const router = useRouter();

  interface Errors {
    username?: string;
    password?: string;
    name?: string;
    email?: string;
    confirmPassword?: string;
    profilePicture?: string;
    location?: string;
    bio?: string;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate form fields
    const validationErrors: Errors = {};
    if (name.trim() === "") {
      validationErrors.name = "Name is required";
    }
    if (username.trim() === "") {
      validationErrors.username = "Username is required";
    }
    if (email.trim() === "") {
      validationErrors.email = "Email is required";
    }
    if (password.trim() === "") {
      validationErrors.password = "Password is required";
    }
    if (confirmPassword.trim() === "") {
      validationErrors.confirmPassword = "Confirm Password is required";
    }
    if (password !== confirmPassword) {
      validationErrors.password = "Passwords do not match";
    }
    if (location.trim() === "") {
      validationErrors.location = "Location Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      var filename;

      if (profilePicture) {
        const checksum = await computeSHA256(profilePicture);
        filename = `${Date.now()}_${profilePicture?.name.replaceAll(" ", "_")}`;
        const signedURLResult = await getSignedURL(
          "register",
          "users",
          filename,
          profilePicture?.type,
          profilePicture?.size,
          checksum
        );

        if (signedURLResult.failure !== undefined) {
          console.error(signedURLResult.failure);
          alert(signedURLResult.failure);
          return;
        }

        const url = signedURLResult.success.url;
        var response;
        response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": profilePicture.type,
          },
          body: profilePicture,
        });
      }

      console.log(response);
      const hashedPass = await bcrypt.hash(password, 5);
      if (typeof response === "undefined" || response?.status == 200) {
        const userData = {
          username: username,
          email: email,
          password: hashedPass,
          name: name,
          bio: bio,
          location: location,
          image: filename ?? null,
        };
        var body = JSON.stringify(userData);
        const { data } = await api.post(`/api/register`, body);

        if (data.status === 201) {
          const loginres = await LoginHelper({
            username,
            password,
          });
          if (loginres && loginres.ok) {
            setName("");
            setUsername("");
            setEmail("");
            setPassword("");
            setLocation("");
            setBio("");
            setConfirmPassword("");
            setProfilePicture(null);
            setProfilePicturePreview(null);
            setErrors({});
            router.push("/");
          }
        } else {
          setShowToast(true);
          toast.error(data.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      } else {
        alert(response?.status + " " + response?.statusText);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status other than 2xx
          alert(
            `Message: ${error.response.data.message || error.response.data}`
          );
        } else if (error.request) {
          // No response was received
          alert("No response received from server.");
        } else {
          // Something went wrong setting up the request
          alert(`Error setting up request: ${error.message}`);
        }
      } else {
        // Handle other errors
        alert(`Unexpected error: ${error.message}`);
      }
      console.error(error.message);
    }
    // Reset the form fields and errors
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center">
      {showtoast && (
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      )}
      <div className="max-w-xl w-full mx-5 my-24 md:m-28 p-6 bg-black rounded shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className=" w-fit mx-auto mb-4 items-center">
            <div className="mx-auto relative">
              {profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Profile Preview"
                  className="mt-2 w-32 h-32 object-fill object-center rounded-[50%]"
                />
              ) : (
                <>
                  <Image
                    className="mt-2 max-w-[8rem] relative object-cover cursor-pointer object-center rounded-[50%]"
                    src={defaultPic}
                    alt=" Default Profile Preview"
                  />
                  <label
                    className="w-full absolute bottom-0 overflow-hidden text-center text-white h-[25%] bg-[#000]/40 cursor-pointer hover:cursor-pointer"
                    htmlFor="profilePicture"
                  >
                    Browse
                  </label>
                </>
              )}

              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                className="w-full absolute bottom-0 overflow-hidden opacity-0"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-white text-sm font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className={`w-full px-3 py-2 border bg-inherit text-white rounded-md outline-none ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
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
                className={`w-full px-3 py-2 border bg-inherit text-white rounded-md outline-none ${
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
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-white text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-3 py-2 border bg-inherit text-white rounded-md outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-4 ">
              <label
                htmlFor="location"
                className="block text-white text-sm font-medium mb-2"
              >
                Location
              </label>
              <div className="relative">
                <input
                  id="location"
                  className={`w-full px-3 py-2 border bg-inherit text-white rounded-md outline-none ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="mb-4 ">
              <label
                htmlFor="password"
                className="block text-white text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full px-3 py-2 border bg-inherit text-white rounded-md outline-none ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute top-[30%] right-2 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeIcon className="h-5 w-5 text-white" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="mb-4 ">
              <label
                htmlFor="confirmPassword"
                className="block text-white text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className={`w-full px-3 py-2 border bg-inherit text-white rounded-md outline-none ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute top-[30%] right-2 focus:outline-none"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeIcon className="h-5 w-5 text-white" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4 ">
            <label
              htmlFor="bio"
              className="block text-white text-sm font-medium mb-2"
            >
              Bio
            </label>
            <div className="relative">
              <textarea
                id="bio"
                className={`w-full px-3 py-2 border bg-inherit text-white rounded-md outline-none ${
                  errors.bio ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="A little bit about you..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
            )}
          </div>

          <div className="w-full flex">
            <button
              type="submit"
              className="w-[40%] mx-auto bg-white text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
