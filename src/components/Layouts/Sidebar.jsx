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
  Home
} from "lucide-react";

/* Reusable Navigation Link Component */
const SidebarLink = ({ to, icon, text, badge, isActive, onClick }) => (
  <li className="nav-item">
    <Link
      to={to}
      onClick={onClick}
      className={`nav-link flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 relative group ${
        isActive
          ? "bg-blue-600 text-white shadow-lg"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
      }`}
    >
      <span className={`nav-icon ${isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"}`}>
        {icon}
      </span>
      <span className="nav-text">{text}</span>
      {badge && (
        <span className="badge bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto font-medium">
          {badge}
        </span>
      )}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
      )}
    </Link>
  </li>
);

/* Navigation Group Component */
const NavGroup = ({ icon, text, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <li className="nav-item nav-group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="nav-link nav-group-toggle w-full flex items-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
      >
        <span className="nav-icon text-gray-500">{icon}</span>
        <span className="nav-text flex-1 text-left">{text}</span>
        <span className="nav-icon text-gray-400 transition-transform duration-200">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="nav-group-items ml-6 mt-2 space-y-1">
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
      className={`nav-link flex items-center gap-3 py-2.5 px-3 text-sm rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-100 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
      }`}
    >
      <span className="nav-icon">
        <span className={`nav-icon-bullet w-2 h-2 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-400'}`}></span>
      </span>
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

  const avatarSrc = data?.avatar || "https://placehold.co/40x40/3B82F6/FFFFFF?text=U";

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
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 group"
      >
        <Menu size={20} className="text-gray-700 group-hover:text-blue-600" />
      </button>

      {/* Blur Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out w-72 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header bg-gradient-to-r from-blue-600 to-blue-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Home size={18} className="text-blue-600" />
              </div>
              <div className="sidebar-brand text-xl font-bold text-white">
                BookStore
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="p-1 hover:bg-blue-800 rounded-md transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={avatarSrc}
                alt={`${data?.username || "User"}'s avatar`}
                className="h-12 w-12 rounded-full border-2 border-blue-200 object-cover shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {data?.username || "Guest User"}
              </h3>
              <p className="text-xs text-blue-600 truncate font-medium">
                {role === 'admin' ? 'Administrator' : 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {data?.email || "guest@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav flex-1 overflow-y-auto">
          <div className="p-4">
            <ul className="space-y-2">
              {/* Navigation Title */}
              <li className="nav-title text-xs font-semibold text-gray-400 uppercase tracking-wider py-2 px-2">
                Main Navigation
              </li>

              {/* User Navigation */}
              {role === 'user' && (
                <>
                  <SidebarLink
                    to="/profile"
                    icon={<Star size={18} />}
                    text="My Favourites"
                    isActive={isActivePath('/profile')}
                    onClick={closeSidebar}
                  />
                  <SidebarLink
                    to="/profile/orderHistory"
                    icon={<History size={18} />}
                    text="Order History"
                    isActive={isActivePath('/profile/orderHistory')}
                    onClick={closeSidebar}
                  />
                  <SidebarLink
                    to="/profile/settings"
                    icon={<Settings size={18} />}
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
                    icon={<Package size={18} />}
                    text="All Orders"
                    badge="12"
                    isActive={isActivePath('/profile')}
                    onClick={closeSidebar}
                  />
                  
                  <NavGroup
                    icon={<BookPlus size={18} />}
                    text="Book Management"
                    defaultOpen={location.pathname.includes('/profile/add-book')}
                  >
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
                    icon={<Settings size={18} />}
                    text="Analytics & Reports"
                    isActive={isActivePath('/profile/analytics')}
                    onClick={closeSidebar}
                  />
                </>
              )}
            </ul>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            className="w-full flex items-center gap-3 py-3 px-4 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group border border-transparent hover:border-red-200"
            onClick={handleLogout}
          >
            <span className="nav-icon text-red-500 group-hover:text-red-700">
              <LogOut size={18} />
            </span>
            <span className="nav-text">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;