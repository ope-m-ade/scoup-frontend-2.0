import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Alert, AlertDescription } from "../ui/alert";
import { apiCall } from "../../utils/api";
import { 
  CheckCircle2, 
  XCircle,
  FileText, 
  Lightbulb, 
  FolderOpen, 
  AlertTriangle,
  User,
  Building2,
  TrendingUp,
  Eye,
  ChevronRight,
  Plus,
  Globe,
  Mail
} from "lucide-react";

interface Paper {
  id: string;
  title: string;
  year: number;
  citations?: number;
  journal: string;
}

interface Patent {
  id: string;
  title: string;
  year: number;
  patentNumber: string;
}

interface Project {
  id: string;
  title: string;
  fundingAmount?: string;
  status: string;
}

interface SuggestedPaper {
  id: string | number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  citations: number;
  source: string;
  matchScore: number;
  url?: string;
}

interface SuggestedProfile {
  id: string | number;
  name: string;
  email?: string;
  department?: string;
  institution?: string;
  matchScore: number;
  source: string;
  externalFacultyId?: number;
  papers: SuggestedPaper[];
  patents: any[];
  projects: any[];
  profileImage?: string;
}

interface SuggestedPatent {
  id: string | number;
  title: string;
  patentNumber: string;
  inventors: string;
  year: number;
  source: string;
  matchScore: number;
  url?: string;
}

interface SuggestedProject {
  id: string | number;
  title: string;
  description: string;
  fundingAgency?: string;
  amount?: string;
  year: number;
  source: string;
  matchScore: number;
}

