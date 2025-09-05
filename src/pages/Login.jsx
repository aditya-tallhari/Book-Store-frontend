import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { loginUser } from "../lib/api/user";
import LoaderSVG from "../components/Loader/Loader"; // ✅ Import your Loader
import { toast } from "react-toastify"; // Import toast

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
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
        // Save to localStorage
        localStorage.setItem("id", res.id);
        localStorage.setItem("role", res.role);
        localStorage.setItem("token", res.token);

        // Dispatch login action with actual values from res
        dispatch(
          authActions.login({
            id: res.id,
            role: res.role,
            token: res.token,
          })
        );

        dispatch(authActions.changeRole(res.role));
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Sign in to your account
        </p>

        {/* Google Login */}
        <button
          type="button"
          className="w-full mt-6 flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition"
        >
          <img
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-600 text-sm font-medium">
            Sign in with Google
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email/Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
              placeholder="Enter your email or username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
              placeholder="Enter your password"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="w-4 h-4" /> Remember me
            </label>
            <a href="#" className="text-indigo-500 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition font-medium flex items-center justify-center"
          >
            {loading ? <LoaderSVG size={20} color="#fff" /> : "Sign In"}
          </button>
        </form>

        {/* Signup link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
