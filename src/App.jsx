import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import AllOrders from "./pages/AllOrders";
import AddBook from "./pages/AddBook";
import UpdateBook from "./pages/UpdateBook";
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import ManageBooks from './pages/ManageBooks';
import Analytics from './pages/Analytics';


// A layout wrapper for routes that need Navbar + Footer
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

  // Note: Using localStorage is fine for simple use cases, but for a production application,
  // it's generally better to use more secure methods like a secure cookie or a dedicated
  // authentication library.
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
    <>
      <Routes>
        {/* Routes with Navbar + Footer */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/all-books" element={<MainLayout><Allbooks /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>}></Route>
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>}></Route>
        <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>}>
          {/* Nested routes are defined here */}
          {role === 'user' ? <Route index element={<Favourite/>} /> : <Route index element={<AdminDashboard/>} />}
          {role === 'admin' && <Route path="/profile/all-order" element={<AllOrders />} />}
          {role === 'admin' && <Route path="/profile/add-book" element={<AddBook />} />}
          {role === 'admin' && <Route path="/profile/manage-books" element={<ManageBooks />} />}
          {role === 'admin' && <Route path="/profile/analytics" element={<Analytics />} />}
          <Route path="/profile/orderHistory" element={<Orderhistory />} />
          <Route path="/profile/settings" element={<Setting />} />
        </Route>
        
        {/* Specific routes with shared layout */}
        <Route path="/view-details/:id" element={<MainLayout><ViewBookDetails /></MainLayout>} />
        <Route path="/all-books/view-details/:id" element={<MainLayout><ViewBookDetails /></MainLayout>} />
        <Route path="/updatebook/:id" element={<UpdateBook />} />
        
        {/* Routes without Navbar + Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      
      {/* ToastContainer placed outside of Routes to be available globally */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </>
  );
};

export default App;
