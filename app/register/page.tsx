import React from "react";
import type { Metadata } from "next";
import Register from "@/components/register";

export const metadata: Metadata = {
  title: "Register | Blog Site",
  description: "Generated by create next app",
};

const SignUp = () => {
  return (
    <div>
      <Register />
    </div>
  );
};

export default SignUp;
