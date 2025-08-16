import React, { useEffect, useState } from "react";
import Sidebar from "../components/Layouts/Sidebar"; // Assuming this path is correct
import { Outlet } from "react-router-dom"; // From react-router-dom
import { useSelector } from "react-redux"; // From react-redux
import axios from "axios"; // Assuming axios is installed and configured
import LoaderSVG from "../components/Loader/Loader"; // Assuming this path is correct and it renders an SVG loader

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorFetchingProfile, setErrorFetchingProfile] = useState(null);

  // Using the mock useSelector
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const headers = {
    id: localStorage.getItem("id") || "mock-user-id", // Provide a fallback for mock
    authorization: `Bearer ${localStorage.getItem("token") || "mock-auth-token"}`, // Provide a fallback for mock
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoadingProfile(true);
      setErrorFetchingProfile(null);
      try {
        const response = await axios.get(
          "http://localhost:5002/api/auth/get-user-information",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 px-4 md:px-8 flex flex-col md:flex-row py-6 md:py-8 gap-6 md:gap-8 text-gray-900 font-inter">
      {loadingProfile ? (
        <div className="w-full flex items-center justify-center min-h-[calc(100vh-theme(spacing.12))]">
          <LoaderSVG className="text-gray-700" />
          <p className="ml-4 text-xl text-gray-700">Loading Profile...</p>
        </div>
      ) : errorFetchingProfile ? (
        <div className="w-full flex items-center justify-center flex-col min-h-[calc(100vh-theme(spacing.12))] text-red-600">
          <p className="text-2xl font-bold mb-4">Oops! Something went wrong.</p>
          <p className="text-lg">{errorFetchingProfile}</p>
        </div>
      ) : (
        <>
          <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
            <Sidebar data={profile} />
          </aside>
          <main className="flex-1 overflow-y-auto bg-white rounded-xl shadow-2xl p-4 md:p-6 lg:p-8 border border-gray-200">
            <Outlet />
          </main>
        </>
      )}
    </div>
  );
};

export default Profile;

