import React, { useEffect, useState } from "react";
import Sidebar from "../components/Layouts/Sidebar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import LoaderSVG from "../components/Loader/Loader";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorFetchingProfile, setErrorFetchingProfile] = useState(null);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const headers = {
    id: localStorage.getItem("id") || "mock-user-id",
    authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`,
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoadingProfile(true);
      setErrorFetchingProfile(null);
      try {
        const response = await axios.get(
          "https://book-store-backend-project.vercel.app/api/auth/get-user-information",
          { headers }
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setErrorFetchingProfile("Failed to load profile. Please try again.");
        setProfile({
          username: "Guest User",
          email: "guest@example.com",
          avatar: "https://placehold.co/150x150/EF4444/FFFFFF?text=Error",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserInfo();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {loadingProfile ? (
        <div className="w-full flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
            <LoaderSVG className="text-blue-600 mb-4" />
            <p className="text-xl text-gray-700 font-medium">Loading your profile...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
          </div>
        </div>
      ) : errorFetchingProfile ? (
        <div className="w-full flex items-center justify-center min-h-screen p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{errorFetchingProfile}</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Try Again
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Sidebar Component with Hamburger Menu */}
          <Sidebar data={profile} />
          
          {/* Main Content Area */}
          <main className="min-h-screen relative z-10">
            {/* Top Bar Space for Hamburger Menu */}
            <div className="h-16"></div>
            
            {/* Content Container */}
            <div className="p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[calc(100vh-8rem)] overflow-hidden">
                  {/* Content Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Welcome back, {profile?.username || "User"}!
                        </h1>
                        <p className="text-gray-600 mt-1">
                          Manage your account and explore your dashboard
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="p-6">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default Profile;