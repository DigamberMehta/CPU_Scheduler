import React from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/authContext";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Outlet />
      </AuthProvider>
    </>
  );
};

export default App;
