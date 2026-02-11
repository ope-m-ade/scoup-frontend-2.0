import { Lightbulb, TrendingUp, Users, Target, Award, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export function StrategicInsightsPage() {
  // Mock expertise clusters
  const expertiseClusters = [
    {
      id: "1",
      name: "AI & Machine Learning",
      facultyCount: 8,
      publications: 45,
      fundingPotential: "High",
      trend: "Growing",
      strength: "Established",
      recommendation: "Strong cluster - consider creating AI Research Center",
      relatedDepartments: ["Computer Science", "Data Analytics", "Mathematics"],
      potentialPartners: ["Tech companies", "Healthcare organizations", "Financial institutions"]
    },
    {
      id: "2",
      name: "Marine Conservation & Ecology",
      facultyCount: 12,
      publications: 78,
      fundingPotential: "High",
      trend: "Stable",
      strength: "Leading",
      recommendation: "Leverage regional advantage - expand Ocean Research Institute",
      relatedDepartments: ["Marine Biology", "Environmental Science", "Geography"],
      potentialPartners: ["Maryland DNR", "NOAA", "Conservation NGOs"]
    },
    {
      id: "3",
      name: "Business Intelligence & Analytics",
      facultyCount: 6,
      publications: 23,
      fundingPotential: "Medium",
      trend: "Growing",
      strength: "Emerging",
      recommendation: "Growing cluster - invest in faculty development and industry partnerships",
      relatedDepartments: ["Business Administration", "Information Systems", "Economics"],
      potentialPartners: ["Regional businesses", "Consulting firms", "Government agencies"]
    },
    {
      id: "4",
      name: "Educational Technology",
      facultyCount: 5,
      publications: 18,
      fundingPotential: "Medium",
      trend: "Stable",
      strength: "Developing",
      recommendation: "Mid-sized cluster - consider interdisciplinary EdTech program",
      relatedDepartments: ["Education", "Computer Science", "Psychology"],
      potentialPartners: ["K-12 schools", "Ed tech startups", "State education dept"]
    }
  ];

  // Strategic recommendations
  const strategicRecommendations = [
    {
      title: "Establish AI Research Center",
      category: "Infrastructure",
      rationale: "Strong faculty cluster (8 members), high external demand (324 searches), established publication record",
      impact: "High",
      effort: "High",
      timeline: "12-18 months",
      nextSteps: [
        "Secure administrative approval and seed funding",
        "Appoint center director from existing faculty",
        "Develop center charter and research priorities",
        "Launch with industry partnership announcement"
      ]
    },
    {
      title: "Expand Marine Research Institute",
      category: "Growth",
      rationale: "Leading expertise (12 faculty, 78 publications), strong regional advantage, consistent demand",
      impact: "High",
      effort: "Medium",
      timeline: "6-12 months",
      nextSteps: [
        "Increase collaboration with Maryland DNR and NOAA",
        "Add two postdoc positions in emerging areas",
        "Launch community engagement programs",
        "Apply for major NSF infrastructure grant"
      ]
    },
    {
      title: "Create Cross-Departmental EdTech Initiative",
      category: "Collaboration",
      rationale: "Partial expertise across multiple departments, high regional K-12 demand, strong grant potential",
      impact: "Medium",
      effort: "Low",
      timeline: "3-6 months",
      nextSteps: [
        "Convene faculty from Education, CS, and Psychology",
        "Identify 2-3 pilot projects with local schools",
        "Submit DOE grant application",
        "Create faculty learning community"
      ]
    }
  ];

  // Departmental strength analysis
  const departmentStrengths = [
    { department: "Marine Biology", score: 92, trend: "↑", strengths: ["Research output", "External funding", "Industry partnerships"] },
    { department: "Computer Science", score: 88, trend: "↑", strengths: ["Growing expertise in AI", "High student interest", "Industry demand"] },
    { department: "Business Administration", score: 75, trend: "→", strengths: ["Established programs", "Regional connections", "Stable enrollment"] },
    { department: "Education", score: 68, trend: "↓", strengths: ["Experienced faculty", "K-12 partnerships"] },
    { department: "Engineering", score: 65, trend: "→", strengths: ["Applied research", "Industry connections"] }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Strategic Insights</h1>
        <p className="text-gray-600 mt-1">
          Data-driven recommendations for centers, institutes, and interdisciplinary initiatives
        </p>
      </div>

      {/* Strategic Overview */}
      <div className="bg-gradient-to-r from-[#8b0000] to-[#6b0000] rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#ffd100] rounded-lg flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-[#8b0000]" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-3">Strategic Positioning Summary</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-[#ffd100] font-medium mb-1">Strong Clusters</div>
                <div className="text-white/90">4 expertise clusters identified</div>
              </div>
              <div>
                <div className="text-[#ffd100] font-medium mb-1">Strategic Initiatives</div>
                <div className="text-white/90">3 actionable recommendations</div>
              </div>
              <div>
                <div className="text-[#ffd100] font-medium mb-1">Faculty Adoption</div>
                <div className="text-white/90">83% platform adoption rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expertise Clusters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium text-gray-900">Expertise Clusters</h2>
          <Button variant="outline" className="border-gray-300">
            Export Report
          </Button>
        </div>
        <div className="grid gap-6">
          {expertiseClusters.map((cluster) => (
            <div key={cluster.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-1">{cluster.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {cluster.facultyCount} faculty
                    </span>
                    <span>•</span>
                    <span>{cluster.publications} publications</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      cluster.strength === "Leading" ? "bg-purple-100 text-purple-700" :
                      cluster.strength === "Established" ? "bg-blue-100 text-blue-700" :
                      cluster.strength === "Emerging" ? "bg-green-100 text-green-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {cluster.strength}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    cluster.fundingPotential === "High" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {cluster.fundingPotential} Funding Potential
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Trend: {cluster.trend}</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-[#8b0000] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-900"><span className="font-medium">Recommendation:</span> {cluster.recommendation}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Related Departments
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cluster.relatedDepartments.map((dept) => (
                      <span key={dept} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Potential Partners
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cluster.potentialPartners.map((partner) => (
                      <span key={partner} className="px-2 py-1 bg-[#ffd100]/20 text-[#8b0000] text-xs rounded">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">Strategic Recommendations</h2>
        <div className="space-y-4">
          {strategicRecommendations.map((rec, index) => (
            <div key={index} className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-[#8b0000] text-[#ffd100] rounded">
                      {rec.category}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">{rec.title}</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{rec.rationale}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <div className="text-center">
                    <div className={`px-3 py-1 rounded text-xs font-medium ${
                      rec.impact === "High" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {rec.impact} Impact
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`px-3 py-1 rounded text-xs font-medium ${
                      rec.effort === "High" ? "bg-red-100 text-red-700" :
                      rec.effort === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {rec.effort} Effort
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#8b0000]" />
                  <span className="text-sm font-medium text-gray-900">Next Steps ({rec.timeline})</span>
                </div>
                <ul className="space-y-2">
                  {rec.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <ArrowRight className="w-4 h-4 text-[#8b0000] flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Departmental Strength Analysis */}
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">Departmental Strength Analysis</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-6">
            {departmentStrengths.map((dept) => (
              <div key={dept.department}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{dept.department}</span>
                    <span className="text-2xl">{dept.trend}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Strength Score:</span>
                    <span className={`text-2xl font-light ${
                      dept.score >= 85 ? "text-green-600" :
                      dept.score >= 70 ? "text-blue-600" :
                      "text-orange-600"
                    }`}>{dept.score}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-full rounded-full ${
                      dept.score >= 85 ? "bg-green-600" :
                      dept.score >= 70 ? "bg-blue-600" :
                      "bg-orange-600"
                    }`}
                    style={{ width: `${dept.score}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {dept.strengths.map((strength) => (
                    <span key={strength} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}