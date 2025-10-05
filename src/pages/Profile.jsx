// ============================================
// PROFILE COMPONENT WITH ENHANCED UI (Role-Based)
// ============================================

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Layouts/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoaderSVG from "../components/Loader/Loader";
import { getUserInformation } from "../lib/api/user";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorFetchingProfile, setErrorFetchingProfile] = useState(null);
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoadingProfile(true);
      setErrorFetchingProfile(null);
      try {
        const response = await getUserInformation();
        if (response.success && response.user) {
          setProfile(response.user);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setErrorFetchingProfile("Failed to load profile. Please try again.");
        setProfile({
          username: "Guest User",
          email: "guest@example.com",
          avatar: "https://placehold.co/150x150/EF4444/FFFFFF?text=Error",
          role: "user",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserInfo();
  }, [isLoggedIn]);

  // ========== LOADING STATE ==========
  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoaderSVG className="text-blue-600 mb-4" />
          <p className="text-lg text-gray-700 font-medium">Loading your profile...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // ========== ERROR STATE ==========
  if (errorFetchingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{errorFetchingProfile}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== MAIN UI ==========
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar data={profile} />

      {/* Main Section */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section - closer to top */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back, {profile?.username || "User"} 👋
            </h1>
            <p className="text-gray-600 mt-1 text-base">
              Manage your account and explore your dashboard insights
            </p>
          </div>

          {/* Stats Section - Subtle cards */}
          {profile?.role === "user" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Total Orders */}
              <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 flex items-center gap-4 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {profile?.orders?.length || 0}
                  </p>
                </div>
              </div>

              {/* Favourites */}
              <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 flex items-center gap-4 border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Favourites</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {profile?.favourites?.length || 0}
                  </p>
                </div>
              </div>

              {/* Cart */}
              <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 flex items-center gap-4 border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cart Items</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {profile?.cart?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Outlet Content */}
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[400px] border border-gray-100">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
