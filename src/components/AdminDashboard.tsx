import { useState } from "react";
import { AdminOverviewPage } from "./admin/AdminOverviewPage";
import { FacultyManagementPage } from "./admin/FacultyManagementPage";
import { DepartmentManagementPage } from "./admin/DepartmentManagementPage";
import { PlatformAnalyticsPage } from "./admin/PlatformAnalyticsPage";
import { StrategicInsightsPage } from "./admin/StrategicInsightsPage";
import { SystemSettingsPage } from "./admin/SystemSettingsPage";
import { ContactPageEditor } from "./admin/ContactPageEditor";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LogOut, LayoutDashboard, Users, Building2, BarChart3, Settings, Lightbulb, Search, Phone } from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "faculty" | "departments" | "analytics" | "insights" | "contact" | "settings">("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverviewPage />;
      case "faculty":
        return <FacultyManagementPage />;
      case "departments":
        return <DepartmentManagementPage />;
      case "analytics":
        return <PlatformAnalyticsPage />;
      case "insights":
        return <StrategicInsightsPage />;
      case "contact":
        return <ContactPageEditor />;
      case "settings":
        return <SystemSettingsPage />;
      default:
        return <AdminOverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ffd100] to-[#e6bc00] rounded flex items-center justify-center">
              <span className="text-[#8b0000] font-bold">SU</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">SCOUP</h1>
              <p className="text-xs text-gray-600">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("faculty")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "faculty"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users className="w-5 h-5" />
            Faculty Management
          </button>
          <button
            onClick={() => setActiveTab("departments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "departments"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Building2 className="w-5 h-5" />
            Departments
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
            Platform Analytics
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "insights"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Lightbulb className="w-5 h-5" />
            Strategic Insights
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "contact"
                ? "bg-[#8b0000] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Phone className="w-5 h-5" />
            Contact Page
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
            System Settings
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
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
              <p className="text-sm text-gray-500">Search the dashboard data from here.</p>
            </div>
            <div className="w-full max-w-md">
              <label htmlFor="admin-dashboard-search" className="sr-only">
                Search admin dashboard
              </label>
              <div className="relative text-gray-500 focus-within:text-gray-700">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                <Input
                  id="admin-dashboard-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dashboard..."
                  className="pl-11 h-12"
                />
              </div>
            </div>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}