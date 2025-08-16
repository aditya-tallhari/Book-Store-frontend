// src/store/auth.js
import { createSlice } from "@reduxjs/toolkit";

const storedAuth = JSON.parse(localStorage.getItem("auth")) || {
  isLoggedIn: false,
  id: null,
  role: "user",
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: storedAuth,
  reducers: {
    login(state, action) {
      const { id, role, token } = action.payload || {};
      state.isLoggedIn = true;
      state.id = id;
      state.role = role;
      state.token = token;

      localStorage.setItem(
        "auth",
        JSON.stringify({ isLoggedIn: true, id, role, token })
      );
    },
    logout(state) {
      state.isLoggedIn = false;
      state.id = null;
      state.role = "user";
      state.token = null;
      // Remove all auth-related keys from localStorage
      localStorage.removeItem("auth");
      localStorage.removeItem("id");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    },
    changeRole(state, action) {
      const role = action.payload;
      state.role = role;
      const currentAuth = JSON.parse(localStorage.getItem("auth")) || {};
      localStorage.setItem("auth", JSON.stringify({ ...currentAuth, role }));
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
