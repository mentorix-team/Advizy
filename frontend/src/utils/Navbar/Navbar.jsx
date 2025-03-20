import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [query, setQuery] = useState('');

  const handleSearchChange = () => {
      query(setQuery)
  }
  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Sidebar Toggle Button for Mobile */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-800 hover:bg-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <h1 className="text-xl font-semibold text-gray-800">Expert Platform</h1>

          {/* Search Input */}
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 px-3 py-1 rounded-md"
            />
          </div>

          {/* Navigation Links (Desktop View) */}
          <div className="hidden lg:flex space-x-6">
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

      {/* Sidebar (Hidden on Desktop, Togglable on Mobile) */}
      {/* <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-800" />
          </button>
        </div>
        <nav className="p-4 space-y-4">
          <NavLink to="/dashboard/expert" className="block text-gray-700 hover:text-gray-900">
            Home
          </NavLink>
          <NavLink to="/dashboard/expert/availability" className="block text-gray-700 hover:text-gray-900">
            Availability
          </NavLink>
          <NavLink to="/dashboard/expert/service-pricing" className="block text-gray-700 hover:text-gray-900">
            Pricing & Services
          </NavLink>
          <NavLink to="/dashboard/expert/meetings" className="block text-gray-700 hover:text-gray-900">
            Meetings
          </NavLink>
        </nav>
      </aside> */}

      {/* Sidebar Overlay (Closes Sidebar When Clicked) */}
      {/* {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )} */}
    </div>
  );
};

export default Navbar;
