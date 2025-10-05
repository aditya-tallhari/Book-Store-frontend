import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth";
import { logoutUser } from "../../lib/api/user";
import {
  LogOut,
  Star,
  History,
  Settings,
  BookPlus,
  Package,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Home,
  ShoppingBag,
  BarChart3
} from "lucide-react";

/* Reusable Navigation Link Component */
const SidebarLink = ({ to, icon, text, badge, isActive, onClick }) => (
  <li className="nav-item">
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden ${
        isActive
          ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30"
          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
      }`}
    >
      <span className={`nav-icon transition-transform duration-200 ${isActive ? "text-white scale-110" : "text-gray-500 group-hover:text-indigo-600 group-hover:scale-110"}`}>
        {icon}
      </span>
      <span className="nav-text flex-1">{text}</span>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
          {badge}
        </span>
      )}
    </Link>
  </li>
);

/* Navigation Group Component */
const NavGroup = ({ icon, text, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <li className="nav-item">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all duration-200 group"
      >
        <span className="nav-icon text-gray-500 group-hover:text-indigo-600 transition-colors">{icon}</span>
        <span className="nav-text flex-1 text-left">{text}</span>
        <span className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={16} />
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
        <ul className="ml-6 space-y-1">
          {children}
        </ul>
      </div>
    </li>
  );
};

/* Dropdown Item Component */
const NavDropdownItem = ({ to, text, isActive, onClick }) => (
  <li className="nav-item">
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 py-2.5 px-4 text-sm rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-indigo-100 text-indigo-700 font-semibold"
          : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${isActive ? 'bg-indigo-600 scale-125' : 'bg-gray-400 group-hover:bg-indigo-600'}`}></span>
      <span className="nav-text">{text}</span>
    </Link>
  </li>
);

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const role = useSelector((state) => state.auth.role);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const avatarSrc = data?.avatar || "https://ui-avatars.com/api/?name=" + (data?.username || "User") + "&background=4f46e5&color=fff&size=128";

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed on server:", error);
    }
    dispatch(authActions.logout());
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* Modern Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-3.5 left-4 z-50 p-3 bg-white  transition-all duration-300 group hover:scale-105 active:scale-95"
      >
        <Menu size={22} className="text-gray-700 group-hover:text-indigo-600 transition-colors" />
      </button>

      {/* Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-out w-80 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Elegant Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Home size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">BookStore</h1>
                <p className="text-indigo-200 text-xs font-medium">Your Reading Hub</p>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 active:scale-95"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Enhanced User Profile Section */}
        <div className="p-5 border-b border-gray-100 from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-rrounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <img
                src={avatarSrc}
                alt={`${data?.username || "User"}'s avatar`}
                className="relative h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate">
                {data?.username || "Guest User"}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  role === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-1">
                {data?.email || "guest@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation with scroll */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <ul className="space-y-1.5">
            {/* Section Title */}
            <li className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Navigation
            </li>

            {/* User Navigation */}
            {role === 'user' && (
              <>
                <SidebarLink
                  to="/profile"
                  icon={<Star size={20} />}
                  text="My Favourites"
                  isActive={isActivePath('/profile')}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/profile/orderHistory"
                  icon={<History size={20} />}
                  text="Order History"
                  isActive={isActivePath('/profile/orderHistory')}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/profile/settings"
                  icon={<Settings size={20} />}
                  text="Account Settings"
                  isActive={isActivePath('/profile/settings')}
                  onClick={closeSidebar}
                />
              </>
            )}

            {/* Admin Navigation */}
            {role === 'admin' && (
              <>
                <SidebarLink
                  to="/profile"
                  icon={<BarChart3 size={20} />}
                  text="Dashboard"
                  isActive={isActivePath('/profile')}
                  onClick={closeSidebar}
                />
                
                <NavGroup
                  icon={<BookPlus size={20} />}
                  text="Book Management"
                  defaultOpen={location.pathname.includes('/profile/add-book') || location.pathname.includes('/profile/all-order') || location.pathname.includes('/profile/manage-books')}
                >
                  <NavDropdownItem
                    to="/profile/all-order"
                    text="All Orders"
                    isActive={isActivePath('/profile/all-order')}
                    onClick={closeSidebar}
                  />
                  <NavDropdownItem
                    to="/profile/add-book"
                    text="Add New Book"
                    isActive={isActivePath('/profile/add-book')}
                    onClick={closeSidebar}
                  />
                  <NavDropdownItem
                    to="/profile/manage-books"
                    text="Manage Books"
                    isActive={isActivePath('/profile/manage-books')}
                    onClick={closeSidebar}
                  />
                </NavGroup>

                <SidebarLink
                  to="/profile/analytics"
                  icon={<Package size={20} />}
                  text="Analytics & Reports"
                  isActive={isActivePath('/profile/analytics')}
                  onClick={closeSidebar}
                />
              </>
            )}
          </ul>
        </nav>

        {/* Modern Bottom Section */}
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <button
            className="w-full flex items-center gap-3 py-3.5 px-4 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group border-2 border-transparent hover:border-red-100 active:scale-95"
            onClick={handleLogout}
          >
            <span className="text-red-500 group-hover:text-red-700 transition-colors">
              <LogOut size={20} />
            </span>
            <span className="flex-1 text-left">Sign Out</span>
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;