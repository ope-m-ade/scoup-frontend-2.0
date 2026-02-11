import { TrendingUp, Users, Eye, FileText, Building2, ArrowUp, Globe, AlertCircle, TrendingDown } from "lucide-react";

export function PlatformAnalyticsPage() {
  // Mock monthly data
  const monthlyData = [
    { month: "Aug", views: 1850, searches: 420, contacts: 48 },
    { month: "Sep", views: 2100, searches: 510, contacts: 62 },
    { month: "Oct", views: 2450, searches: 680, contacts: 85 },
    { month: "Nov", views: 2750, searches: 820, contacts: 103 },
    { month: "Dec", views: 2980, searches: 950, contacts: 118 },
    { month: "Jan", views: 3250, searches: 1120, contacts: 142 }
  ];

  // Mock search keywords with confidence metrics
  const topSearchKeywords = [
    { keyword: "Marine Biology", count: 324, trend: 18, avgConfidence: 88 },
    { keyword: "Artificial Intelligence", count: 287, trend: 12, avgConfidence: 85 },
    { keyword: "Cybersecurity", count: 245, trend: -3, avgConfidence: 79 },
    { keyword: "Data Science", count: 213, trend: 25, avgConfidence: 91 },
    { keyword: "Machine Learning", count: 198, trend: 22, avgConfidence: 87 },
    { keyword: "Business Analytics", count: 176, trend: 15, avgConfidence: 82 },
    { keyword: "Environmental Science", count: 142, trend: 8, avgConfidence: 86 },
    { keyword: "Renewable Energy", count: 128, trend: 32, avgConfidence: 72 }
  ];

  // Mock low-confidence searches - CRITICAL NEW FEATURE
  const lowConfidenceSearches = [
    { 
      query: "blockchain healthcare applications",
      count: 23,
      avgConfidence: 42,
      trend: "increasing",
      recommendation: "No current faculty expertise - potential hiring opportunity in emerging tech healthcare"
    },
    { 
      query: "quantum computing algorithms",
      count: 18,
      avgConfidence: 38,
      trend: "stable",
      recommendation: "Limited expertise - Dr. Chen expressed interest, consider training/recruitment"
    },
    { 
      query: "sustainable fashion design",
      count: 15,
      avgConfidence: 35,
      trend: "increasing",
      recommendation: "No matching department - opportunity for interdisciplinary program"
    },
    { 
      query: "augmented reality education",
      count: 12,
      avgConfidence: 48,
      trend: "increasing",
      recommendation: "Partial match with Dr. Patterson (Education) - suggest AR specialization"
    },
    { 
      query: "microplastics ocean research",
      count: 11,
      avgConfidence: 45,
      trend: "stable",
      recommendation: "Dr. Watson (Marine Biology) adjacent expertise - could expand research focus"
    }
  ];

  // Mock faculty adoption rates - NEW FEATURE
  const facultyAdoptionMetrics = {
    totalFaculty: 150,
    profilesCreated: 125,
    profilesCompleted: 98,
    activeUsers: 87,
    adoptionRate: 83,
    avgProfileCompletion: 76,
    lastWeekLogins: 45
  };

  const platformMetrics = {
    totalViews: monthlyData.reduce((sum, d) => sum + d.views, 0),
    totalSearches: monthlyData.reduce((sum, d) => sum + d.searches, 0),
    externalUsers: 234,
    contactRequests: monthlyData.reduce((sum, d) => sum + d.contacts, 0),
    avgSessionTime: "4m 23s",
    bounceRate: "32%",
  };

  const maxViews = Math.max(...monthlyData.map(d => d.views));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-600 mt-1">
          Monitor usage, track quality metrics, and identify strategic opportunities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Views</div>
          <div className="text-2xl font-light text-gray-900">{platformMetrics.totalViews.toLocaleString()}</div>
          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <ArrowUp className="w-3 h-3" />
            +12.5%
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Searches</div>
          <div className="text-2xl font-light text-gray-900">{platformMetrics.totalSearches.toLocaleString()}</div>
          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <ArrowUp className="w-3 h-3" />
            +8.3%
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">External Users</div>
          <div className="text-2xl font-light text-gray-900">{platformMetrics.externalUsers}</div>
          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <ArrowUp className="w-3 h-3" />
            +15.2%
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Contact Requests</div>
          <div className="text-2xl font-light text-gray-900">{platformMetrics.contactRequests}</div>
          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <ArrowUp className="w-3 h-3" />
            +18.7%
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Session</div>
          <div className="text-2xl font-light text-gray-900">{platformMetrics.avgSessionTime}</div>
          <div className="text-xs text-gray-600 mt-1">per visit</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Bounce Rate</div>
          <div className="text-2xl font-light text-gray-900">{platformMetrics.bounceRate}</div>
          <div className="text-xs text-green-600 mt-1">↓ 5% vs avg</div>
        </div>
      </div>

      {/* Platform Activity Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#ffd100]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Platform Activity</h2>
            <p className="text-sm text-gray-600">Monthly views, searches, and contact requests</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Views Chart */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Profile Views</div>
            <div className="flex items-end justify-between gap-2 h-40">
              {monthlyData.map((data) => {
                const heightPercent = (data.views / maxViews) * 100;
                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs text-gray-600 font-medium">{data.views.toLocaleString()}</div>
                    <div 
                      className="w-full bg-gradient-to-t from-[#8b0000] to-[#8b0000]/70 rounded-t transition-all hover:from-[#6b0000] hover:to-[#6b0000]/70"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <div className="text-xs text-gray-600">{data.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Combined Metrics */}
          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">Searches</div>
              <div className="flex items-end gap-1 h-24">
                {monthlyData.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col justify-end">
                    <div 
                      className="w-full bg-blue-600 rounded-t transition-all hover:bg-blue-700"
                      style={{ height: `${(data.searches / 2500) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">Contact Requests</div>
              <div className="flex items-end gap-1 h-24">
                {monthlyData.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col justify-end">
                    <div 
                      className="w-full bg-green-600 rounded-t transition-all hover:bg-green-700"
                      style={{ height: `${(data.contacts / 200) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
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
              <p className="text-sm text-gray-600">What external users are searching for</p>
            </div>
          </div>

          <div className="space-y-3">
            {topSearchKeywords.map((keyword, index) => {
              const maxCount = topSearchKeywords[0].count;
              const widthPercent = (keyword.count / maxCount) * 100;
              return (
                <div key={keyword.keyword} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-medium w-6">#{index + 1}</span>
                      <span className="text-gray-900 font-medium">{keyword.keyword}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{keyword.count}</span>
                      <span className={`text-xs ${keyword.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {keyword.trend >= 0 ? '+' : ''}{keyword.trend}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#8b0000] to-[#ffd100] h-full rounded-full transition-all duration-500"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#ffd100]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Traffic Sources</h2>
            <p className="text-sm text-gray-600">Where users are finding SCOUP</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-light text-gray-900 mb-1">45%</div>
            <div className="text-sm text-gray-600">Direct Traffic</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-light text-gray-900 mb-1">28%</div>
            <div className="text-sm text-gray-600">Search Engines</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-light text-gray-900 mb-1">18%</div>
            <div className="text-sm text-gray-600">Social Media</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-light text-gray-900 mb-1">9%</div>
            <div className="text-sm text-gray-600">Referrals</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-[#8b0000] to-[#6b0000] rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#ffd100] rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-[#8b0000]" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">Platform Insights</h3>
            <ul className="space-y-2 text-sm text-white/90">
              <li>• Platform traffic increased 12.5% this month - strong growth trajectory</li>
              <li>• "Machine learning" and "AI" are the most searched terms - consider highlighting related faculty</li>
              <li>• External organization engagement is up 18.7% - industry partnerships are growing</li>
              <li>• Average session time of 4m 23s indicates high user engagement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Low Confidence Searches */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-[#ffd100]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Low Confidence Searches</h2>
            <p className="text-sm text-gray-600">Identify areas for faculty development</p>
          </div>
        </div>

        <div className="space-y-4">
          {lowConfidenceSearches.map((search) => (
            <div key={search.query} className="flex items-start justify-between p-3 rounded-lg border border-gray-200 hover:border-[#8b0000] transition-colors">
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">{search.query}</div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="px-2 py-0.5 bg-gray-100 rounded">Count: {search.count}</span>
                  <span>•</span>
                  <span>Trend: {search.trend}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Avg Confidence: {search.avgConfidence}%</div>
                <div className="text-xs text-gray-600">Recommendation: {search.recommendation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Adoption Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-[#ffd100]" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Faculty Adoption Metrics</h2>
            <p className="text-sm text-gray-600">Track faculty engagement and profile completion</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Total Faculty</div>
            <div className="text-3xl font-light text-gray-900 mb-2">{facultyAdoptionMetrics.totalFaculty}</div>
            <div className="text-xs text-gray-600">University-wide</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Profiles Created</div>
            <div className="text-3xl font-light text-gray-900 mb-2">{facultyAdoptionMetrics.profilesCreated}</div>
            <div className="text-xs text-green-600">Adoption Rate: {facultyAdoptionMetrics.adoptionRate}%</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Active Users</div>
            <div className="text-3xl font-light text-gray-900 mb-2">{facultyAdoptionMetrics.activeUsers}</div>
            <div className="text-xs text-gray-600">Last week: {facultyAdoptionMetrics.lastWeekLogins} logins</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion Rate</span>
              <span className="text-sm font-medium text-gray-900">{facultyAdoptionMetrics.avgProfileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#8b0000] to-[#ffd100] h-full rounded-full transition-all"
                style={{ width: `${facultyAdoptionMetrics.avgProfileCompletion}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Platform Adoption Rate</span>
              <span className="text-sm font-medium text-gray-900">{facultyAdoptionMetrics.adoptionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#8b0000] to-[#ffd100] h-full rounded-full transition-all"
                style={{ width: `${facultyAdoptionMetrics.adoptionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}