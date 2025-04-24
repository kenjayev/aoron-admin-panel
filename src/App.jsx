import "./App.css";
import { ToastContainer } from "react-toastify";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");
  useEffect(() => {
    if (!access_token) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={access_token ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/"
          element={access_token ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;
