import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
    BookOpen, ShoppingCart, User, Menu, X, LogOut, 
    Shield, Mail, Info, Home, BookCopy, Library
} from "lucide-react";

import { logoutUser } from "../../lib/api/user"; 
import { authActions } from "../../store/auth"; 
import { toast } from "react-toastify";

// A more refined NavLink for the desktop view
const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link 
      to={to} 
      // Added 'group' to enable parent-based hover states on children
      className={`group relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
        isActive 
          ? 'text-white' 
          : 'text-slate-700 hover:text-white'
      }`}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Active link background animation */}
      {isActive && (
        <motion.div
          className="absolute inset-0 z-0 rounded-md bg-indigo-600"
          layoutId="active-nav-link"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
       
      {/* Hover background effect - fixed to respond to parent hover */}
       {!isActive && (
         <div
          className="absolute inset-0 z-0 rounded-md bg-indigo-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
       )}
    </Link>
  );
};

// Main Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const cartItemCount = useSelector((state) => state.cart?.data?.length || 0);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(authActions.logout());
      navigate("/");
      toast.success("You have been logged out.");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Centralized link definition for easier management
  const getNavLinks = () => {
    const allLinks = {
      home: { title: "Home", href: "/", icon: Home },
      allBooks: { title: "All Books", href: "/all-books", icon: BookCopy },
      about: { title: "About", href: "/about", icon: Info },
      contact: { title: "Contact", href: "/contact", icon: Mail },
      myLibrary: { title: "My Library", href: "/profile/my-library", icon: Library },
      adminPanel: { title: "Dashboard", href: "/profile", icon: Shield },
    };

    const guestLinks = [allLinks.home, allLinks.allBooks, allLinks.about, allLinks.contact];
    
    if (isLoggedIn) {
      if (role === 'admin') {
        return [allLinks.home, allLinks.allBooks, allLinks.about, allLinks.contact, allLinks.adminPanel];
      }
      return [allLinks.home, allLinks.allBooks, allLinks.myLibrary, allLinks.about, allLinks.contact];
    }
    return guestLinks;
  };
  
  const navLinks = getNavLinks();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex flex-shrink-0 items-center gap-2">
          <BookOpen className="h-7 w-7 text-indigo-600" />
          <h1 className="text-xl font-bold text-slate-900">BookStore</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((item) => (
            <NavLink key={item.href} to={item.href}>
              {item.title}
            </NavLink>
          ))}
        </div>

        {/* Right-side Actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {role === "user" && (
                <Link to="/cart" className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100" aria-label="View Cart">
                  <ShoppingCart size={20} />
                  {cartItemCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </Link>
              )}
              <Link to="/profile" className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100" aria-label="View Profile">
                {role === 'admin' ? <Shield size={20} /> : <User size={20} />}
              </Link>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <button onClick={handleLogout} className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white-700 transition-colors hover:bg-red-500 hover:text-white sm:flex">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="rounded-md px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">
                Login
              </Link>
              <Link to="/signup" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
                Sign Up
              </Link>
            </div>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-500 md:hidden" aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-x-0 top-full z-40 border-b border-slate-200 bg-white shadow-lg md:hidden"
          >
            <div className="flex flex-col space-y-1 p-2">
              {navLinks.map((item) => (
                <Link key={item.href} to={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100" onClick={() => setIsOpen(false)}>
                  <item.icon size={20} />
                  <span>{item.title}</span>
                </Link>
              ))}
              <div className="!mt-4 border-t border-slate-200 pt-3">
                {isLoggedIn ? (
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex w-full items-center justify-center gap-3 rounded-md bg-slate-100 py-2.5 text-base font-semibold text-slate-700">
                    <LogOut size={20} /> Logout
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login" className="flex-1 rounded-md py-2.5 text-center font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-100" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                    <Link to="/signup" className="flex-1 rounded-md bg-indigo-600 py-2.5 text-center font-semibold text-white hover:bg-indigo-700" onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

