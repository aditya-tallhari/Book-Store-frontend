import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const location = useLocation();

  const allLinks = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
    { title: "Explore", link: "/explore" },
    { title: "Shop", link: "/shop" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
  ];

  let filteredLinks = [...allLinks];

  if (!isLoggedIn) {
    filteredLinks = filteredLinks.filter(item => 
      item.title !== "Cart" && 
      item.title !== "Profile" && 
      item.title !== "Admin Profile"
    );
  } else if (role === "admin") {
    // If user is an admin, show all links except regular 'Profile'
    filteredLinks = filteredLinks.filter(item => item.title !== "Profile");
    filteredLinks.push({ title: "Admin Profile", link: "/profile" }); // Add specific admin profile link
  } else if (role === "user") {
    // If user is a regular user, show all links
    filteredLinks = filteredLinks.filter(item => item.title !== "Admin Profile");
  }

  const isActiveLink = (link) => location.pathname === link;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="logo"
            className="h-10"
          />
          <h1 className="text-2xl font-bold text-gray-900">BookStore</h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {filteredLinks.map((item, i) =>
            item.title === "Profile" || item.title === "Admin Profile" ? (
              <Link
                to={item.link}
                key={i}
                className="flex items-center gap-2 px-3 py-1 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                  alt="avatar"
                  className="w-6 h-6 rounded-full border border-indigo-600"
                />
                <span>{item.title}</span>
              </Link>
            ) : item.title === "Cart" ? (
              <div key={i} className="relative">
                <Link
                  to={item.link}
                  className={`transition ${isActiveLink(item.link) ? 'text-indigo-600' : 'hover:text-indigo-600'}`}
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    2
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                to={item.link}
                key={i}
                className={`transition font-medium ${
                  isActiveLink(item.link)
                    ? 'text-indigo-600'
                    : 'hover:text-indigo-600'
                }`}
              >
                {item.title}
              </Link>
            )
          )}
          {/* Auth Buttons */}
          {!isLoggedIn && (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
        >
          {isOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>
      {/* Mobile Dropdown */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 },
        }}
        className="md:hidden bg-gray-50 overflow-hidden shadow-inner"
      >
        {filteredLinks.map((item, i) => (
          <Link
            key={i}
            to={item.link}
            className={`block px-4 py-3 border-b border-gray-200 ${
              isActiveLink(item.link)
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setIsOpen(false)}
          >
            {item.title}
          </Link>
        ))}
        {!isLoggedIn && (
          <div className="flex flex-col gap-2 px-4 py-3">
            <Link
              to="/login"
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-center hover:bg-indigo-600 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </motion.div>
    </nav>
  );
};

export default Navbar;