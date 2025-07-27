// src/components/RouterLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";

const RouterLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let listener; // will hold the actual listener object

    const setupListener = async () => {
      listener = await CapacitorApp.addListener("backButton", () => {
        const currentPath = location.pathname;

        if (
          currentPath === "/home" ||
          currentPath === "/user_dashboard" ||
          currentPath === "/app-login"
        ) {
          CapacitorApp.exitApp();
        } else {
          navigate(-1);
        }
      });
    };

    setupListener();

    return () => {
      if (listener && typeof listener.remove === "function") {
        listener.remove();
      }
    };
  }, [location.pathname, navigate]);

  return <Outlet />;
};

export default RouterLayout;
