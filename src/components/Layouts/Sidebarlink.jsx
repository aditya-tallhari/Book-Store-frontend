import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarLink = ({ to, icon, text, open }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 py-2.5 px-4 text-gray-700 font-medium rounded-lg transition-all duration-300
                  ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'hover:bg-purple-50 hover:text-purple-700'}
                  ${!open && 'justify-center'}`}
    >
      <div className={`${open ? 'mr-0' : 'mr-auto'}`}>{icon}</div>
      {open && <span className="whitespace-pre">{text}</span>}
    </Link>
  );
};