interface DashboardOverviewProps {
  onNavigate?: (tab: string) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  // Current verified data from database backend
  const [myPapers, setMyPapers] = useState<Paper[]>([]);
  const [myPatents, setMyPatents] = useState<Patent[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  
  // Suggestions from external sources (scraped data)
  const [suggestedProfiles, setSuggestedProfiles] = useState<SuggestedProfile[]>([]);
  const [suggestedPapers, setSuggestedPapers] = useState<SuggestedPaper[]>([]);
  const [suggestedPatents, setSuggestedPatents] = useState<SuggestedPatent[]>([]);
  const [suggestedProjects, setSuggestedProjects] = useState<SuggestedProject[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profiles" | "papers" | "patents" | "projects">("profiles");
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    try {
      const [papersData, patentsData, projectsData, suggestionsData] =
        await Promise.all([
          apiCall("/papers/"),
          apiCall("/patents/"),
          apiCall("/projects/"),
          apiCall("/faculty/me/suggestions/"),
        ]);

      const papersRows = Array.isArray(papersData) ? papersData : papersData?.results || [];
      const patentsRows = Array.isArray(patentsData) ? patentsData : patentsData?.results || [];
      const projectsRows = Array.isArray(projectsData) ? projectsData : projectsData?.results || [];
      const suggestionRows = Array.isArray(suggestionsData?.suggestions)
        ? suggestionsData.suggestions
        : [];

      setMyPapers(
        papersRows.map((paper: any, index: number) => ({
          id: String(paper?.id ?? index),
          title: paper?.title ?? "",
          year: Number(paper?.year ?? new Date().getFullYear()),
          citations: Number(paper?.tc_count ?? 0),
          journal: paper?.journal ?? "",
        })),
      );

      setMyPatents(
        patentsRows.map((patent: any, index: number) => ({
          id: String(patent?.id ?? index),
          title: patent?.title ?? "",
          year:
            patent?.issue_date && String(patent.issue_date).includes("-")
              ? Number(String(patent.issue_date).split("-")[0])
              : 0,
          patentNumber: patent?.patent_number ?? patent?.patentNumber ?? "",
        })),
      );

      setMyProjects(
        projectsRows.map((project: any, index: number) => ({
          id: String(project?.id ?? index),
          title: project?.title ?? "",
          fundingAmount: project?.funding_amount ?? project?.fundingAmount ?? "",
          status: project?.status ?? "active",
        })),
      );

      setSuggestedProfiles(
        suggestionRows.map((item: any, index: number) => ({
          id: String(item?.id ?? index),
          externalFacultyId: Number(item?.id),
          name: item?.name ?? "Suggested profile",
          email: item?.email ?? "",
          department: item?.department ?? "",
          institution: "External Source",
          matchScore: Number(item?.score ?? item?.matchScore ?? 0),
          source: (Array.isArray(item?.reasons) && item.reasons[0]) || "Name/keyword similarity",
          papers: [],
          patents: [],
          projects: [],
        })),
      );

      setSuggestedPapers([]);
      setSuggestedPatents([]);
      setSuggestedProjects([]);

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setIsLoading(false);
    }
  };

  const getTotalCitations = () => {
    return myPapers.reduce((sum, p) => sum + (p.citations || 0), 0);
  };

  const getTotalFunding = () => {
    const total = myProjects.reduce((sum, p) => {
      if (p.fundingAmount) {
        const amount = p.fundingAmount.replace(/[$,]/g, '');
        return sum + (parseInt(amount) || 0);
      }
      return sum;
    }, 0);
    return `$${(total / 1000).toFixed(0)}K`;
  };

  const handleClaimProfile = async (profile: SuggestedProfile) => {
    try {
      if (profile.externalFacultyId) {
        await apiCall(`/faculty/me/suggestions/${profile.externalFacultyId}/approve/`, {
          method: "POST",
        });
      }
      setSuggestedProfiles((prev) =>
        prev.filter((p) => String(p.id) !== String(profile.id)),
      );
      fetchDashboardData();
    } catch (err) {
      console.error('Error claiming profile:', err);
    }
  };

  const handleClaimPaper = async (paper: SuggestedPaper) => {
    try {
      // TODO: API call to claim individual paper
      setSuggestedPapers((prev) =>
        prev.filter((p) => String(p.id) !== String(paper.id)),
      );
    } catch (err) {
      console.error('Error claiming paper:', err);
    }
  };

  const handleClaimPatent = async (patent: SuggestedPatent) => {
    try {
      // TODO: API call to claim patent
      setSuggestedPatents((prev) =>
        prev.filter((p) => String(p.id) !== String(patent.id)),
      );
    } catch (err) {
      console.error('Error claiming patent:', err);
    }
  };

  const handleClaimProject = async (project: SuggestedProject) => {
    try {
      // TODO: API call to claim project
      setSuggestedProjects((prev) =>
        prev.filter((p) => String(p.id) !== String(project.id)),
      );
    } catch (err) {
      console.error('Error claiming project:', err);
    }
  };

  const handleReject = async (
    id: string | number,
    type: "profile" | "paper" | "patent" | "project",
  ) => {
    const normalizedId = String(id);
    try {
      if (type === "profile") {
        const profile = suggestedProfiles.find((p) => String(p.id) === normalizedId);
        if (profile?.externalFacultyId) {
          await apiCall(`/faculty/me/suggestions/${profile.externalFacultyId}/reject/`, {
            method: "POST",
          });
        }
      }
      if (type === "profile") {
        setSuggestedProfiles((prev) =>
          prev.filter((p) => String(p.id) !== normalizedId),
        );
      }
      if (type === "paper") {
        setSuggestedPapers((prev) =>
          prev.filter((p) => String(p.id) !== normalizedId),
        );
      }
      if (type === "patent") {
        setSuggestedPatents((prev) =>
          prev.filter((p) => String(p.id) !== normalizedId),
        );
      }
      if (type === "project") {
        setSuggestedProjects((prev) =>
          prev.filter((p) => String(p.id) !== normalizedId),
        );
      }
    } catch (err) {
      console.error('Error rejecting:', err);
    }
  };

  const getTotalSuggestions = () => {
    return suggestedProfiles.length + suggestedPapers.length + 
           suggestedPatents.length + suggestedProjects.length;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Your research profile from Salisbury University database
        </p>
      </div>

      {/* Section 1: Your Verified Research Profile */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your Verified Research Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate?.("papers")}>
            <div className="flex items-center justify-between mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{myPapers.length}</p>
            <p className="text-sm text-gray-600 mt-1">Published Papers</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate?.("patents")}>
            <div className="flex items-center justify-between mb-3">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <ChevronRight className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{myPatents.length}</p>
            <p className="text-sm text-gray-600 mt-1">Patents</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate?.("projects")}>
            <div className="flex items-center justify-between mb-3">
              <FolderOpen className="w-5 h-5 text-orange-600" />
              <ChevronRight className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">{myProjects.length}</p>
            <p className="text-sm text-gray-600 mt-1">Active Projects</p>
            <p className="text-xs text-gray-500 mt-2">Funding: {getTotalFunding()}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate?.("analytics")}>
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <ChevronRight className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{getTotalCitations()}</p>
            <p className="text-sm text-gray-600 mt-1">Total Citations</p>
          </Card>
        </div>
      </div>

      {/* Section 2: Recent Publications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Publications</h2>
          <Button variant="ghost" className="text-[#8b0000]" onClick={() => onNavigate?.("papers")}>
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myPapers.slice(0, 2).map((paper) => (
            <Card key={paper.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{paper.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <span>{paper.journal}</span>
                    <span>•</span>
                    <span>{paper.year}</span>
                    {paper.citations && (
                      <>
                        <span>•</span>
                        <span className="font-semibold">{paper.citations} citations</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 3: Suggestions from External Sources */}
      {getTotalSuggestions() > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Suggestions from External Sources
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Review {getTotalSuggestions()} items that might belong to you
              </p>
            </div>
            <Badge className="bg-[#8b0000] text-white px-4 py-1">
              {getTotalSuggestions()} Pending
            </Badge>
          </div>

          <Alert className="border-[#8b0000] bg-[#8b0000] bg-opacity-5 mb-4">
            <AlertTriangle className="h-4 w-4 text-[#8b0000]" />
            <AlertDescription>
              <p className="text-sm text-gray-700">
                These suggestions come from public databases (Google Scholar, ResearchGate, IEEE, USPTO, NSF). 
                Claim items that belong to you.
              </p>
            </AlertDescription>
          </Alert>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profiles")}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === "profiles"
                  ? "border-[#8b0000] text-[#8b0000]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Faculty Profiles
                <Badge variant="secondary">{suggestedProfiles.length}</Badge>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("papers")}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === "papers"
                  ? "border-[#8b0000] text-[#8b0000]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Papers
                <Badge variant="secondary">{suggestedPapers.length}</Badge>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("patents")}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === "patents"
                  ? "border-[#8b0000] text-[#8b0000]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Patents
                <Badge variant="secondary">{suggestedPatents.length}</Badge>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === "projects"
                  ? "border-[#8b0000] text-[#8b0000]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Projects
                <Badge variant="secondary">{suggestedProjects.length}</Badge>
              </div>
            </button>
          </div>

          <div className="space-y-3">
            {/* Faculty Profiles Tab */}
            {activeTab === "profiles" && suggestedProfiles.map((profile) => {
              const profileId = String(profile.id);
              const isExpanded = expandedProfile === profileId;
              const totalItems = profile.papers.length + profile.patents.length + profile.projects.length;

              return (
                <Card key={profileId} className="overflow-hidden border hover:border-[#8b0000] transition-all">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={profile.profileImage} />
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                            {profile.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Mail className="w-3 h-3" />
                                {profile.email}
                              </div>
                            )}
                            {profile.department && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Building2 className="w-3 h-3" />
                                {profile.department}
                              </div>
                            )}
                          </div>
                          
                          <Badge className="bg-gray-900 text-white">
                            {profile.matchScore}% Match
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            {profile.source}
                          </Badge>
                          <span className="text-xs text-gray-600">
                            {totalItems} items
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleClaimProfile(profile)}
                        className="bg-[#8b0000] hover:bg-[#700000] flex-1"
                        size="sm"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Claim All ({totalItems})
                      </Button>
                      <Button
                        onClick={async () => {
                          if (!isExpanded && profile.externalFacultyId) {
                            try {
                              const preview = await apiCall(
                                `/faculty/me/suggestions/${profile.externalFacultyId}/preview/`,
                              );
                              setSuggestedProfiles((prev) =>
                                prev.map((p) =>
                                  p.id === profile.id
                                    ? {
                                        ...p,
                                        papers: Array.isArray(preview?.papers)
                                          ? preview.papers.map((paper: any) => ({
                                              id: String(paper?.id ?? ""),
                                              title: paper?.title ?? "",
                                              authors: "",
                                              journal: paper?.journal ?? "",
                                              year: Number(paper?.year ?? 0),
                                              citations: 0,
                                              source: "External Source",
                                              matchScore: p.matchScore,
                                              url: "",
                                            }))
                                          : [],
                                        patents: Array.isArray(preview?.patents)
                                          ? preview.patents
                                          : [],
                                        projects: Array.isArray(preview?.projects)
                                          ? preview.projects
                                          : [],
                                      }
                                    : p,
                                ),
                              );
                            } catch (err) {
                              console.error("Error loading suggestion preview:", err);
                            }
                          }
                          setExpandedProfile(isExpanded ? null : profileId);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {isExpanded ? 'Hide' : 'Preview'}
                      </Button>
                      <Button
                        onClick={() => handleReject(profileId, 'profile')}
                        variant="ghost"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="border-t bg-gray-50 p-4 space-y-4">
                      {profile.papers.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 mb-2">Papers ({profile.papers.length})</h4>
                          {profile.papers.map((paper) => (
                            <div key={paper.id} className="bg-white p-3 rounded border mb-2">
                              <h5 className="text-sm font-medium text-gray-900">{paper.title}</h5>
                              <p className="text-xs text-gray-600 mt-1">{paper.authors}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">{paper.journal}</Badge>
                                <span className="text-xs text-gray-500">{paper.year}</span>
                                <span className="text-xs text-gray-700">{paper.citations} citations</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}

            {/* Papers Tab */}
            {activeTab === "papers" && suggestedPapers.map((paper) => (
              <Card key={paper.id} className="p-4 border hover:border-[#8b0000] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{paper.title}</h3>
                        <Badge className="bg-gray-900 text-white flex-shrink-0">
                          {paper.matchScore}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{paper.authors}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{paper.journal}</Badge>
                        <span className="text-xs text-gray-500">{paper.year}</span>
                        <span className="text-xs text-gray-700">{paper.citations} citations</span>
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          {paper.source}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleClaimPaper(paper)}
                      className="bg-[#8b0000] hover:bg-[#700000]"
                      size="sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Claim
                    </Button>
                    <Button
                      onClick={() => handleReject(paper.id, 'paper')}
                      variant="ghost"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Patents Tab */}
            {activeTab === "patents" && suggestedPatents.map((patent) => (
              <Card key={patent.id} className="p-4 border hover:border-[#8b0000] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{patent.title}</h3>
                        <Badge className="bg-gray-900 text-white flex-shrink-0">
                          {patent.matchScore}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{patent.inventors}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{patent.patentNumber}</Badge>
                        <span className="text-xs text-gray-500">{patent.year}</span>
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          {patent.source}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleClaimPatent(patent)}
                      className="bg-[#8b0000] hover:bg-[#700000]"
                      size="sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Claim
                    </Button>
                    <Button
                      onClick={() => handleReject(patent.id, 'patent')}
                      variant="ghost"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Projects Tab */}
            {activeTab === "projects" && suggestedProjects.map((project) => (
              <Card key={project.id} className="p-4 border hover:border-[#8b0000] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <Badge className="bg-gray-900 text-white flex-shrink-0">
                          {project.matchScore}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                      <div className="flex items-center gap-2">
                        {project.fundingAgency && (
                          <Badge variant="secondary" className="text-xs">{project.fundingAgency}</Badge>
                        )}
                        {project.amount && (
                          <span className="text-xs font-semibold text-gray-900">{project.amount}</span>
                        )}
                        <span className="text-xs text-gray-500">{project.year}</span>
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          {project.source}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleClaimProject(project)}
                      className="bg-[#8b0000] hover:bg-[#700000]"
                      size="sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Claim
                    </Button>
                    <Button
                      onClick={() => handleReject(project.id, 'project')}
                      variant="ghost"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onNavigate?.("papers")}>
            <Plus className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Add Publication</h3>
            <p className="text-sm text-gray-600">Manually add a new paper to your profile</p>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onNavigate?.("upload")}>
            <FileText className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Upload PDF</h3>
            <p className="text-sm text-gray-600">Extract metadata from a research paper</p>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onNavigate?.("network")}>
            <Building2 className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Find Collaborators</h3>
            <p className="text-sm text-gray-600">Discover faculty with similar research</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
