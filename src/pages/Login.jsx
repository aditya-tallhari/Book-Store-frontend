// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { loginUser } from "../lib/api/user";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const credentials = { email: emailOrUsername, password };

    try {
      const res = await loginUser(credentials);
      if (res?.success) {
        localStorage.setItem("id", res.id);
        localStorage.setItem("role", res.role);
        localStorage.setItem("token", res.token);

        dispatch(
          authActions.login({
            id: res.id,
            role: res.role,
            token: res.token,
          })
        );

        dispatch(authActions.changeRole(res.role));
        toast.success("Login successful! Welcome back.");
        navigate("/");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 via-purple-300 to-purple-100 px-4 py-8">
      <div className="w-full max-w-6xl flex items-center gap-12">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <div className="max-w-lg">
            <img
              src="/Bookshop-bro.svg"
              alt="Bookshop illustration"
              className="w-200 h-auto drop-shadow-5xl "
            />
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-10">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Hello,<br />Good Morning
              </h2>
              <p className="text-gray-500 text-sm">Login your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username/Email Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                    placeholder="Username"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg transition-all font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Create Account Link */}
            <div className="text-center mt-6">
              <Link
                to="/signup"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;