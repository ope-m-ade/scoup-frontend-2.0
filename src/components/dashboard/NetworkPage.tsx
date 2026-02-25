import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Mail,
  Building2,
  FolderOpen,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authAPI, facultyAPI, projectsAPI } from "../../utils/api";

type ColleagueMatch = {
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
};

type ProjectOpportunity = {
  id: string;
  title: string;
  leadFaculty: string[];
  department: string;
  description: string;
  status: string;
  relevanceScore: number;
  relevanceReason: string;
};

const normalizePhotoUrl = (value: unknown): string => {
  if (typeof value !== "string" || value.trim().length === 0) return "";
  const raw = value.trim();
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const configuredApi = import.meta.env.VITE_API_BASE_URL || "";
  if (!configuredApi) return raw;
  try {
    const origin = new URL(configuredApi).origin;
    if (!raw.startsWith("/")) return `${origin}/media/${raw.replace(/^media\//, "")}`;
    return `${origin}${raw}`;
  } catch {
    return raw;
  }
};

const toKeywordList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((x) => String(x).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
};

export function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"colleagues" | "projects">("colleagues");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentUserInterests, setCurrentUserInterests] = useState<string[]>([]);
  const [colleagueMatches, setColleagueMatches] = useState<ColleagueMatch[]>([]);
  const [projectOpportunities, setProjectOpportunities] = useState<ProjectOpportunity[]>([]);

  useEffect(() => {
    const loadNetworkData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [me, facultyRows, projectRows] = await Promise.all([
          authAPI.me(),
          facultyAPI.getAll(),
          projectsAPI.getAll(),
        ]);

        const myKeywords = toKeywordList(me?.keywords)
          .concat(toKeywordList(me?.faculty_keywords))
          .concat(toKeywordList(me?.ai_keywords));
        const normalizedMine = Array.from(new Set(myKeywords.map((k) => k.toLowerCase())));
        setCurrentUserInterests(normalizedMine);

        const facultyList = Array.isArray(facultyRows)
          ? facultyRows
          : Array.isArray(facultyRows?.results)
            ? facultyRows.results
            : [];

        const meId = me?.id;

        const colleagues: ColleagueMatch[] = facultyList
          .filter((f: any) => String(f?.id) !== String(meId))
          .map((faculty: any) => {
            const interests = toKeywordList(faculty?.keywords)
              .concat(toKeywordList(faculty?.faculty_keywords))
              .concat(toKeywordList(faculty?.ai_keywords))
              .concat(toKeywordList(faculty?.research_interests));
            const normalizedInterests = interests.map((k) => k.toLowerCase());
            const sharedKeywords = normalizedInterests.filter((k) => normalizedMine.includes(k));
            const uniqueShared = Array.from(new Set(sharedKeywords));
            const matchScore = Math.min(95, normalizedMine.length === 0 ? 55 : 50 + uniqueShared.length * 12);

            const matchReason =
              uniqueShared.length > 0
                ? `Shared expertise in ${uniqueShared.slice(0, 3).join(", ")}.`
                : `Complementary expertise in ${faculty?.department || "related fields"}.`;

            const name =
              faculty?.name || `${faculty?.first_name || ""} ${faculty?.last_name || ""}`.trim() || "Faculty";

            return {
              id: String(faculty?.id ?? ""),
              name,
              title: faculty?.title || "",
              department: faculty?.department || "",
              photo: normalizePhotoUrl(faculty?.photo || faculty?.profile_photo),
              email: faculty?.email || "",
              researchInterests: interests,
              matchScore,
              matchReason,
              sharedKeywords: uniqueShared,
            };
          })
          .sort((a, b) => b.matchScore - a.matchScore);

        setColleagueMatches(colleagues);

        const projectsList = Array.isArray(projectRows)
          ? projectRows
          : Array.isArray(projectRows?.results)
            ? projectRows.results
            : [];

        const opportunities: ProjectOpportunity[] = projectsList.map((project: any) => {
          const projectKeywords = toKeywordList(project?.keywords).map((k) => k.toLowerCase());
          const overlap = projectKeywords.filter((k) => normalizedMine.includes(k));
          const score = Math.min(95, 52 + overlap.length * 10);

          return {
            id: String(project?.id ?? ""),
            title: project?.title || "Untitled project",
            leadFaculty: Array.isArray(project?.leadFaculty)
              ? project.leadFaculty
              : Array.isArray(project?.faculty)
                ? project.faculty.map((f: any) => String(f?.name || f || ""))
                : [],
            department: project?.department || "",
            description: project?.description || "",
            status: project?.status || "active",
            relevanceScore: score,
            relevanceReason:
              overlap.length > 0
                ? `Keyword overlap: ${overlap.slice(0, 3).join(", ")}.`
                : "Potential interdisciplinary fit.",
          };
        });

        setProjectOpportunities(opportunities.sort((a, b) => b.relevanceScore - a.relevanceScore));
      } catch (err: any) {
        setError(err?.message || "Unable to load collaboration network.");
      } finally {
        setIsLoading(false);
      }
    };

    loadNetworkData();
  }, []);

  const filteredColleagues = useMemo(
    () =>
      colleagueMatches.filter((colleague) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          q.length === 0 ||
          colleague.name.toLowerCase().includes(q) ||
          colleague.department.toLowerCase().includes(q) ||
          colleague.researchInterests.some((interest) => interest.toLowerCase().includes(q));

        const matchesDepartment = departmentFilter === "all" || colleague.department === departmentFilter;
        return matchesSearch && matchesDepartment;
      }),
    [colleagueMatches, searchQuery, departmentFilter],
  );

  const filteredProjects = useMemo(
    () =>
      projectOpportunities.filter((project) => {
        const q = searchQuery.trim().toLowerCase();
        return (
          q.length === 0 ||
          project.title.toLowerCase().includes(q) ||
          project.description.toLowerCase().includes(q) ||
          project.leadFaculty.some((faculty) => faculty.toLowerCase().includes(q))
        );
      }),
    [projectOpportunities, searchQuery],
  );

  const departments = useMemo(
    () => ["all", ...Array.from(new Set(colleagueMatches.map((f) => f.department).filter(Boolean)))],
    [colleagueMatches],
  );

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collaboration Network</h1>
        <p className="text-gray-600 mt-1">
          Discover colleagues with complementary expertise and find collaboration opportunities
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#8b0000] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Live Collaboration Discovery</p>
            <p className="text-sm text-gray-700">
              Matches are generated from current profile keywords and live faculty/project endpoint data.
            </p>
          </div>
        </div>
      </div>

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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000]"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

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

      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-600">Loading collaboration data...</div>
      ) : activeTab === "colleagues" ? (
        <div className="space-y-4">
          {filteredColleagues.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No colleagues found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredColleagues.map((colleague) => (
              <div key={colleague.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                    {colleague.photo ? (
                      <img src={colleague.photo} alt={colleague.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">{colleague.name.slice(0, 1)}</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-1">{colleague.name}</h3>
                        <p className="text-sm text-gray-600">{colleague.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-600">{colleague.department}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getMatchColor(colleague.matchScore)}`}>
                        {colleague.matchScore}% · {getMatchLabel(colleague.matchScore)}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3 text-sm text-gray-700">
                      {colleague.matchReason}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {colleague.sharedKeywords.slice(0, 5).map((keyword) => (
                        <span key={keyword} className="px-2 py-1 bg-[#ffd100]/20 text-[#8b0000] text-xs rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {colleague.email && (
                        <a href={`mailto:${colleague.email}`}>
                          <Button size="sm" className="bg-[#8b0000] hover:bg-[#700000]">
                            <Mail className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                        </a>
                      )}
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No project opportunities found</h3>
              <p className="text-gray-600">Try a broader search query</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-900 mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    <div className="text-xs text-gray-500">Lead: {project.leadFaculty.join(", ") || "N/A"}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getMatchColor(project.relevanceScore)}`}>
                    {project.relevanceScore}% Relevance
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-gray-700">
                  {project.relevanceReason}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {currentUserInterests.length === 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Add keywords in your profile to improve collaboration matching.
        </div>
      )}
    </div>
  );
}
