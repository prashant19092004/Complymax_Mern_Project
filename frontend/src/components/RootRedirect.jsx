// src/components/RootRedirect.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/tokenService"; // Adjust the import path as necessary
import { isNativeApp } from "../utils/isNativeApp";

const RootRedirect = () => {
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const checkRedirect = async () => {
      if (isNativeApp) {
        const token = await getToken();
        setRedirectTo(token ? "/user_dashboard" : "/app-login");
      } else {
        setRedirectTo("/home");
      }
    };

    checkRedirect();
  }, []);

  if (!redirectTo) return <div>Loading...</div>;

  return <Navigate to={redirectTo} replace />;
};

export default RootRedirect;
