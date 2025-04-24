import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };
  return (
    <div>
      Home{" "}
      <button className="border border-gray-500" onClick={logoutHandler}>
        Logout
      </button>
    </div>
  );
};

export default Home;
