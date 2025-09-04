import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth"; // ✅ import Redux actions
import { logoutUser } from "../../lib/api/user";
import {
  LogOut,
  Star,
  History,
  UserCircle,
  Settings,
} from "lucide-react"; // Icons

/* Reusable Navigation Link Component */
const SidebarLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center gap-3 py-2.5 px-4 text-gray-700 font-medium bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-purple-700 border border-transparent hover:border-purple-200 transition-all duration-300"
  >
    {icon}
    {text}
  </Link>
);

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role=useSelector((state)=>state.auth.role)

  const avatarSrc =
    data?.avatar || "https://placehold.co/150x150/E5E7EB/4B5563?text=User";

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call API
    } catch (error) {
      console.error("Logout failed on server:", error);
      // We still log out locally even if server fails
    }
    dispatch(authActions.logout()); // Clear Redux + localStorage
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center border border-gray-200 w-full max-w-xs mx-auto transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
      {/* Avatar */}
      <img
        src={avatarSrc}
        alt={`${data?.username || "User"}'s avatar`}
        className="h-28 w-28 rounded-full border-4 border-purple-500 object-cover shadow-md mb-4 transition-transform duration-300 hover:scale-105"
      />

      {/* User Info */}
      <h2 className="mt-2 text-xl font-semibold text-gray-900 text-center">
        {data?.username || "Guest"}
      </h2>
      <p className="text-sm text-gray-500 text-center">{data?.email || ""}</p>

      {/* Divider */}
      <div className="w-full h-px bg-gray-200 my-6"></div>

      {/* Navigation */}
      {role==='user' && (<nav className="flex flex-col w-full gap-2">
        <SidebarLink to="/profile" icon={<Star size={20} />} text="Favourites" />
        <SidebarLink to="/profile/orderHistory" icon={<History size={20} />} text="Order History" />
        <SidebarLink to="/profile/settings" icon={<Settings size={20} />} text="Settings" />
      </nav>)}

      {role==='admin' && (<nav className="flex flex-col w-full gap-2">
        <SidebarLink to="/profile" icon={<Star size={20} />} text="All Orders" />
        <SidebarLink to="/profile/add-book" icon={<History size={20} />} text="Add Book" />
      </nav>)}

      {/* Log Out Button */}
      <button
        className="mt-8 w-full flex items-center justify-center gap-3 py-3 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition-all duration-300"
        onClick={handleLogout}
      >
        Log Out
        <LogOut size={20} />
      </button>
    </div>
  );
};

export default Sidebar;
