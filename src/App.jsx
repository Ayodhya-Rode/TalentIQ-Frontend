import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Footer from "./components/Footer";
import ResumeGenerator from "./pages/candidate/ResumeGenerator";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import OrganizationDetail from "./pages/super-admin/OrganizationDetail";
import OrgAdminHome from "./pages/org-admin/OrgAdminHome";
import OrgAdminOrganization from "./pages/org-admin/OrgAdminDashboard";
import AcceptInvite from "./pages/auth/AcceptInvite";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import InterviewerDashboard from "./pages/interviewer/InterviewerDashboard";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/candidate/MyApplications";
import BookInterview from "./pages/candidate/BookInterview";
import MyBookings from "./pages/candidate/MyBookings";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Routes where the marketing Navbar/Footer should NOT be shown
const NO_NAV_FOOTER_ROUTES = [
  "/candidate",
  "/super-admin",
  "/org-admin",
  "/recruiter",
  "/interviewer",
];

function useShowNavAndFooter() {
  const { pathname } = useLocation();
  return !NO_NAV_FOOTER_ROUTES.some((prefix) => pathname.startsWith(prefix));
}

function App() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const showNavAndFooter = useShowNavAndFooter();

  return (
    <div className={dark ? "dark" : ""}>
      <ScrollToTop />
      {showNavAndFooter && <Navbar dark={dark} setDark={setDark} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        {/* Protected route for candidate dashboard - only logged in users can access this route */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/profile"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/applications"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/book-interview"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <BookInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/my-bookings"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route
          path="/candidate/resume-generator"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <ResumeGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <SuperAdminDashboard dark={dark} setDark={setDark} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/organizations/:id"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <OrganizationDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/org-admin"
          element={
            <ProtectedRoute allowedRoles={["ORG_ADMIN"]}>
              <OrgAdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org-admin/organization"
          element={
            <ProtectedRoute allowedRoles={["ORG_ADMIN"]}>
              <OrgAdminOrganization />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={["RECRUITER"]}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interviewer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["INTERVIEWER"]}>
              <InterviewerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {showNavAndFooter && <Footer />}
    </div>
  );
}

export default App;
