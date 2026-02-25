import { useState } from "react";
import { ProfilePage } from "./dashboard/ProfilePage";
import { PapersPage } from "./dashboard/PapersPage";
import { PatentsPage } from "./dashboard/PatentsPage";
import { ProjectsPage } from "./dashboard/ProjectsPage";
import { PDFUploadPage } from "./dashboard/PDFUploadPage";
import { SettingsPage } from "./dashboard/SettingsPage";
import { AnalyticsPage } from "./dashboard/AnalyticsPage";
import { NetworkPage } from "./dashboard/NetworkPage";
import { BadgesWidget } from "./dashboard/BadgesWidget";
import { DashboardOverview } from "./dashboard/DashboardOverview";
import { Button } from "./ui/button";
import {
  LogOut,
  User,
  FileText,
  Lightbulb,
  FolderOpen,
  Upload,
  Settings,
  BarChart3,
  Network,
  Trophy,
  Home,
} from "lucide-react";

interface FacultyDashboardProps {
  onLogout: () => void;
}

export function FacultyDashboard({ onLogout }: FacultyDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "profile"
    | "papers"
    | "patents"
    | "projects"
    | "upload"
    | "settings"
    | "analytics"
    | "network"
    | "badges"
  >("overview");

  const handleNavigate = (tab: string) => {
    if (
      tab === "overview" ||
      tab === "profile" ||
      tab === "papers" ||
      tab === "patents" ||
      tab === "projects" ||
      tab === "upload" ||
      tab === "settings" ||
      tab === "analytics" ||
      tab === "network" ||
      tab === "badges"
    ) {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview onNavigate={handleNavigate} />;
      case "profile":
        return <ProfilePage />;
      case "papers":
        return <PapersPage />;
      case "patents":
        return <PatentsPage />;
      case "projects":
        return <ProjectsPage />;
      case "upload":
        return <PDFUploadPage />;
      case "settings":
        return <SettingsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "network":
        return <NetworkPage />;
      case "badges":
        return (
          <div className="max-w-7xl mx-auto">
            <BadgesWidget />
          </div>
        );
      default:
        return <DashboardOverview onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ffd100] rounded flex items-center justify-center">
              <span className="text-[#8b0000] font-bold">SU</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">SCOUP</h1>
              <p className="text-xs text-gray-600">Faculty Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5" />
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <User className="w-5 h-5" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("papers")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "papers"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FileText className="w-5 h-5" />
            Papers
          </button>
          <button
            onClick={() => setActiveTab("patents")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "patents"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Lightbulb className="w-5 h-5" />
            Patents
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "projects"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            Projects
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "upload"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Upload className="w-5 h-5" />
            Upload PDF
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "analytics"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("network")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "network"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Network className="w-5 h-5" />
            Network
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "badges"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Trophy className="w-5 h-5" />
            Badges
          </button>
        </nav>

        {/* Settings and Logout */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "settings"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  );
}
