import React from "react";
import { NavLink } from "react-router-dom";

const linkClasses =
  "text-white text-center px-4 py-2 rounded-lg block w-full font-semibold";
const Menu = () => {
  return (
    <div className="fixed h-full w-62 bg-gray-800 text-white p-4 px-5 flex flex-col items-center ">
      <div className="w-20 h-20">
        <img className="w-full h-full" src="/img/logo.png" alt="logo img" />
      </div>
      <nav className="flex flex-col mt-6 w-full gap-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-600" : "hover:bg-gray-700"}`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/category"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-600" : "hover:bg-gray-700"}`
          }
        >
          Category
        </NavLink>
        <NavLink
          to="/discount"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-600" : "hover:bg-gray-700"}`
          }
        >
          Discount
        </NavLink>
        <NavLink
          to="/sizes"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-600" : "hover:bg-gray-700"}`
          }
        >
          Sizes
        </NavLink>
        <NavLink
          to="/colors"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-600" : "hover:bg-gray-700"}`
          }
        >
          Colors
        </NavLink>
        <NavLink
          to="/faq"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-600" : "hover:bg-gray-700"}`
          }
        >
          Faq
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-600" : "hover:bg-gray-700"}`
          }
        >
          Contact
        </NavLink>
        <NavLink
          to="/team-members"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-600" : "hover:bg-gray-700"}`
          }
        >
          Team
        </NavLink>
        <NavLink
          to="/news"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "bg-green-600" : "hover:bg-gray-700"}`
          }
        >
          News
        </NavLink>
      </nav>
    </div>
  );
};

export default Menu;
