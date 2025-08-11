import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "./utils/tokenService"; // Adjust the path as needed
import { isNativeApp } from "./utils/isNativeApp"; // Adjust the import path as necessary

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {

    const handleLogout = async () => {
      await removeToken();
      if (isNativeApp) {
        navigate("/app-login", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    };

    handleLogout();
  }, [navigate]);

  return null;
};

export default Logout;
