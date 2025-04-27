import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };
  return (
    <div className="w-full flex mt-4 mr-6 py-2 flex justify-end bg-gray sticky top-0 z-10">
      <button
        className="cursor-pointer mr-7 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        onClick={logoutHandler}
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
