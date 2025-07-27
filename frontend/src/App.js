import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./AppRouter"; // Import your routes

function App() {
  return <RouterProvider router={router} />;
}

export default App;
