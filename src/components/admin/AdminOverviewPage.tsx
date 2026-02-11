import { Users, FileText, Lightbulb, FolderOpen, TrendingUp, Eye, Building2, Award, ArrowUp, ArrowDown } from "lucide-react";

export function AdminOverviewPage() {
  const platformStats = {
    totalFaculty: 0,
    activeFaculty: 0,
    totalPublications: 0,
    totalPatents: 0,
    totalProjects: 0,
    totalViews: 0,
    monthlyGrowth: 0,
  };

  const recentActivity: any[] = [];

  const topDepartments: any[] = [];

  const quickStats = [
    {
      label: "Total Faculty",
      value: platformStats.totalFaculty,
      change: "+0",
      changePercent: 0,
      icon: Users,
      color: "from-[#8b0000] to-[#6b0000]",
    },
    {
      label: "Publications",
      value: platformStats.totalPublications,
      change: "+0",
      changePercent: 0,
      icon: FileText,
      color: "from-blue-600 to-blue-500",
    },
    {
      label: "Total Views",
      value: platformStats.totalViews.toLocaleString(),
      change: "+0",
      changePercent: 0,
      icon: Eye,
      color: "from-green-600 to-green-500",
    },
    {
      label: "Active Projects",
      value: platformStats.totalProjects,
      change: "+0",
      changePercent: 0,
      icon: FolderOpen,
      color: "from-purple-600 to-purple-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-light text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 font-light">
          Monitor platform activity and manage SCOUP
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <ArrowUp className="w-4 h-4" />
                  <span>{stat.changePercent}%</span>
                </div>
              </div>
              <div className="text-3xl font-light text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.change} this month</div>
            </div>
          );
        })}
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#ffd100]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-600">Latest updates across the platform</p>
            </div>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.type === "faculty" ? "bg-[#8b0000]/10" :
                  activity.type === "publication" ? "bg-blue-100" :
                  activity.type === "project" ? "bg-green-100" :
                  "bg-purple-100"
                }`}>
                  {activity.type === "faculty" && <Users className="w-5 h-5 text-[#8b0000]" />}
                  {activity.type === "publication" && <FileText className="w-5 h-5 text-blue-600" />}
                  {activity.type === "project" && <FolderOpen className="w-5 h-5 text-green-600" />}
                  {activity.type === "patent" && <Lightbulb className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.name}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Departments */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#ffd100]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">Top Departments</h2>
              <p className="text-sm text-gray-600">By total profile views</p>
            </div>
          </div>

          <div className="space-y-4">
            {topDepartments.map((dept, index) => (
              <div key={dept.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#ffd100]/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-[#8b0000]">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{dept.name}</div>
                      <div className="text-xs text-gray-600">{dept.faculty} faculty</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{dept.views.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">views</div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#8b0000] to-[#ffd100] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(dept.views / topDepartments[0].views) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#8b0000]/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#8b0000]" />
            </div>
            <span className="text-xs text-gray-600 bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="text-3xl font-light text-gray-900 mb-1">{platformStats.activeFaculty}</div>
          <div className="text-sm text-gray-600">Active Faculty</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round((platformStats.activeFaculty / platformStats.totalFaculty) * 100)}% of total
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Growing
            </span>
          </div>
          <div className="text-3xl font-light text-gray-900 mb-1">{platformStats.totalPatents}</div>
          <div className="text-sm text-gray-600">Total Patents</div>
          <div className="text-xs text-gray-500 mt-1">+8 this quarter</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-600 bg-green-100 text-green-700 px-2 py-1 rounded-full">
              +{platformStats.monthlyGrowth}%
            </span>
          </div>
          <div className="text-3xl font-light text-gray-900 mb-1">
            {(platformStats.totalViews / platformStats.totalFaculty).toFixed(0)}
          </div>
          <div className="text-sm text-gray-600">Avg Views per Faculty</div>
          <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-gradient-to-r from-[#8b0000] to-[#6b0000] rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#ffd100] rounded-lg flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-[#8b0000]" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">Platform Health: Excellent</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-white/90">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="font-medium">System Status</span>
                </div>
                <div className="text-white/80">All services operational</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="font-medium">Data Sync</span>
                </div>
                <div className="text-white/80">Last synced 2 minutes ago</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="font-medium">Pending Reviews</span>
                </div>
                <div className="text-white/80">5 faculty profiles awaiting approval</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}