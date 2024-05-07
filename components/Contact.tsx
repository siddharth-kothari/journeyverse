"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "@/app/api";

const Contact = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showtoast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const router = useRouter();

  interface Errors {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    message?: string;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate form fields
    const validationErrors: Errors = {};
    if (firstname.trim() === "") {
      validationErrors.firstname = "First Name is required";
    }
    if (lastname.trim() === "") {
      validationErrors.lastname = "Last Name is required";
    }
    if (email.trim() === "") {
      validationErrors.email = "Email is required";
    }
    if (phone.trim() === "") {
      validationErrors.phone = "Phone number is required";
    }
    if (message.trim() === "") {
      validationErrors.message = "Message is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Process the form submission logic here
    // console.log('Name:', name);
    // console.log('Username:', username);
    // console.log('Email:', email);
    // console.log('Password:', password);
    // console.log('Profile Picture:', profilePicture);

    try {
      const userData = {
        data: {
          firstname,
          lastname,
          email,
          phone_number: phone,
          message,
        },
      };

      const body = JSON.stringify(userData);

      const { data: contactData } = await api.post(
        "http://localhost:1337/api/contacts/",
        body
      );

      if (contactData.data != null) {
        setFirstname("");
        setLastname("");
        setEmail("");
        setPhone("");
        setMessage("");
        setErrors({});
        setShowToast(true);
        toast.success("Message sent successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        setTimeout(() => {
          router.push("/");
        }, 2500);
      } else {
        setFirstname("");
        setLastname("");
        setEmail("");
        setPhone("");
        setMessage("");
        setErrors({});
        setShowToast(true);
        toast.error("Something went wrong!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }

      // } else {
      //   return null
      // }
    } catch (error) {
      alert(error);
    }

    // Reset the form fields and errors
  };

  return (
    <div className="md:w-[60%] mx-auto my-12">
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
      <div className="text-center mb-10">
        <p className="text-3xl md:text-4xl font-serif font-bold leading-10">
          Contact Us
        </p>
        <p className="md:text-lg text-gray-500 font-serif leading-10 mt-4">
          Any question or remarks? Just write us a message!
        </p>
      </div>

      <div className="w-full block md:flex md:gap-3 bg-white rounded-xl p-2">
        <div className="md:w-[35%] bg-black rounded-xl p-7">
          <p className="text-2xl font-semibold leading-10 text-white">
            Contact Information
          </p>
          <p className=" text-white leading-6 mt-4">
            Fill up the form and we will get back to you.
          </p>

          <div className="my-10">
            <div className="flex gap-2 items-center my-3">
              <EnvelopeIcon className="text-white w-6 h-6" />
              <Link
                href="mailto:support@journeyverse.site"
                className="text-white md:text-lg"
              >
                support@journeyverse.site
              </Link>
            </div>
            <div className="flex gap-2 items-center my-3">
              <PhoneIcon className="text-white w-6 h-6" />
              <Link href="tel:+918208567642" className="text-white md:text-lg">
                +91 82085 67642
              </Link>
            </div>
          </div>
        </div>

        <div className="md:w-[65%] p-7">
          <form onSubmit={handleSubmit}>
            <div className="block md:flex md:justify-between md:items-center md:gap-8">
              <div className="mb-4 w-full">
                <label
                  htmlFor="firstname"
                  className="block text-black text-sm font-medium mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  className={`w-full p-2 border-b bg-inherit text-black outline-none ${
                    errors.firstname ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your first name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                {errors.firstname && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstname}
                  </p>
                )}
              </div>
              <div className="mb-4 w-full">
                <label
                  htmlFor="lastname"
                  className="block text-black text-sm font-medium mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  className={`w-full p-2 border-b bg-inherit text-black outline-none ${
                    errors.lastname ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your last name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
                {errors.lastname && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
                )}
              </div>
            </div>
            <div className="block md:flex md:justify-between md:items-center md:gap-8">
              <div className="mb-4 w-full">
                <label
                  htmlFor="email"
                  className="block text-black text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full p-2 border-b bg-inherit text-black outline-none ${
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
              <div className="mb-4 w-full">
                <label
                  htmlFor="phone"
                  className="block text-black text-sm font-medium mb-2"
                >
                  Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    className={`w-full p-2 border-b bg-inherit text-black outline-none ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="mb-4 ">
              <label
                htmlFor="message"
                className="block text-black text-sm font-medium mb-2"
              >
                Message
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  className={`w-full p-2 border-b bg-inherit text-black outline-none ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Write your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <div className="w-full flex">
              <button
                type="submit"
                className="w-[50%] md:w-[30%] mx-auto bg-black text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
