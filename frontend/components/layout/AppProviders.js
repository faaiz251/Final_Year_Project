"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../../context/AuthContext";

export default function AppProviders({ children }) {
  return (
    <>
      <Toaster position="bottom-left" />
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}

