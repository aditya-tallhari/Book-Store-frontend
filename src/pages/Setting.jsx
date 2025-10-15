import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserInformation,
  updateAddress,
  changePassword,
  deleteAccount,
} from "../lib/api/user";
import { authActions } from "../store/auth";
import {
  Loader2,
  User,
  Mail,
  MapPin,
  Lock,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  Trash2,
} from "lucide-react";
import LoaderSVG from "../components/Loader/Loader";
import { toast } from "react-toastify";

export default function Setting() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  // Address State
  const [address, setAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete Account State
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    // In Setting.jsx, update the fetchUserData function:
    const fetchUserData = async () => {
      setLoadingUser(true);
      setUserError(null);
      try {
        const data = await getUserInformation();
        // Check if data has a user property and use that instead
        const userData = data.user || data;
        setUserData(userData);
        setAddress(userData.address || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
        const errorMessage = err.message || "Failed to load user information.";
        setUserError(errorMessage);
        toast.error(errorMessage);
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

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setLoadingAddress(true);
    try {
      const response = await updateAddress(address);
      toast.success(response.message);
    } catch (err) {
      console.error("Error updating address:", err);
      const errorMessage = err.message || "Failed to update address.";
      toast.error(errorMessage);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      setLoadingPassword(false);
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      setLoadingPassword(false);
      return;
    }

    try {
      const response = await changePassword(oldPassword, newPassword);
      toast.success(response.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error("Error changing password:", err);
      const errorMessage = err.message || "Failed to change password.";
      toast.error(errorMessage);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

    setLoadingDelete(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully!");
      dispatch(authActions.logout());
      navigate("/signup");
    } catch (err) {
      console.error("Error deleting account:", err);
      const errorMessage = err.message || "Failed to delete account.";
      toast.error(errorMessage);
    } finally {
      setLoadingDelete(false);
      setShowConfirmDelete(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-screen bg-gray-50">
        <LoaderSVG size={80} color="#6366F1" />
        <p className="mt-4 text-lg text-gray-600">Loading your settings...</p>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-screen bg-gray-50">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <p className="text-xl text-gray-900 font-semibold mb-2">
            Oops! Something went wrong
          </p>
          <p className="text-gray-600 mb-6">{userError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-screen bg-gray-50">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-lg">
          <p className="text-xl text-gray-700">User data not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account preferences and security
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm  overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-24"></div>
            <div className="px-6 pb-6">
              <div className="flex items-end space-x-5 -mt-12">
                <div className="relative">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-2xl  object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24  border-4  flex items-center justify-center shadow-lg">
                      <User className="text-indigo-600" size={40} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-15">
                  <h2 className="text-2xl font-bold text-gray-900 truncate">
                    {userData.username}
                  </h2>
                  <p className="text-gray-500 flex items-center gap-2 mt-1">
                    <Mail size={16} />
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <MapPin className="text-indigo-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delivery Address
                </h3>
                <p className="text-sm text-gray-500">
                  Update your default shipping address
                </p>
              </div>
            </div>

            <form onSubmit={handleAddressUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                  placeholder="Enter your complete address"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loadingAddress}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingAddress ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Address
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Lock className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Change Password
                </h3>
                <p className="text-sm text-gray-500">
                  Keep your account secure
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmNewPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmNewPassword"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingPassword}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingPassword ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Changing...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Danger Zone
                </h3>
                <p className="text-sm text-gray-500">Irreversible actions</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> Deleting your account will permanently
                remove all your data, including orders, favorites, and personal
                information. This action cannot be undone.
              </p>
            </div>

            {!showConfirmDelete ? (
              <button
                onClick={handleDeleteAccount}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
              >
                <Trash2 size={20} />
                Delete My Account
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900">
                  Are you absolutely sure? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loadingDelete}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white font-medium rounded-xl hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                  >
                    {loadingDelete ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={20} />
                        Yes, Delete Forever
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    disabled={loadingDelete}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
