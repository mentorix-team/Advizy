import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [query, setQuery] = useState('');

  const handleSearchChange = () => {
      query(setQuery)
  }
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-xl font-semibold text-gray-800">Expert Platform</h1>
        <div>
          <input type="text" placeholder="Search" />
        </div>
        <div className="flex space-x-6">
          <NavLink
            to="/"
            className="text-gray-600 hover:text-gray-800"
            activeClassName="font-semibold text-gray-900"
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className="text-gray-600 hover:text-gray-800"
            activeClassName="font-semibold text-gray-900"
          >
            Explore
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
