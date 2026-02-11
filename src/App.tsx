import { useState } from "react";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { FacultyLogin } from "./components/FacultyLogin";
import { FacultySignup } from "./components/FacultySignup";
import { AdminLogin } from "./components/AdminLogin";
import { FacultyDashboard } from "./components/FacultyDashboard";
import { AdminDashboard } from "./components/AdminDashboard";

type Page = "home" | "about" | "faculty-login" | "faculty-signup" | "admin-login";
type UserRole = "admin" | "faculty" | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage("home");
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {userRole === "faculty" ? (
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