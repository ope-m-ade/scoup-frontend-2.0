import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  FileText,
  Lightbulb,
  GraduationCap,
  Send,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authAPI, networkAPI } from "../../utils/api";
import { fetchPublicDataset } from "../../utils/publicData";
import type { FacultyMember, Paper, Patent, Project } from "../../data/searchData";
import { getInitials } from "../../utils/avatar";

type ActiveTab = "colleagues" | "papers" | "patents" | "projects";

type ColleagueMatch = {
  id: string;
  name: string;
  title: string;
  department: string;
  school: string;
  photo: string;
  email: string;
  bio: string;
  researchInterests: string[];
  matchScore: number;
  matchReason: string;
  sharedKeywords: string[];
  collaborationScore: number;
  articleCount: number;
  totalCitations: number;
};

type PaperOpportunity = {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  link: string;
  keywords: string[];
  departments: string[];
  schools: string[];
  citations: number;
  relevanceScore: number;
  relevanceReason: string;
  sharedKeywords: string[];
};

type PatentOpportunity = {
  id: string;
  title: string;
  inventors: string[];
  patentNumber: string;
  year: number;
  description: string;
  link: string;
  keywords: string[];
  departments: string[];
  schools: string[];
  relevanceScore: number;
  relevanceReason: string;
  sharedKeywords: string[];
};

type ProjectOpportunity = {
  id: string;
  title: string;
  leadFaculty: string[];
  department: string;
  school: string;
  description: string;
  status: string;
  keywords: string[];
  relevanceScore: number;
  relevanceReason: string;
  sharedKeywords: string[];
};

const DEFAULT_RESULT_LIMIT = 5;

const SU_SCHOOLS = [
  "college of health and human services",
  "fulton school of liberal arts",
  "henson school of science & technology",
  "henson school of science and technology",
  "perdue school of business",
  "seidel school of education",
  "clarke honors college",
];

