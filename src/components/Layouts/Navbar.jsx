import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- Navbar Component ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const links = [
    {
      title: "Home",
      link: "/", // Using anchor links for internal navigation
    },
    {
      title: "All Books",
      link: "/all-books",
    },
    {
      title: "Explore",
      link: "/explore",
    },
    {
      title: "Shop",
      link: "/shop",
    },
    {
      title: "Cart",
      link: "/cart",
    },
    {
      title: "Profile",
      link: "/profile",
    },
  ];

  return (
    <nav className="bg-white text-gray-800 px-4 py-4 md:px-8 items-center justify-between border-b border-gray-200 shadow-md sticky top-0 z-50"> {/* Added sticky and z-index */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <a href="#home" className="flex items-center">
          <img
            className="h-10 me-4"
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="logo"
          />
          <h1 className="text-2xl font-semibold text-gray-900">BookHeaven</h1>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8"> {/* Increased gap for desktop */}
          <div className="flex gap-4">
            {links.map((item, i) => (
              <a
                key={i}
                href={item.link}
                className="text-gray-600 hover:text-indigo-700 transition-all duration-300 text-base font-medium uppercase tracking-wide"
              >
                {item.title}
              </a>
            ))}
          </div>

          {/* Cart Icon with Badge */}
          <div className="relative">
            <a href="#cart" className="text-gray-600 hover:text-gray-900 transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13H5.4M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                2
              </span>
            </a>
          </div>

          {/* Login/Signup Buttons */}
          <div className="flex gap-3 lg:gap-4"> {/* Adjusted gap for desktop */}
            <a href="#login" className="px-5 py-2 border border-indigo-700 text-indigo-700 rounded-lg hover:bg-indigo-700 hover:text-white transition-all duration-300 font-semibold">Login</a>
            <a href="#signup" className="px-5 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-all duration-300 font-semibold">Sign Up</a>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto", transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
          closed: { opacity: 0, height: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
        }}
        className="md:hidden mt-4 space-y-2 bg-gray-50 rounded-md shadow-inner py-2 overflow-hidden" // Added overflow-hidden
      >
        {links.map((item, i) => (
          <motion.a
            key={i}
            href={item.link}
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md text-base"
            variants={{
              open: { y: 0, opacity: 1 },
              closed: { y: -20, opacity: 0 }
            }}
            onClick={() => setIsOpen(false)} // Close menu on link click
          >
            {item.title}
          </motion.a>
        ))}
        <motion.div
          className="flex flex-col space-y-2 px-4 py-2"
          variants={{
            open: { y: 0, opacity: 1, transition: { delay: 0.3 } },
            closed: { y: -20, opacity: 0 }
          }}
        >
          <a href="#login" className="px-4 py-2 border border-indigo-700 text-indigo-700 rounded-lg text-center hover:bg-indigo-700 hover:text-white transition-all duration-300 font-semibold">Login</a>
          <a href="#signup" className="px-4 py-2 bg-indigo-700 text-white rounded-lg text-center hover:bg-indigo-800 transition-all duration-300 font-semibold">Sign Up</a>
        </motion.div>
      </motion.div>
    </nav>
  );
};

export default Navbar;