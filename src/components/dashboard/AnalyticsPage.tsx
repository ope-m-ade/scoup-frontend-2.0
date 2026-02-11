import { Eye, TrendingUp, Users, FileText, Award, MessageSquare, Globe, Calendar } from "lucide-react";

export function AnalyticsPage() {
  // Mock analytics data
  const profileViews = {
    total: 2847,
    thisMonth: 412,
    trend: "+23%",
    percentChange: 23
  };

  const searchAppearances = {
    total: 156,
    thisMonth: 28,
    avgRank: 3.2,
    topKeywords: ["Machine Learning", "Data Science", "AI", "Neural Networks"]
  };

  const collaborationRequests = {
    total: 12,
    pending: 3,
    accepted: 8,
    declined: 1
  };

  const impactMetrics = {
    profileCompleteness: 92,
    visibilityScore: 87,
    engagementRate: 78,
    responseTime: "2.4 hours"
  };

  // Monthly views data
  const monthlyViews = [
    { month: "Aug", views: 285 },
    { month: "Sep", views: 312 },
    { month: "Oct", views: 358 },
    { month: "Nov", views: 389 },
    { month: "Dec", views: 401 },
    { month: "Jan", views: 412 }
  ];

  const maxMonthlyViews = Math.max(...monthlyViews.map(d => d.views));

  // Top viewed publications
  const topPublications = [
    { title: "Deep Learning Applications in Climate Science", views: 245, citations: 18 },
    { title: "Neural Network Optimization Techniques", views: 198, citations: 12 },
    { title: "Machine Learning for Environmental Monitoring", views: 167, citations: 9 }
  ];

  // Recent profile interactions
  const recentInteractions = [
    { type: "View", source: "External Search", details: "Perdue Farms", time: "2 hours ago" },
    { type: "Contact", source: "Internal Network", details: "Dr. Sarah Watson (Marine Biology)", time: "5 hours ago" },
    { type: "View", source: "Direct Link", details: "Maryland DNR", time: "1 day ago" },
    { type: "View", source: "External Search", details: "TechStars Accelerator", time: "2 days ago" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light text-gray-900 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600 font-light">
          Track your profile performance and research impact
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#8b0000]/10 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#8b0000]" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Profile Views</div>
              <div className="text-2xl font-light text-gray-900">{profileViews.total.toLocaleString()}</div>
            </div>
          </div>
          <div className="text-xs text-green-600 font-medium">
            {profileViews.trend} this month
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Search Appearances</div>
              <div className="text-2xl font-light text-gray-900">{searchAppearances.total}</div>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            Avg rank: #{searchAppearances.avgRank}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Collaborations</div>
              <div className="text-2xl font-light text-gray-900">{collaborationRequests.accepted}</div>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            {collaborationRequests.pending} pending requests
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Visibility Score</div>
              <div className="text-2xl font-light text-gray-900">{impactMetrics.visibilityScore}</div>
            </div>
          </div>
          <div className="text-xs text-green-600 font-medium">
            Above average
          </div>
        </div>
      </div>

      {/* Monthly Profile Views Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#ffd100]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Monthly Profile Views</h2>
            <p className="text-sm text-gray-600">Last 6 months performance</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 h-48">
          {monthlyViews.map((data) => {
            const heightPercent = (data.views / maxMonthlyViews) * 100;
            return (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs text-gray-600 font-medium">{data.views}</div>
                <div 
                  className="w-full bg-gradient-to-t from-[#8b0000] to-[#8b0000]/70 rounded-t transition-all hover:from-[#6b0000] hover:to-[#6b0000]/70 cursor-pointer"
                  style={{ height: `${heightPercent}%` }}
                />
                <div className="text-xs text-gray-600">{data.month}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Search Keywords */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#ffd100]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">Top Search Keywords</h2>
              <p className="text-sm text-gray-600">Most common search terms</p>
            </div>
          </div>

          <div className="space-y-3">
            {searchAppearances.topKeywords.map((keyword, index) => (
              <div key={keyword} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-medium text-sm w-6">#{index + 1}</span>
                  <span className="text-gray-900 font-medium">{keyword}</span>
                </div>
                <span className="px-2 py-1 bg-[#ffd100]/20 text-[#8b0000] text-xs rounded">
                  {Math.floor(Math.random() * 20) + 15} searches
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Viewed Publications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#ffd100]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">Top Viewed Publications</h2>
              <p className="text-sm text-gray-600">Most popular research</p>
            </div>
          </div>

          <div className="space-y-4">
            {topPublications.map((pub, index) => (
              <div key={pub.title} className="p-3 rounded-lg border border-gray-200 hover:border-[#8b0000] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#ffd100]/20 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-[#8b0000]">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                      {pub.title}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {pub.views} views
                      </span>
                      <span>{pub.citations} citations</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-[#ffd100]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Impact Metrics</h2>
            <p className="text-sm text-gray-600">Overall profile performance</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
              <span className="text-sm font-medium text-gray-900">{impactMetrics.profileCompleteness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#8b0000] to-[#ffd100] h-full rounded-full transition-all"
                style={{ width: `${impactMetrics.profileCompleteness}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Visibility Score</span>
              <span className="text-sm font-medium text-gray-900">{impactMetrics.visibilityScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#8b0000] to-[#ffd100] h-full rounded-full transition-all"
                style={{ width: `${impactMetrics.visibilityScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
              <span className="text-sm font-medium text-gray-900">{impactMetrics.engagementRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#8b0000] to-[#ffd100] h-full rounded-full transition-all"
                style={{ width: `${impactMetrics.engagementRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Interactions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#ffd100]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Recent Interactions</h2>
            <p className="text-sm text-gray-600">Latest profile activity</p>
          </div>
        </div>

        <div className="space-y-4">
          {recentInteractions.map((interaction, index) => (
            <div key={index} className="flex items-start justify-between p-3 rounded-lg border border-gray-200 hover:border-[#8b0000] transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  interaction.type === "View" ? "bg-blue-100" : "bg-green-100"
                }`}>
                  {interaction.type === "View" ? (
                    <Eye className={`w-4 h-4 ${interaction.type === "View" ? "text-blue-600" : "text-green-600"}`} />
                  ) : (
                    <Users className={`w-4 h-4 ${interaction.type === "View" ? "text-blue-600" : "text-green-600"}`} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">{interaction.type}</span>
                    <span className="text-xs text-gray-500">via {interaction.source}</span>
                  </div>
                  <div className="text-sm text-gray-700">{interaction.details}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{interaction.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-[#8b0000] to-[#6b0000] rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#ffd100] rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-[#8b0000]" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">Personalized Insights</h3>
            <ul className="space-y-2 text-sm text-white/90">
              <li>• Your profile views increased 23% this month - great visibility trend!</li>
              <li>• Consider adding more keywords to improve discoverability in emerging areas</li>
              <li>• You have 3 pending collaboration requests - review them in your Network tab</li>
              <li>• Your average response time (2.4 hours) is excellent compared to peers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
