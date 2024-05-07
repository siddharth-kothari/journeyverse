import React from "react";
import type { Metadata } from "next";
import { getProviders } from "next-auth/react";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact | JourneryVerse",
  description: "Generated by create next app",
};

const ContactPage = async () => {
  return (
    <div>
      <Contact />
    </div>
  );
};

export default ContactPage;
