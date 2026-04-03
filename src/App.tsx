import { useEffect, useRef, useState } from "react";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { FacultyLogin } from "./components/FacultyLogin";
import { FacultySignup } from "./components/FacultySignup";
import { AdminLogin } from "./components/AdminLogin";
import { FacultyDashboard } from "./components/FacultyDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { authAPI } from "./utils/api";

type UserRole = "admin" | "faculty" | null;
const ROLE_STORAGE_KEY = "scoupUserRole";

const normalizePath = (path: string) => {
  if (!path || path === "") return "/";
  return path.replace(/\/+$/, "") || "/";
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname),
  );
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const savedRole = sessionStorage.getItem(ROLE_STORAGE_KEY);
    return savedRole === "faculty" || savedRole === "admin" ? savedRole : null;
  });
  const hasManualRoleSelection = useRef(false);

  const navigateTo = (path: string, replace = false) => {
    const target = normalizePath(path);
    if (target === currentPath) return;
    if (replace) {
      window.history.replaceState({}, "", target);
    } else {
      window.history.pushState({}, "", target);
    }
    setCurrentPath(target);
  };

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const boot = async () => {
      if (sessionStorage.getItem(ROLE_STORAGE_KEY) === "admin") return;
      if (!authAPI.isAuthenticated()) return;

      try {
        await authAPI.me();
        if (!hasManualRoleSelection.current) {
          setUserRole("faculty");
          sessionStorage.setItem(ROLE_STORAGE_KEY, "faculty");
        }
      } catch {
        authAPI.logout();
        setUserRole(null);
        sessionStorage.removeItem(ROLE_STORAGE_KEY);
      }
    };

    boot();
  }, []);

  useEffect(() => {
    if (currentPath === "/faculty-dashboard" && userRole !== "faculty") {
      navigateTo("/faculty-login", true);
      return;
    }
    if (currentPath === "/admin-dashboard" && userRole !== "admin") {
      navigateTo("/admin-login", true);
      return;
    }
    if (currentPath === "/faculty-login" && userRole === "faculty") {
      navigateTo("/faculty-dashboard", true);
      return;
    }
    if (currentPath === "/admin-login" && userRole === "admin") {
      navigateTo("/admin-dashboard", true);
      return;
    }
  }, [currentPath, userRole]);

  const handleLogin = (role: UserRole) => {
    hasManualRoleSelection.current = true;
    setUserRole(role);
    if (role) {
      sessionStorage.setItem(ROLE_STORAGE_KEY, role);
    }
    if (role === "faculty") {
      navigateTo("/faculty-dashboard", true);
    }
    if (role === "admin") {
      navigateTo("/admin-dashboard", true);
    }
  };

  const handleLogout = () => {
    hasManualRoleSelection.current = false;
    authAPI.logout();
    setUserRole(null);
    sessionStorage.removeItem(ROLE_STORAGE_KEY);
    navigateTo("/", true);
  };

  const handleNavigate = (path: string) => {
    navigateTo(path);
  };

  const renderPage = () => {
    if (currentPath === "/faculty-dashboard" && userRole === "faculty") {
      return <FacultyDashboard onLogout={handleLogout} />;
    }
    if (currentPath === "/admin-dashboard" && userRole === "admin") {
      return <AdminDashboard onLogout={handleLogout} />;
    }

    switch (currentPath) {
      case "/":
        return <Home onNavigate={handleNavigate} />;
      case "/about":
        return <About onNavigate={handleNavigate} />;
      case "/faculty-login":
        return (
          <FacultyLogin
            onLoginSuccess={() => handleLogin("faculty")}
            onNavigateSignup={() => handleNavigate("/faculty-signup")}
            onBack={() => handleNavigate("/")}
          />
        );
      case "/faculty-signup":
        return (
          <FacultySignup
            onSignupSuccess={() => handleLogin("faculty")}
            onBack={() => handleNavigate("/")}
          />
        );
      case "/admin-login":
        return (
          <AdminLogin
            onLoginSuccess={() => handleLogin("admin")}
            onBack={() => handleNavigate("/")}
          />
        );
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}
