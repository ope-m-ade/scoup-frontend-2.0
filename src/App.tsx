import { useEffect, useRef, useState } from "react";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { FacultyLogin } from "./components/FacultyLogin";
import { FacultySignup } from "./components/FacultySignup";
import { AdminLogin } from "./components/AdminLogin";
import { FacultyDashboard } from "./components/FacultyDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { authAPI } from "./utils/api";


type Page =
  | "home"
  | "about"
  | "faculty-login"
  | "faculty-signup"
  | "admin-login"
  | "faculty-dashboard";
type UserRole = "admin" | "faculty" | null;
const PAGE_STORAGE_KEY = "scoupCurrentPage";
const ROLE_STORAGE_KEY = "scoupUserRole";

const isValidPage = (page: string): page is Page =>
  [
    "home",
    "about",
    "faculty-login",
    "faculty-signup",
    "admin-login",
    "faculty-dashboard",
  ].includes(page);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const savedPage = sessionStorage.getItem(PAGE_STORAGE_KEY);
    return savedPage && isValidPage(savedPage) ? savedPage : "home";
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const savedRole = sessionStorage.getItem(ROLE_STORAGE_KEY);
    return savedRole === "faculty" || savedRole === "admin" ? savedRole : null;
  });
  const hasManualRoleSelection = useRef(false);

  useEffect(() => {
    const boot = async () => {
      if (sessionStorage.getItem(ROLE_STORAGE_KEY) === "admin") return;
      if (!authAPI.isAuthenticated()) return;

      try {
        await authAPI.me(); // hits /faculty/me/
        if (!hasManualRoleSelection.current) {
          setUserRole("faculty");
          sessionStorage.setItem(ROLE_STORAGE_KEY, "faculty");
        }
      } catch (e) {
        // token invalid/expired → clear it
        authAPI.logout();
        setUserRole(null);
        sessionStorage.removeItem(ROLE_STORAGE_KEY);
      }
    };

    boot();
  }, []);

  useEffect(() => {
    sessionStorage.setItem(PAGE_STORAGE_KEY, currentPage);
  }, [currentPage]);

  const handleLogin = (role: UserRole) => {
    hasManualRoleSelection.current = true;
    setUserRole(role);
    if (role) {
      sessionStorage.setItem(ROLE_STORAGE_KEY, role);
    }
    if (role === "faculty") {
      setCurrentPage("faculty-dashboard");
    }
  };

  const handleLogout = () => {
    hasManualRoleSelection.current = false;
    authAPI.logout();
    setUserRole(null);
    setCurrentPage("home");
    sessionStorage.setItem(PAGE_STORAGE_KEY, "home");
    sessionStorage.removeItem(ROLE_STORAGE_KEY);
  };

  const handlePageChange = (page: Page) => {
    if (page === "faculty-login" && userRole === "faculty") {
      setCurrentPage("faculty-dashboard");
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {currentPage === "faculty-dashboard" && userRole === "faculty" ? (
        <FacultyDashboard onLogout={handleLogout} />
      ) : userRole === "admin" ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : currentPage === "home" ? (
        <Home onNavigate={handlePageChange} />
      ) : currentPage === "about" ? (
        <About onNavigate={handlePageChange} />
      ) : currentPage === "faculty-login" ? (
        <FacultyLogin
          onLoginSuccess={() => handleLogin("faculty")}
          onNavigateSignup={() => handlePageChange("faculty-signup")}
          onBack={() => handlePageChange("home")}
        />
      ) : currentPage === "faculty-signup" ? (
        <FacultySignup
          onSignupSuccess={() => handleLogin("faculty")}
          onBack={() => handlePageChange("home")}
        />
      ) : currentPage === "admin-login" ? (
        <AdminLogin
          onLoginSuccess={() => handleLogin("admin")}
          onBack={() => handlePageChange("home")}
        />
      ) : (
        <Home onNavigate={handlePageChange} />
      )}
    </div>
  );
}
