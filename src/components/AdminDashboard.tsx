import { useState } from "react";
import { createPortal } from "react-dom";
import { AdminOverviewPage } from "./admin/AdminOverviewPage";
import { FacultyManagementPage } from "./admin/FacultyManagementPage";
import { DepartmentManagementPage } from "./admin/DepartmentManagementPage";
import { PlatformAnalyticsPage } from "./admin/PlatformAnalyticsPage";
import { StrategicInsightsPage } from "./admin/StrategicInsightsPage";
import { SystemSettingsPage } from "./admin/SystemSettingsPage";
import { ContactPageEditor } from "./admin/ContactPageEditor";
import { PendingApprovalsPage } from "./admin/PendingApprovalsPage";
import { InquiriesPage } from "./admin/InquiriesPage";
import { Button } from "./ui/button";
import { LogOut, LayoutDashboard, Users, Building2, BarChart3, Settings, Lightbulb, Phone, ShieldCheck, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "faculty" | "pending" | "departments" | "analytics" | "insights" | "contact" | "inquiries" | "settings">("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverviewPage />;
      case "faculty":
        return <FacultyManagementPage />;
      case "pending":
        return <PendingApprovalsPage />;
      case "departments":
        return <DepartmentManagementPage />;
      case "analytics":
        return <PlatformAnalyticsPage />;
      case "insights":
        return <StrategicInsightsPage />;
      case "contact":
        return <ContactPageEditor />;
      case "inquiries":
        return <InquiriesPage />;
      case "settings":
        return <SystemSettingsPage />;
      default:
        return <AdminOverviewPage />;
    }
  };

  const NavBtn = ({ tab, icon: Icon, label }: { tab: string; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      title={!sidebarOpen ? label : undefined}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${
        !sidebarOpen ? "justify-center" : ""
      } ${activeTab === tab ? "bg-[#8b0000] text-white" : "text-gray-700 hover:bg-gray-100"}`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {sidebarOpen && <span className="flex-1 text-left">{label}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-[68px]"} bg-white border-r border-gray-200 flex flex-col transition-all duration-200`}>

        {/* Logo/Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex-1 text-center">
              <h1 className="font-bold text-lg leading-tight">SCOUP</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          ) : (
            <span className="font-bold text-sm text-[#8b0000] mx-auto">S</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-0.5">
          <NavBtn tab="overview"    icon={LayoutDashboard} label="Overview"           />
          <NavBtn tab="faculty"     icon={Users}           label="Faculty Management" />
          <NavBtn tab="pending"     icon={ShieldCheck}     label="Pending Approvals"  />
          <NavBtn tab="inquiries"   icon={MessageSquare}   label="Inquiries" />
          <NavBtn tab="departments" icon={Building2}       label="Departments"        />
          <NavBtn tab="analytics"   icon={BarChart3}       label="Platform Analytics" />
          <NavBtn tab="insights"    icon={Lightbulb}       label="Strategic Insights" />
          <NavBtn tab="contact"     icon={Phone}           label="Contact Page"       />
        </nav>

        {/* Settings and Logout */}
        <div className="p-2 border-t border-gray-200 space-y-0.5">
          <NavBtn tab="settings" icon={Settings} label="System Settings" />
          <button
            onClick={() => setShowLogoutDialog(true)}
            title={!sidebarOpen ? "Logout" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && createPortal(
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "0.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: "1.5rem", width: "100%", maxWidth: "28rem", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", margin: 0 }}>Sign out of SCOUP?</h2>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
              You'll need to sign in again to access your admin dashboard.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.5rem" }}>
              <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-[#8b0000] hover:bg-[#700000] text-white" onClick={onLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
