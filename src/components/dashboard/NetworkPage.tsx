import { useState } from "react";
import { Users, Search, Mail, Building2, FolderOpen, Sparkles, TrendingUp, AlertCircle, ExternalLink, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { facultyData, projectsData } from "../../data/searchData";

interface ColleagueMatch {
  id: string;
  name: string;
  title: string;
  department: string;
  photo: string;
  email: string;
  researchInterests: string[];
  matchScore: number;
  matchReason: string;
  sharedKeywords: string[];
}

interface ProjectOpportunity {
  id: string;
  title: string;
  leadFaculty: string[];
  department: string;
  description: string;
  status: string;
  lookingForCollaborators: boolean;
  relevanceScore: number;
  relevanceReason: string;
}

export function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"colleagues" | "projects">("colleagues");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // Mock current user's interests (in real app, this would come from logged-in user's profile)
  const currentUserInterests = ["Machine Learning", "Artificial Intelligence", "Data Science", "Natural Language Processing"];

  // Generate colleague matches based on overlapping interests
  const generateColleagueMatches = (): ColleagueMatch[] => {
    return facultyData.map(faculty => {
      const sharedKeywords = faculty.researchInterests.filter(interest =>
        currentUserInterests.some(userInterest =>
          interest.toLowerCase().includes(userInterest.toLowerCase()) ||
          userInterest.toLowerCase().includes(interest.toLowerCase())
        )
      );

      const matchScore = Math.min(95, 45 + (sharedKeywords.length * 15) + Math.floor(Math.random() * 20));

      let matchReason = "";
      if (sharedKeywords.length >= 3) {
        matchReason = `Strong alignment in ${sharedKeywords.slice(0, 3).join(", ")}. Excellent potential for cross-departmental collaboration.`;
      } else if (sharedKeywords.length >= 2) {
        matchReason = `Shared expertise in ${sharedKeywords.join(" and ")}. Good opportunity for interdisciplinary research.`;
      } else if (sharedKeywords.length === 1) {
        matchReason = `Common interest in ${sharedKeywords[0]}. Potential for collaborative projects in this area.`;
      } else {
        matchReason = `Complementary expertise in ${faculty.department}. Could provide unique perspectives for your research.`;
      }

      return {
        id: faculty.id,
        name: faculty.name,
        title: faculty.title,
        department: faculty.department,
        photo: faculty.photo,
        email: faculty.email,
        researchInterests: faculty.researchInterests,
        matchScore,
        matchReason,
        sharedKeywords,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  // Generate project opportunities
  const generateProjectOpportunities = (): ProjectOpportunity[] => {
    return projectsData.map(project => {
      const relevanceScore = Math.min(95, 50 + Math.floor(Math.random() * 45));
      const lookingForCollaborators = Math.random() > 0.5;

      let relevanceReason = "";
      if (relevanceScore >= 80) {
        relevanceReason = `Your expertise in ${currentUserInterests[0]} aligns perfectly with this project's objectives. The team is actively seeking co-PIs.`;
      } else if (relevanceScore >= 65) {
        relevanceReason = `Your background could complement this project's current team. Consider reaching out to explore collaboration opportunities.`;
      } else {
        relevanceReason = `This project shares some thematic overlap with your research interests. Potential for cross-pollination of ideas.`;
      }

      return {
        id: project.id,
        title: project.title,
        leadFaculty: project.leadFaculty,
        department: project.leadFaculty.join(", "),
        description: project.description,
        status: project.status,
        lookingForCollaborators,
        relevanceScore,
        relevanceReason,
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  const colleagueMatches = generateColleagueMatches();
  const projectOpportunities = generateProjectOpportunities();

  // Filter based on search and department
  const filteredColleagues = colleagueMatches.filter(colleague => {
    const matchesSearch = searchQuery === "" ||
      colleague.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      colleague.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      colleague.researchInterests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDepartment = departmentFilter === "all" || colleague.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const filteredProjects = projectOpportunities.filter(project => {
    const matchesSearch = searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.leadFaculty.some(faculty => faculty.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  // Get unique departments for filter
  const departments = ["all", ...new Set(facultyData.map(f => f.department))];

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 65) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return "Highly Compatible";
    if (score >= 65) return "Good Match";
    return "Potential Match";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collaboration Network</h1>
        <p className="text-gray-600 mt-1">
          Discover colleagues with complementary expertise and find collaboration opportunities
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#8b0000] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              AI-Powered Collaboration Discovery
            </p>
            <p className="text-sm text-gray-700">
              Based on your profile and research interests, we've identified colleagues and projects that align with your expertise. Match scores indicate collaboration potential.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, department, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {activeTab === "colleagues" && (
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("colleagues")}
            className={`pb-3 px-1 font-medium transition-colors border-b-2 ${
              activeTab === "colleagues"
                ? "border-[#8b0000] text-[#8b0000]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Colleagues ({filteredColleagues.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-3 px-1 font-medium transition-colors border-b-2 ${
              activeTab === "projects"
                ? "border-[#8b0000] text-[#8b0000]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Projects ({filteredProjects.length})
            </div>
          </button>
        </div>
      </div>

      {/* Colleagues Tab */}
      {activeTab === "colleagues" && (
        <div className="space-y-4">
          {filteredColleagues.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No colleagues found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredColleagues.map(colleague => (
              <div
                key={colleague.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-6">
                  {/* Profile Photo */}
                  <img
                    src={colleague.photo}
                    alt={colleague.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header with Match Score */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-1">
                          {colleague.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {colleague.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-600">{colleague.department}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getMatchColor(colleague.matchScore)}`}>
                        {colleague.matchScore}% · {getMatchLabel(colleague.matchScore)}
                      </div>
                    </div>

                    {/* AI Match Reason */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-900">
                        <span className="font-medium">Why this match: </span>
                        {colleague.matchReason}
                      </p>
                    </div>

                    {/* Research Interests */}
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Research Interests
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {colleague.researchInterests.map((interest, i) => {
                          const isShared = colleague.sharedKeywords.includes(interest);
                          return (
                            <span
                              key={i}
                              className={`px-3 py-1 text-xs rounded-full font-medium ${
                                isShared
                                  ? "bg-gradient-to-r from-[#8b0000] to-[#6b0000] text-white"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {interest}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Contact Button */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                      <Button
                        className="bg-[#8b0000] hover:bg-[#6b0000] text-[#ffd100]"
                        size="sm"
                        onClick={() => window.location.href = `mailto:${colleague.email}?subject=Collaboration Opportunity via SCOUP&body=Hello ${colleague.name.split(' ')[0]},%0D%0A%0D%0AI came across your profile on SCOUP and was impressed by your work in ${colleague.sharedKeywords[0] || colleague.researchInterests[0]}. I'd love to discuss potential collaboration opportunities.%0D%0A%0D%0A`}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Request Collaboration
                      </Button>
                      <a
                        href={`mailto:${colleague.email}`}
                        className="text-sm text-gray-600 hover:text-[#8b0000] transition-colors"
                      >
                        {colleague.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600">Try adjusting your search</p>
            </div>
          ) : (
            filteredProjects.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header with Relevance Score */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-medium text-gray-900">
                        {project.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        project.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {project.status}
                      </span>
                      {project.lookingForCollaborators && (
                        <span className="px-2 py-1 text-xs rounded-full font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Seeking Collaborators
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Lead: {project.leadFaculty.join(", ")}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getMatchColor(project.relevanceScore)}`}>
                    {project.relevanceScore}% Match
                  </div>
                </div>

                {/* AI Relevance Reason */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-900">
                    <span className="font-medium">Why this project: </span>
                    {project.relevanceReason}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4">
                  {project.description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <Button
                    className="bg-[#8b0000] hover:bg-[#6b0000] text-[#ffd100]"
                    size="sm"
                    onClick={() => {
                      const leadEmail = facultyData.find(f => f.name === project.leadFaculty[0])?.email || "";
                      window.location.href = `mailto:${leadEmail}?subject=Interest in ${project.title}&body=Hello,%0D%0A%0D%0AI found your project "${project.title}" on SCOUP and am interested in learning more about collaboration opportunities.%0D%0A%0D%0A`;
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Express Interest
                  </Button>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Reduce research duplication</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}