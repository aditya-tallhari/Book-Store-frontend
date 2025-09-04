import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserInformation,
  updateAddress,
  changePassword,
  deleteAccount,
} from "../lib/api/user"; // Import API functions
import { authActions } from "../store/auth"; // Import Redux actions
// import { Loader2, LogOut, UserCircle } from "lucide-react"; // For loading spinners
import { Loader2, LogOut, UserCircle, Settings, History } from "lucide-react";

import LoaderSVG from "../components/Loader/Loader";


export default function Setting() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // Address State
  const [address, setAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState(null);
  const [addressError, setAddressError] = useState(null);

  // Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  // Delete Account State
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);


  // Fetch User Information on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUser(true);
      setUserError(null);
      try {
        const data = await getUserInformation();
        setUserData(data);
        setAddress(data.address || ""); // Set initial address
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUserError(err.message || "Failed to load user information.");
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          dispatch(authActions.logout());
          navigate("/login");
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [dispatch, navigate]);

  // Handle Address Update
  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setLoadingAddress(true);
    setAddressError(null);
    setAddressSuccess(null);
    try {
      const response = await updateAddress(address);
      setAddressSuccess(response.message);
    } catch (err) {
      console.error("Error updating address:", err);
      setAddressError(err.message || "Failed to update address.");
    } finally {
      setLoadingAddress(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      setLoadingPassword(false);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      setLoadingPassword(false);
      return;
    }

    try {
      const response = await changePassword(oldPassword, newPassword);
      setPasswordSuccess(response.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordError(err.message || "Failed to change password.");
    } finally {
      setLoadingPassword(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

    setLoadingDelete(true);
    setDeleteError(null);
    try {
      await deleteAccount();
      alert("Account deleted successfully!"); // Use alert as per previous component style
      dispatch(authActions.logout()); // Log out user locally
      navigate("/signup"); // Redirect to signup or home page
    } catch (err) {
      console.error("Error deleting account:", err);
      setDeleteError(err.message || "Failed to delete account.");
    } finally {
      setLoadingDelete(false);
      setShowConfirmDelete(false); // Hide confirmation after attempt
    }
  };

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <LoaderSVG size={80} color="#6366F1" />
        <p className="mt-4 text-lg text-gray-700 text-center">Loading user data...</p>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-xl text-red-600 font-semibold">{userError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-xl text-gray-700">User data not found.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 md:py-16 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center">Account Settings</h1>

        {/* Profile Information Section */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserCircle size={24} className="text-indigo-500" /> Profile Information
          </h2>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-semibold">Username:</span> {userData.username}</p>
            <p><span className="font-semibold">Email:</span> {userData.email}</p>
            {userData.avatar && (
              <div className="flex items-center gap-4">
                <span className="font-semibold">Avatar:</span>
                <img src={userData.avatar} alt="User Avatar" className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm" />
              </div>
            )}
          </div>
        </div>

        {/* Update Address Section */}
        <div className="mb-10 p-6 bg-white rounded-xl border border-gray-200 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings size={24} className="text-purple-500" /> Update Address
          </h2>
          <form onSubmit={handleAddressUpdate} className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Your Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="Enter your new address"
                required
              />
            </div>
            {addressError && <p className="text-red-600 text-sm">{addressError}</p>}
            {addressSuccess && <p className="text-green-600 text-sm">{addressSuccess}</p>}
            <button
              type="submit"
              disabled={loadingAddress}
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingAddress && <Loader2 className="animate-spin w-5 h-5" />}
              {loadingAddress ? "Updating..." : "Update Address"}
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="mb-10 p-6 bg-white rounded-xl border border-gray-200 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <History size={24} className="text-blue-500" /> Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter old password"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Confirm new password"
                required
              />
            </div>
            {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}
            <button
              type="submit"
              disabled={loadingPassword}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingPassword && <Loader2 className="animate-spin w-5 h-5" />}
              {loadingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Delete Account Section */}
        <div className="p-6 bg-red-50 rounded-xl border border-red-200 shadow-md">
          <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
            <LogOut size={24} className="text-red-600" /> Delete Account
          </h2>
          <p className="text-red-700 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          {deleteError && <p className="text-red-600 text-sm mb-4">{deleteError}</p>}
          {!showConfirmDelete ? (
            <button
              onClick={handleDeleteAccount}
              disabled={loadingDelete}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader2 className={`w-5 h-5 ${loadingDelete ? 'animate-spin' : 'hidden'}`} />
              {loadingDelete ? "Deleting..." : "Delete Account"}
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={loadingDelete}
                className="flex-1 px-6 py-3 bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loadingDelete && <Loader2 className="animate-spin w-5 h-5" />}
                {loadingDelete ? "Confirming..." : "Confirm Delete"}
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={loadingDelete}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