const normalizePhotoUrl = (value: unknown): string => {
  if (typeof value !== "string" || value.trim().length === 0) return "";
  const raw = value.trim();
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:")) return raw;
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

const cleanText = (value: unknown): string => String(value ?? "").trim();

const normalizeComparable = (value: unknown): string =>
  cleanText(value).toLowerCase().replace(/\s+/g, " ");

const uniqueStrings = (items: unknown[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  items.forEach((item) => {
    const value = cleanText(item);
    if (!value) return;
    const key = normalizeComparable(value);
    if (seen.has(key)) return;
    seen.add(key);
    result.push(value);
  });

  return result;
};

const toKeywordList = (value: unknown): string[] => {
  if (Array.isArray(value)) return uniqueStrings(value.flatMap((item) => toKeywordList(item)));
  if (typeof value === "string") return uniqueStrings(value.split(",").map((item) => item.trim()));
  return [];
};

const toLowerList = (items: unknown[]): string[] =>
  uniqueStrings(items).map((item) => normalizeComparable(item));

const hasOverlap = (left: string[], right: string[]) => {
  const rightSet = new Set(right.map(normalizeComparable));
  return left.some((item) => rightSet.has(normalizeComparable(item)));
};

const getSharedKeywords = (candidateKeywords: string[], myKeywords: string[]) => {
  const mine = new Set(myKeywords.map(normalizeComparable));
  return uniqueStrings(
    candidateKeywords.filter((keyword) => mine.has(normalizeComparable(keyword))),
  ).slice(0, 6);
};

const getSchool = (schools: string[]) => schools[0] || "";

const isCanonicalSUSchool = (value: string) => {
  const normalized = normalizeComparable(value).replace(/&/g, "and");
  return SU_SCHOOLS.some((school) => normalized === school.replace(/&/g, "and"));
};

const sourceValue = (source: Record<string, unknown> | undefined, ...keys: string[]) => {
  if (!source) return "";
  for (const key of keys) {
    const value = cleanText(source[key]);
    if (value) return value;
  }
  return "";
};

const isSalisburyAffiliatedFaculty = (faculty: FacultyMember) => {
  const email = normalizeComparable(faculty.email);
  const departments = faculty.departmentAffiliations ?? [];
  const schools = faculty.schoolAffiliations ?? [];
  const source = faculty.sourceProfile;
  const sourceInstitution = sourceValue(source, "institution", "organization", "university", "school");
  const sourceAffiliation = sourceValue(source, "affiliation", "affiliations");

  const hasSalisburyEmail = /@(salisbury\.edu|gulls\.salisbury\.edu)$/.test(email);
  const hasSalisburyText = [sourceInstitution, sourceAffiliation, faculty.department, faculty.title]
    .some((value) => normalizeComparable(value).includes("salisbury"));
  const hasCanonicalSchool = schools.some(isCanonicalSUSchool);
  const hasDepartmentEvidence = departments.some((department) => {
    const normalized = normalizeComparable(department);
    return normalized && normalized !== "unassigned" && !isCanonicalSUSchool(department);
  });

  return hasSalisburyEmail || hasSalisburyText || hasCanonicalSchool || hasDepartmentEvidence;
};

const hasSalisburyAffiliations = (departments: string[], schools: string[]) =>
  schools.some(isCanonicalSUSchool) ||
  departments.some((department) => normalizeComparable(department) !== "unassigned");

const buildProfileKeywords = (profile: any): string[] =>
  uniqueStrings([
    ...toKeywordList(profile?.keywords),
    ...toKeywordList(profile?.faculty_keywords),
    ...toKeywordList(profile?.ai_keywords),
    ...toKeywordList(profile?.research_interests),
    ...toKeywordList(profile?.researchInterests),
  ]);

const buildProfileDepartments = (profile: any): string[] =>
  uniqueStrings([
    ...toKeywordList(profile?.department_affiliations),
    ...toKeywordList(profile?.departmentAffiliations),
    profile?.department,
  ]).filter((item) => normalizeComparable(item) !== "unassigned");

const buildProfileSchools = (profile: any): string[] =>
  uniqueStrings([
    ...toKeywordList(profile?.school_affiliations),
    ...toKeywordList(profile?.schoolAffiliations),
    profile?.school,
  ]).filter(Boolean);

const scoreOpportunity = ({
  candidateKeywords,
  candidateDepartments,
  candidateSchools,
  myKeywords,
  myDepartments,
  mySchools,
  richness,
}: {
  candidateKeywords: string[];
  candidateDepartments: string[];
  candidateSchools: string[];
  myKeywords: string[];
  myDepartments: string[];
  mySchools: string[];
  richness: number;
}) => {
  const sharedKeywords = getSharedKeywords(candidateKeywords, myKeywords);
  const departmentMatch = hasOverlap(candidateDepartments, myDepartments);
  const schoolMatch = hasOverlap(candidateSchools, mySchools);

  const keywordScore = myKeywords.length > 0 ? Math.min(36, sharedKeywords.length * 12) : 0;
  const departmentScore = departmentMatch ? 12 : 0;
  const schoolScore = schoolMatch ? 8 : 0;
  const profileScore = Math.min(10, richness * 2);
  const fallbackScore = myKeywords.length === 0 ? 45 : 38;

  return {
    score: Math.min(96, fallbackScore + keywordScore + departmentScore + schoolScore + profileScore),
    sharedKeywords,
    departmentMatch,
    schoolMatch,
  };
};

const buildReason = ({
  sharedKeywords,
  departmentMatch,
  schoolMatch,
  fallback,
}: {
  sharedKeywords: string[];
  departmentMatch: boolean;
  schoolMatch: boolean;
  fallback: string;
}) => {
  if (sharedKeywords.length > 0 && departmentMatch) {
    return `Shared expertise in ${sharedKeywords.slice(0, 3).join(", ")} with department overlap.`;
  }
  if (sharedKeywords.length > 0 && schoolMatch) {
    return `Shared expertise in ${sharedKeywords.slice(0, 3).join(", ")} within a related school.`;
  }
  if (sharedKeywords.length > 0) {
    return `Shared expertise in ${sharedKeywords.slice(0, 3).join(", ")}.`;
  }
  if (departmentMatch) return "Potential fit based on department alignment.";
  if (schoolMatch) return "Potential fit based on school alignment.";
  return fallback;
};

const includesSearch = (values: unknown[], query: string) => {
  const q = normalizeComparable(query);
  if (!q) return true;
  return values.some((value) => normalizeComparable(value).includes(q));
};

export function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("colleagues");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [usesNetworkEndpoint, setUsesNetworkEndpoint] = useState(false);

  const [currentUserInterests, setCurrentUserInterests] = useState<string[]>([]);
  const [colleagueMatches, setColleagueMatches] = useState<ColleagueMatch[]>([]);
  const [paperOpportunities, setPaperOpportunities] = useState<PaperOpportunity[]>([]);
  const [patentOpportunities, setPatentOpportunities] = useState<PatentOpportunity[]>([]);
  const [projectOpportunities, setProjectOpportunities] = useState<ProjectOpportunity[]>([]);

  // Inquiry dialog state
  const [inquiryTarget, setInquiryTarget] = useState<ColleagueMatch | null>(null);
  const [inquiryNote, setInquiryNote] = useState("");
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState<string | null>(null);
  const inquiryTextareaRef = useRef<HTMLTextAreaElement>(null);

  const applyNetworkDiscovery = (discovery: any) => {
    const serverColleagues = Array.isArray(discovery?.colleagues)
      ? discovery.colleagues
      : [];
    const serverPapers = Array.isArray(discovery?.papers) ? discovery.papers : [];
    const serverPatents = Array.isArray(discovery?.patents) ? discovery.patents : [];
    const serverProjects = Array.isArray(discovery?.projects) ? discovery.projects : [];

    setCurrentUserInterests(toLowerList(toKeywordList(discovery?.profileKeywords)));
    setColleagueMatches(
      serverColleagues.map((item: any): ColleagueMatch => ({
        id: cleanText(item?.id),
        name: cleanText(item?.name) || "Faculty",
        title: cleanText(item?.title),
        department: cleanText(item?.department),
        school: cleanText(item?.school),
        photo: normalizePhotoUrl(item?.photo),
        email: cleanText(item?.email),
        bio: cleanText(item?.bio),
        researchInterests: uniqueStrings([
          ...toKeywordList(item?.keywords),
          ...toKeywordList(item?.sharedKeywords),
        ]),
        matchScore: Number(item?.matchScore ?? 0),
        matchReason: cleanText(item?.matchReason) || "Potential collaboration fit based on available SU profile data.",
        sharedKeywords: toKeywordList(item?.sharedKeywords),
        collaborationScore: Number(item?.collaborationScore ?? 0),
        articleCount: Number(item?.articleCount ?? 0),
        totalCitations: Number(item?.totalCitations ?? 0),
      })),
    );
    setPaperOpportunities(
      serverPapers.map((item: any): PaperOpportunity => ({
        id: cleanText(item?.id),
        title: cleanText(item?.title) || "Untitled paper",
        authors: toKeywordList(item?.authors),
        journal: cleanText(item?.journal),
        year: Number(item?.year ?? 0),
        abstract: cleanText(item?.abstract),
        link: cleanText(item?.link),
        keywords: toKeywordList(item?.keywords),
        departments: toKeywordList(item?.departments),
        schools: toKeywordList(item?.schools),
        citations: Number(item?.citations ?? 0),
        relevanceScore: Number(item?.relevanceScore ?? 0),
        relevanceReason: cleanText(item?.relevanceReason) || "Potential reading or collaboration lead based on SU publication data.",
        sharedKeywords: toKeywordList(item?.sharedKeywords),
      })),
    );
    setPatentOpportunities(
      serverPatents.map((item: any): PatentOpportunity => ({
        id: cleanText(item?.id),
        title: cleanText(item?.title) || "Untitled patent",
        inventors: toKeywordList(item?.inventors),
        patentNumber: cleanText(item?.patentNumber),
        year: Number(item?.year ?? 0),
        description: cleanText(item?.description),
        link: cleanText(item?.link),
        keywords: toKeywordList(item?.keywords),
        departments: toKeywordList(item?.departments),
        schools: toKeywordList(item?.schools),
        relevanceScore: Number(item?.relevanceScore ?? 0),
        relevanceReason: cleanText(item?.relevanceReason) || "Potential innovation lead based on SU patent data.",
        sharedKeywords: toKeywordList(item?.sharedKeywords),
      })),
    );
    setProjectOpportunities(
      serverProjects.map((item: any): ProjectOpportunity => ({
        id: cleanText(item?.id),
        title: cleanText(item?.title) || "Untitled project",
        leadFaculty: toKeywordList(item?.leadFaculty),
        department: cleanText(item?.department),
        school: cleanText(item?.school),
        description: cleanText(item?.description),
        status: cleanText(item?.status) || "Active",
        keywords: toKeywordList(item?.keywords),
        relevanceScore: Number(item?.relevanceScore ?? 0),
        relevanceReason: cleanText(item?.relevanceReason) || "Potential interdisciplinary project fit.",
        sharedKeywords: toKeywordList(item?.sharedKeywords),
      })),
    );
  };

  useEffect(() => {
    const loadNetworkData = async () => {
      setIsLoading(true);
      setError("");
      try {
        try {
          const discovery = await networkAPI.discovery({ limit: 50 });
          applyNetworkDiscovery(discovery);
          setUsesNetworkEndpoint(true);
          return;
        } catch (networkErr) {
          console.warn("Falling back to public dataset for network discovery:", networkErr);
          setUsesNetworkEndpoint(false);
        }

        const [me, publicDataset] = await Promise.all([
          authAPI.me(),
          fetchPublicDataset(),
        ]);

        const myKeywords = buildProfileKeywords(me);
        const myDepartments = buildProfileDepartments(me);
        const mySchools = buildProfileSchools(me);
        const myKeywordKeys = toLowerList(myKeywords);
        setCurrentUserInterests(myKeywordKeys);

        const meId = cleanText(me?.id);
        const meEmail = normalizeComparable(me?.email);
        const meName = normalizeComparable(
          me?.name || `${me?.first_name || ""} ${me?.last_name || ""}`.trim(),
        );

        const colleagues: ColleagueMatch[] = publicDataset.facultyData
          .filter((faculty) => isSalisburyAffiliatedFaculty(faculty))
          .filter((faculty) => {
            const candidateName = normalizeComparable(faculty.name);
            const candidateEmail = normalizeComparable(faculty.email);
            return (
              cleanText(faculty.id) !== meId &&
              (!meEmail || candidateEmail !== meEmail) &&
              (!meName || candidateName !== meName)
            );
          })
          .map((faculty) => {
            const departments = faculty.departmentAffiliations ?? [];
            const schools = faculty.schoolAffiliations ?? [];
            const interests = uniqueStrings([
              ...(faculty.researchInterests ?? []),
              ...(faculty.aiKeywords ?? []),
              ...(faculty.themes ?? []),
              ...(faculty.journals ?? []),
            ]);
            const richness = [
              faculty.email,
              faculty.title,
              faculty.department,
              getSchool(schools),
              faculty.bio,
              interests.length > 0 ? "keywords" : "",
              (faculty.metricsProfile?.articleCount ?? 0) > 0 ? "papers" : "",
            ].filter(Boolean).length;
            const score = scoreOpportunity({
              candidateKeywords: interests,
              candidateDepartments: departments,
              candidateSchools: schools,
              myKeywords,
              myDepartments,
              mySchools,
              richness,
            });

            return {
              id: faculty.id,
              name: faculty.name || "Faculty",
              title: faculty.title || "",
              department: faculty.department || departments[0] || "",
              school: getSchool(schools),
              photo: normalizePhotoUrl(faculty.photo),
              email: faculty.email || "",
              bio: faculty.bio || "",
              researchInterests: interests,
              matchScore: score.score,
              matchReason: buildReason({
                sharedKeywords: score.sharedKeywords,
                departmentMatch: score.departmentMatch,
                schoolMatch: score.schoolMatch,
                fallback: "Potential collaboration fit based on available SU profile data.",
              }),
              sharedKeywords: score.sharedKeywords,
              collaborationScore: score.score,
              articleCount: faculty.metricsProfile?.articleCount ?? 0,
              totalCitations: faculty.metricsProfile?.totalCitations ?? 0,
            };
          })
          .sort((a, b) => b.matchScore - a.matchScore || b.articleCount - a.articleCount);

        const papers: PaperOpportunity[] = publicDataset.papersData
          .filter((paper: Paper) =>
            hasSalisburyAffiliations(paper.departmentAffiliations ?? [], paper.schoolAffiliations ?? []),
          )
          .map((paper: Paper) => {
            const departments = paper.departmentAffiliations ?? [];
            const schools = paper.schoolAffiliations ?? [];
            const keywords = uniqueStrings([
              ...(paper.aiKeywords ?? []),
            ]);
            const score = scoreOpportunity({
              candidateKeywords: keywords,
              candidateDepartments: departments,
              candidateSchools: schools,
              myKeywords,
              myDepartments,
              mySchools,
              richness: [paper.journal, paper.abstract, paper.year, paper.citations, keywords.length].filter(Boolean).length,
            });

            return {
              id: paper.id,
              title: paper.title,
              authors: paper.authors ?? [],
              journal: paper.journal || "",
              year: paper.year || 0,
              abstract: paper.abstract || "",
              link: paper.link || "",
              keywords,
              departments,
              schools,
              citations: paper.citations ?? 0,
              relevanceScore: score.score,
              relevanceReason: buildReason({
                sharedKeywords: score.sharedKeywords,
                departmentMatch: score.departmentMatch,
                schoolMatch: score.schoolMatch,
                fallback: "Potential reading or collaboration lead based on SU publication data.",
              }),
              sharedKeywords: score.sharedKeywords,
            };
          })
          .sort((a, b) => b.relevanceScore - a.relevanceScore || b.year - a.year);

        const patents: PatentOpportunity[] = publicDataset.patentsData
          .filter((patent: Patent) =>
            hasSalisburyAffiliations(patent.departmentAffiliations ?? [], patent.schoolAffiliations ?? []),
          )
          .map((patent: Patent) => {
            const departments = patent.departmentAffiliations ?? [];
            const schools = patent.schoolAffiliations ?? [];
            const keywords = patent.aiKeywords ?? [];
            const score = scoreOpportunity({
              candidateKeywords: keywords,
              candidateDepartments: departments,
              candidateSchools: schools,
              myKeywords,
              myDepartments,
              mySchools,
              richness: [patent.patentNumber, patent.description, patent.year, keywords.length].filter(Boolean).length,
            });

            return {
              id: patent.id,
              title: patent.title,
              inventors: patent.inventors ?? [],
              patentNumber: patent.patentNumber || "",
              year: patent.year || 0,
              description: patent.description || "",
              link: patent.link || "",
              keywords,
              departments,
              schools,
              relevanceScore: score.score,
              relevanceReason: buildReason({
                sharedKeywords: score.sharedKeywords,
                departmentMatch: score.departmentMatch,
                schoolMatch: score.schoolMatch,
                fallback: "Potential innovation lead based on SU patent data.",
              }),
              sharedKeywords: score.sharedKeywords,
            };
          })
          .sort((a, b) => b.relevanceScore - a.relevanceScore || b.year - a.year);

        const projects: ProjectOpportunity[] = publicDataset.projectsData
          .filter((project: Project) =>
            hasSalisburyAffiliations(project.departmentAffiliations ?? [], project.schoolAffiliations ?? []),
          )
          .map((project: Project) => {
            const departments = project.departmentAffiliations ?? [];
            const schools = project.schoolAffiliations ?? [];
            const keywords = project.aiKeywords ?? [];
            const score = scoreOpportunity({
              candidateKeywords: keywords,
              candidateDepartments: departments,
              candidateSchools: schools,
              myKeywords,
              myDepartments,
              mySchools,
              richness: [project.description, project.status, project.startDate, keywords.length].filter(Boolean).length,
            });

            return {
              id: project.id,
              title: project.title || "Untitled project",
              leadFaculty: project.leadFaculty ?? [],
              department: departments[0] || "",
              school: getSchool(schools),
              description: project.description || "",
              status: project.status || "Active",
              keywords,
              relevanceScore: score.score,
              relevanceReason: buildReason({
                sharedKeywords: score.sharedKeywords,
                departmentMatch: score.departmentMatch,
                schoolMatch: score.schoolMatch,
                fallback: "Potential interdisciplinary project fit.",
              }),
              sharedKeywords: score.sharedKeywords,
            };
          })
          .sort((a, b) => b.relevanceScore - a.relevanceScore);

        setColleagueMatches(colleagues);
        setPaperOpportunities(papers);
        setPatentOpportunities(patents);
        setProjectOpportunities(projects);
      } catch (err: any) {
        setError(err?.message || "Unable to load collaboration network.");
      } finally {
        setIsLoading(false);
      }
    };

    loadNetworkData();
  }, []);

  useEffect(() => {
    if (!usesNetworkEndpoint) return;

    const timeout = window.setTimeout(async () => {
      try {
        const discovery = await networkAPI.discovery({ q: searchQuery, limit: 50 });
        applyNetworkDiscovery(discovery);
        setError("");
      } catch (err: any) {
        setError(err?.message || "Unable to search collaboration network.");
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchQuery, usesNetworkEndpoint]);

  const hasSearch = searchQuery.trim().length > 0;

  const filteredColleagues = useMemo(
    () =>
      colleagueMatches.filter((colleague) => {
        // When the backend has already run a semantic search, results are already ranked
        // by relevance — skip the text filter so we don't hide semantically-matched results
        // that don't literally contain the query phrase. Still apply the department filter.
        const matchesSearch =
          usesNetworkEndpoint && hasSearch
            ? true
            : includesSearch(
                [
                  colleague.name,
                  colleague.title,
                  colleague.department,
                  colleague.school,
                  colleague.email,
                  colleague.bio,
                  ...colleague.researchInterests,
                ],
                searchQuery,
              );

        const matchesDepartment = departmentFilter === "all" || colleague.department === departmentFilter;
        return matchesSearch && matchesDepartment;
      }),
    [colleagueMatches, searchQuery, departmentFilter, usesNetworkEndpoint, hasSearch],
  );

  const filteredPapers = useMemo(
    () =>
      paperOpportunities.filter((paper) =>
        includesSearch(
          [
            paper.title,
            paper.journal,
            paper.abstract,
            ...paper.authors,
            ...paper.keywords,
            ...paper.departments,
            ...paper.schools,
          ],
          searchQuery,
        ),
      ),
    [paperOpportunities, searchQuery],
  );

  const filteredPatents = useMemo(
    () =>
      patentOpportunities.filter((patent) =>
        includesSearch(
          [
            patent.title,
            patent.patentNumber,
            patent.description,
            ...patent.inventors,
            ...patent.keywords,
            ...patent.departments,
            ...patent.schools,
          ],
          searchQuery,
        ),
      ),
    [patentOpportunities, searchQuery],
  );

  const filteredProjects = useMemo(
    () =>
      projectOpportunities.filter((project) =>
        includesSearch(
          [
            project.title,
            project.description,
            project.status,
            project.department,
            project.school,
            ...project.leadFaculty,
            ...project.keywords,
          ],
          searchQuery,
        ),
      ),
    [projectOpportunities, searchQuery],
  );

  const visibleColleagues = useMemo(
    () => (hasSearch ? filteredColleagues : filteredColleagues.slice(0, DEFAULT_RESULT_LIMIT)),
    [filteredColleagues, hasSearch],
  );
  const visiblePapers = useMemo(
    () => (hasSearch ? filteredPapers : filteredPapers.slice(0, DEFAULT_RESULT_LIMIT)),
    [filteredPapers, hasSearch],
  );
  const visiblePatents = useMemo(
    () => (hasSearch ? filteredPatents : filteredPatents.slice(0, DEFAULT_RESULT_LIMIT)),
    [filteredPatents, hasSearch],
  );
  const visibleProjects = useMemo(
    () => (hasSearch ? filteredProjects : filteredProjects.slice(0, DEFAULT_RESULT_LIMIT)),
    [filteredProjects, hasSearch],
  );

  const departments = useMemo(
    () => ["all", ...Array.from(new Set(colleagueMatches.map((f) => f.department).filter(Boolean))).sort()],
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

  const getVisibleCount = (tab: ActiveTab) => {
    if (tab === "colleagues") return visibleColleagues.length;
    if (tab === "papers") return visiblePapers.length;
    if (tab === "patents") return visiblePatents.length;
    return visibleProjects.length;
  };

  const getFilteredCount = (tab: ActiveTab) => {
    if (tab === "colleagues") return filteredColleagues.length;
    if (tab === "papers") return filteredPapers.length;
    if (tab === "patents") return filteredPatents.length;
    return filteredProjects.length;
  };

  const renderLimitHint = () => {
    const total = getFilteredCount(activeTab);
    const visible = getVisibleCount(activeTab);
    if (hasSearch || total <= visible) return null;
    return (
      <p className="text-sm text-gray-600">
        Showing the top {visible} of {total} Salisbury-affiliated matches. Use search to find a specific person or topic.
      </p>
    );
  };

  const tabClassName = (tab: ActiveTab) =>
    `pb-3 px-1 font-medium transition-colors border-b-2 ${
      activeTab === tab
        ? "border-[#8b0000] text-[#8b0000]"
        : "border-transparent text-gray-600 hover:text-gray-900"
    }`;

  const handleInquirySubmit = async () => {
    if (!inquiryTarget) return;
    setInquirySubmitting(true);
    try {
      const res = await networkAPI.inquire({
        target_faculty_name: inquiryTarget.name,
        target_faculty_id: inquiryTarget.id,
        target_department: inquiryTarget.department,
        target_school: inquiryTarget.school,
        shared_keywords: inquiryTarget.sharedKeywords,
        note: inquiryNote.trim(),
      });
      setInquirySuccess(res?.message || "Inquiry submitted successfully.");
    } catch {
      setInquirySuccess("Failed to submit. Please try again.");
    } finally {
      setInquirySubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Inquiry Dialog */}
      {inquiryTarget && createPortal(
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "0.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: "1.5rem", width: "100%", maxWidth: "30rem", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                  Request Collaboration
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
                  This will appear in the admin portal. The SCOUP team will help connect you.
                </p>
              </div>
              <button onClick={() => setInquiryTarget(null)} style={{ padding: "0.25rem", borderRadius: "0.375rem", border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af" }}>
                <X style={{ width: "1.25rem", height: "1.25rem" }} />
              </button>
            </div>

            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "0.375rem", padding: "0.75rem", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827", margin: 0 }}>{inquiryTarget.name}</p>
              {inquiryTarget.department && <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.25rem 0 0" }}>{inquiryTarget.department}</p>}
              {inquiryTarget.sharedKeywords.length > 0 && (
                <p style={{ fontSize: "0.75rem", color: "#8b0000", margin: "0.5rem 0 0" }}>
                  Shared: {inquiryTarget.sharedKeywords.slice(0, 3).join(", ")}
                </p>
              )}
            </div>

            {inquirySuccess ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.375rem", padding: "0.75rem", marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.875rem", color: "#166534", margin: 0 }}>{inquirySuccess}</p>
              </div>
            ) : (
              <>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151", display: "block", marginBottom: "0.375rem" }}>
                  What would you like to explore? <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
                </label>
                <textarea
                  ref={inquiryTextareaRef}
                  value={inquiryNote}
                  onChange={(e) => setInquiryNote(e.target.value)}
                  placeholder={`e.g. I'd like to discuss a potential grant proposal in ${inquiryTarget.sharedKeywords[0] || "our shared research area"}.`}
                  rows={3}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "0.375rem", fontSize: "0.875rem", color: "#111827", resize: "vertical", boxSizing: "border-box", outline: "none", fontFamily: "inherit" }}
                />
              </>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <Button variant="outline" onClick={() => setInquiryTarget(null)}>
                {inquirySuccess ? "Close" : "Cancel"}
              </Button>
              {!inquirySuccess && (
                <Button
                  className="bg-[#8b0000] hover:bg-[#700000] text-white"
                  onClick={handleInquirySubmit}
                  disabled={inquirySubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {inquirySubmitting ? "Submitting…" : "Submit Inquiry"}
                </Button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collaboration Network</h1>
        <p className="text-gray-600 mt-1">
          Discover Salisbury colleagues, publications, patents, and projects related to your profile
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#8b0000] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Salisbury Collaboration Discovery</p>
            <p className="text-sm text-gray-700">
              Matches prioritize SU affiliation, shared keywords, school/department alignment, and richer profile records.
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
              placeholder="Search by name, email, department, school, paper, patent, or expertise..."
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
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <button onClick={() => setActiveTab("colleagues")} className={tabClassName("colleagues")}>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Colleagues ({visibleColleagues.length})
            </div>
          </button>
          <button onClick={() => setActiveTab("papers")} className={tabClassName("papers")}>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Papers ({visiblePapers.length})
            </div>
          </button>
          <button onClick={() => setActiveTab("patents")} className={tabClassName("patents")}>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Patents ({visiblePatents.length})
            </div>
          </button>
          <button onClick={() => setActiveTab("projects")} className={tabClassName("projects")}>
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Projects ({visibleProjects.length})
            </div>
          </button>
        </div>
      </div>

      {renderLimitHint()}

      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-600">
          Loading collaboration data...
        </div>
      ) : activeTab === "colleagues" ? (
        <div className="space-y-4">
          {visibleColleagues.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No colleagues found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            visibleColleagues.map((colleague) => (
              <div key={colleague.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                    {colleague.photo ? (
                      <img src={colleague.photo} alt={colleague.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#8b0000] text-lg font-semibold text-white">
                        {getInitials(colleague.name)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-xl font-medium text-gray-900">{colleague.name}</h3>
                        {colleague.title && <p className="mt-1 text-sm text-gray-600">{colleague.title}</p>}
                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                          {colleague.department && (
                            <span className="inline-flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              {colleague.department}
                            </span>
                          )}
                          {colleague.school && (
                            <span className="inline-flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-gray-400" />
                              {colleague.school}
                            </span>
                          )}
                          {colleague.email && (
                            <a href={`mailto:${colleague.email}`} className="inline-flex items-center gap-2 hover:text-[#8b0000]">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {colleague.email}
                            </a>
                          )}
                          {colleague.articleCount > 0 && (
                            <span className="inline-flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              {colleague.articleCount} papers
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${getMatchColor(colleague.matchScore)}`}>
                        {colleague.matchScore}% · {getMatchLabel(colleague.matchScore)}
                      </div>
                    </div>

                    {/* Collaboration suggestion — prominent when shared keywords exist */}
                    {colleague.sharedKeywords.length > 0 && colleague.matchScore >= 60 ? (
                      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Sparkles className="w-4 h-4 text-green-700 shrink-0" />
                          <span className="text-xs font-semibold text-green-800 uppercase tracking-wide">
                            SCOUP Collaboration Suggestion
                          </span>
                          {colleague.collaborationScore > 0 && (
                            <span className="ml-auto text-xs text-green-700 font-medium">
                              {colleague.collaborationScore}% keyword match
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-green-900">
                          You and {colleague.name.split(" ")[0]} share expertise in{" "}
                          <strong>{colleague.sharedKeywords.slice(0, 3).join(", ")}</strong>.{" "}
                          {colleague.matchReason}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-gray-700">
                        {colleague.matchReason}
                      </div>
                    )}

                    {colleague.bio && (
                      <p className="mt-3 text-sm text-gray-600 line-clamp-2">{colleague.bio}</p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(colleague.sharedKeywords.length > 0
                        ? colleague.sharedKeywords
                        : colleague.researchInterests.slice(0, 5)
                      ).map((keyword) => (
                        <span key={keyword} className="px-2 py-1 bg-[#ffd100]/20 text-[#8b0000] text-xs rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {colleague.email && (
                        <a
                          href={`mailto:${colleague.email}?subject=${encodeURIComponent(
                            colleague.sharedKeywords.length > 0
                              ? `Collaboration Opportunity via SCOUP – ${colleague.sharedKeywords.slice(0, 2).join(" & ")}`
                              : "Collaboration Opportunity via SCOUP"
                          )}&body=${encodeURIComponent(
                            `Hello ${colleague.name},\n\nI came across your profile on SCOUP and noticed we share expertise in ${
                              colleague.sharedKeywords.length > 0
                                ? colleague.sharedKeywords.slice(0, 3).join(", ")
                                : "related research areas"
                            }. I'd love to explore potential collaboration opportunities — whether that's a joint project, grant proposal, or co-teaching.\n\nLooking forward to connecting.\n\nBest regards`
                          )}`}
                        >
                          <Button size="sm" className="bg-[#8b0000] hover:bg-[#700000]">
                            <Mail className="w-4 h-4 mr-2" />
                            {colleague.sharedKeywords.length > 0 ? "Suggest Collaboration" : "Contact"}
                          </Button>
                        </a>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setInquiryTarget(colleague);
                          setInquiryNote("");
                          setInquirySuccess(null);
                          setTimeout(() => inquiryTextareaRef.current?.focus(), 50);
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Request
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === "papers" ? (
        <div className="space-y-4">
          {visiblePapers.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
              <p className="text-gray-600">Try a broader search query</p>
            </div>
          ) : (
            visiblePapers.map((paper) => (
              <div key={paper.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-xl font-medium text-gray-900">{paper.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {paper.authors.slice(0, 4).join(", ") || "Authors not listed"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                      {paper.journal && <span>{paper.journal}</span>}
                      {paper.year > 0 && <span>{paper.year}</span>}
                      {paper.citations > 0 && <span>{paper.citations} citations</span>}
                      {paper.departments[0] && (
                        <span className="inline-flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {paper.departments[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${getMatchColor(paper.relevanceScore)}`}>
                    {paper.relevanceScore}% Relevance
                  </div>
                </div>
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-gray-700">
                  {paper.relevanceReason}
                </div>
                {paper.abstract && <p className="mt-3 text-sm text-gray-600 line-clamp-2">{paper.abstract}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(paper.sharedKeywords.length > 0 ? paper.sharedKeywords : paper.keywords.slice(0, 5)).map((keyword) => (
                    <span key={keyword} className="px-2 py-1 bg-[#ffd100]/20 text-[#8b0000] text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
                {paper.link && (
                  <a href={paper.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Paper
                    </Button>
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      ) : activeTab === "patents" ? (
        <div className="space-y-4">
          {visiblePatents.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patents found</h3>
              <p className="text-gray-600">Try a broader search query</p>
            </div>
          ) : (
            visiblePatents.map((patent) => (
              <div key={patent.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-xl font-medium text-gray-900">{patent.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {patent.inventors.slice(0, 4).join(", ") || "Inventors not listed"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                      {patent.patentNumber && <span>{patent.patentNumber}</span>}
                      {patent.year > 0 && <span>{patent.year}</span>}
                      {patent.departments[0] && (
                        <span className="inline-flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {patent.departments[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${getMatchColor(patent.relevanceScore)}`}>
                    {patent.relevanceScore}% Relevance
                  </div>
                </div>
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-gray-700">
                  {patent.relevanceReason}
                </div>
                {patent.description && <p className="mt-3 text-sm text-gray-600 line-clamp-2">{patent.description}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(patent.sharedKeywords.length > 0 ? patent.sharedKeywords : patent.keywords.slice(0, 5)).map((keyword) => (
                    <span key={keyword} className="px-2 py-1 bg-[#ffd100]/20 text-[#8b0000] text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
                {patent.link && (
                  <a href={patent.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Patent
                    </Button>
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleProjects.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No project opportunities found</h3>
              <p className="text-gray-600">Try a broader search query</p>
            </div>
          ) : (
            visibleProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-xl font-medium text-gray-900">{project.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{project.description || "No description listed."}</p>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                      <span>Status: {project.status}</span>
                      {project.leadFaculty.length > 0 && <span>Lead: {project.leadFaculty.slice(0, 3).join(", ")}</span>}
                      {project.department && (
                        <span className="inline-flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {project.department}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${getMatchColor(project.relevanceScore)}`}>
                    {project.relevanceScore}% Relevance
                  </div>
                </div>
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-gray-700">
                  {project.relevanceReason}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.sharedKeywords.length > 0 ? project.sharedKeywords : project.keywords.slice(0, 5)).map((keyword) => (
                    <span key={keyword} className="px-2 py-1 bg-[#ffd100]/20 text-[#8b0000] text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
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
