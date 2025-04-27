import { ToastContainer } from "react-toastify";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import {
  Category,
  Colors,
  Contact,
  Discount,
  Faq,
  News,
  Products,
  Sizes,
  Team,
} from "./pages";

function App() {
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!access_token) {
      navigate("/login");
    }
  }, [access_token, navigate]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={access_token ? <Navigate to="/" replace /> : <Login />}
        />

        {access_token && (
          <Route path="/" element={<Home />}>
            <Route index element={<Products />} />
            <Route path="/category" element={<Category />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/sizes" element={<Sizes />} />
            <Route path="/colors" element={<Colors />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/team-members" element={<Team />} />
            <Route path="/news" element={<News />} />
          </Route>
        )}

        {!access_token && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </>
  );
}

export default App;
