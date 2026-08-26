import { useState, useEffect } from "react";
import { Routes, Route , Navigate, useLocation } from "react-router-dom";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/candidate/Dashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/candidate/Profile";
import Navbar from "./components/Navbar";
import FeaturesPage from "./pages/FeaturesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import Home from "./pages/Home";


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className={dark ? "dark" : ""}>
       <ScrollToTop />
      <Navbar dark={dark} setDark={setDark} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        {/* Protected route for candidate dashboard - only logged in users can access this route */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
      </Routes>
    </div>
  );
}

export default App;
