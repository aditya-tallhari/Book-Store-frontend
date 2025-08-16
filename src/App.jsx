import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/auth";

import Navbar from "./components/Layouts/Navbar";
import Footer from "./components/Layouts/Footer";
import Home from "./pages/Home";
import Allbooks from "./pages/Allbooks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ViewBookDetails from "./components/Book-details/ViewBookDetails";
import Favourite from "./pages/Favourite";
import Orderhistory from "./pages/Orderhistory";
import Setting from "./pages/Setting";

// Layout wrapper for routes that need Navbar + Footer
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Routes with Navbar + Footer */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/all-books" element={<MainLayout><Allbooks /></MainLayout>} />
      <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
      <Route path="/profile" element={<MainLayout><Profile /></MainLayout>}>
        <Route path="/profile/favourites" element={<Favourite/>}></Route>
        <Route path="/profile/orderHistory" element={<Orderhistory/>}/>
        <Route path="/profile/settings" element={<Setting/>}/>
      </Route>
      
      <Route path="/view-details/:id" element={<MainLayout><ViewBookDetails /></MainLayout>} />
      <Route path="all-books/view-details/:id" element={<MainLayout><ViewBookDetails /></MainLayout>} />
      {/* Routes without Navbar + Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default App;
