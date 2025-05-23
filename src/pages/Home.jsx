import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Menu from "../components/Menu";

const Home = () => {
  return (
    <div className="h-screen w-full overflow-hidden flex">
      <Menu />
      <div className="h-full pl-62 w-full bg-gray-100">
        <Header />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
