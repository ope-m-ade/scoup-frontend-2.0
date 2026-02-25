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
  ExternalLink,
  AlertTriangle,
  User,
  Building2,
  Mail,
  Loader2,
} from "lucide-react";

interface ExternalPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  citations: number;
  url?: string;
}

interface ExternalPatent {
  id: string;
  title: string;
  patentNumber: string;
  inventors: string;
  year: number;
  url?: string;
}

interface ExternalProject {
  id: string;
  title: string;
  description: string;
  fundingAgency?: string;
  amount?: string;
  year: number;
}

interface ExternalProfile {
  id: string;
  externalFacultyId?: number;
  name: string;
  email?: string;
  department?: string;
  institution?: string;
  matchScore: number;
  source: string;
  papers: ExternalPaper[];
  patents: ExternalPatent[];
  projects: ExternalProject[];
  profileImage?: string;
}

interface ProfileMatchingProps {
  onClaimSuccess?: (claimedData: {
    papers: ExternalPaper[];
    patents: ExternalPatent[];
    projects: ExternalProject[];
  }) => void;
}

export function ProfileMatching({
  onClaimSuccess,
}: ProfileMatchingProps) {
  const [externalProfiles, setExternalProfiles] = useState<ExternalProfile[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [claimedProfiles, setClaimedProfiles] = useState<Set<string>>(
    new Set(),
  );
  const [rejectedProfiles, setRejectedProfiles] = useState<Set<string>>(
    new Set(),
  );
  useEffect(() => {
    fetchExternalProfiles();
  }, []);

  const fetchExternalProfiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiCall("/faculty/me/suggestions/");
      const rows = Array.isArray(data?.suggestions) ? data.suggestions : [];
      setExternalProfiles(
        rows.map((item: any, index: number) => ({
          id: String(item?.id ?? index),
          externalFacultyId: Number(item?.id),
          name: item?.name ?? "Suggested profile",
          email: item?.email ?? "",
          department: item?.department ?? "",
          institution: "External Source",
          matchScore: Number(item?.score ?? 0),
          source: (Array.isArray(item?.reasons) && item.reasons[0]) || "Similarity match",
          papers: [],
          patents: [],
          projects: [],
        })),
      );
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching external profiles:", err);
      setError("Failed to load profile suggestions. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleClaimProfile = async (profile: ExternalProfile) => {
    try {
      if (profile.externalFacultyId) {
        await apiCall(`/faculty/me/suggestions/${profile.externalFacultyId}/approve/`, {
          method: "POST",
        });
      }

      setClaimedProfiles((prev) => new Set([...prev, profile.id]));

      // Collect all data from this profile
      const claimedData = {
        papers: profile.papers,
        patents: profile.patents,
        projects: profile.projects,
      };

      if (onClaimSuccess) {
        onClaimSuccess(claimedData);
      }
    } catch (err) {
      console.error("Error claiming profile:", err);
      alert("Failed to claim profile. Please try again.");
    }
  };

  const handleRejectProfile = async (profileId: string) => {
    try {
      const profile = externalProfiles.find((item) => item.id === profileId);
      if (profile?.externalFacultyId) {
        await apiCall(`/faculty/me/suggestions/${profile.externalFacultyId}/reject/`, {
          method: "POST",
        });
      }

      setRejectedProfiles((prev) => new Set([...prev, profileId]));
    } catch (err) {
      console.error("Error rejecting profile:", err);
      alert("Failed to reject profile. Please try again.");
    }
  };

  const toggleExpanded = async (profileId: string) => {
    const shouldExpand = expandedProfile !== profileId;
    if (!shouldExpand) {
      setExpandedProfile(null);
      return;
    }

    try {
      const profile = externalProfiles.find((item) => item.id === profileId);
      if (profile?.externalFacultyId) {
        const preview = await apiCall(
          `/faculty/me/suggestions/${profile.externalFacultyId}/preview/`,
        );
          setExternalProfiles((prev) =>
            prev.map((item) =>
              item.id !== profileId
                ? item
                : {
                    ...item,
                    papers: Array.isArray(preview?.papers)
                      ? preview.papers.map((paper: any) => ({
                          id: String(paper?.id ?? ""),
                          title: paper?.title ?? "",
                          authors: "",
                          journal: paper?.journal ?? "",
                          year: Number(paper?.year ?? 0),
                          citations: 0,
                          url: "",
                        }))
                      : [],
                    patents: Array.isArray(preview?.patents)
                      ? preview.patents.map((patent: any) => ({
                          id: String(patent?.id ?? ""),
                          title: patent?.title ?? "",
                          patentNumber: patent?.patent_number ?? "",
                          inventors: "",
                          year: Number(patent?.issue_year ?? 0),
                          url: "",
                        }))
                      : [],
                    projects: Array.isArray(preview?.projects)
                      ? preview.projects.map((project: any) => ({
                          id: String(project?.id ?? ""),
                          title: project?.title ?? "",
                          description: "",
                          fundingAgency: "",
                          amount: "",
                          year:
                            project?.start_date && String(project.start_date).includes("-")
                              ? Number(String(project.start_date).split("-")[0])
                              : 0,
                        }))
                      : [],
                  },
            ),
          );
      }
    } catch (err) {
      console.error("Error loading preview:", err);
    }

    setExpandedProfile(profileId);
  };

  const getPendingProfiles = () => {
    return externalProfiles.filter(
      (profile) =>
        !claimedProfiles.has(profile.id) && !rejectedProfiles.has(profile.id),
    );
  };

  const getClaimedProfiles = () => {
    return externalProfiles.filter((profile) =>
      claimedProfiles.has(profile.id),
    );
  };

  const pendingProfiles = getPendingProfiles();
  const claimed = getClaimedProfiles();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile Matching</h2>
        <p className="text-gray-600 mt-1">
          We found external profiles that might belong to you. Review and claim
          your research outputs.
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="border-[#ffd100] bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-[#8b0000]" />
        <AlertDescription>
          <p className="font-semibold text-[#8b0000] mb-1">
            About External Profiles
          </p>
          <p className="text-sm text-gray-700">
            These profiles are sourced from public databases like Google
            Scholar, ResearchGate, IEEE Xplore, and patent databases. They are
            not verified and may not be affiliated with Salisbury University.
            Please review carefully before claiming.
          </p>
        </AlertDescription>
      </Alert>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-[#8b0000]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-[#8b0000]">
                {pendingProfiles.length}
              </p>
            </div>
            <User className="w-8 h-8 text-[#8b0000] opacity-20" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Claimed</p>
              <p className="text-3xl font-bold text-green-600">
                {claimed.length}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-gray-600">
                {rejectedProfiles.size}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-gray-400 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Pending Profiles for Review */}
      {pendingProfiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Profiles for Review
          </h3>

          {pendingProfiles.map((profile) => {
            const isExpanded = expandedProfile === profile.id;
            const totalItems =
              profile.papers.length +
              profile.patents.length +
              profile.projects.length;

            return (
              <Card
                key={profile.id}
                className="overflow-hidden border-2 hover:border-[#8b0000] transition-colors"
              >
                {/* Profile Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={profile.profileImage} />
                      <AvatarFallback className="bg-[#8b0000] text-white">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {profile.name}
                          </h4>
                          {profile.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <Mail className="w-4 h-4" />
                              {profile.email}
                            </div>
                          )}
                          {profile.department && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <Building2 className="w-4 h-4" />
                              {profile.department}
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <Badge
                            className={`${
                              profile.matchScore >= 90
                                ? "bg-green-100 text-green-800"
                                : profile.matchScore >= 80
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {profile.matchScore}% Match
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Source: {profile.source}
                          </p>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-4 mt-3">
                        {profile.papers.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            {profile.papers.length} Papers
                          </div>
                        )}
                        {profile.patents.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Lightbulb className="w-4 h-4" />
                            {profile.patents.length} Patents
                          </div>
                        )}
                        {profile.projects.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FolderOpen className="w-4 h-4" />
                            {profile.projects.length} Projects
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-4">
                    <Button
                      onClick={() => handleClaimProfile(profile)}
                      className="bg-[#8b0000] hover:bg-[#700000] flex-1"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Claim This Profile ({totalItems} items)
                    </Button>
                    <Button
                      onClick={() => handleRejectProfile(profile.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Not Me
                    </Button>
                    <Button
                      onClick={() => toggleExpanded(profile.id)}
                      variant="outline"
                    >
                      {isExpanded ? "Hide" : "View"} Details
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-6 space-y-6">
                    {/* Papers */}
                    {profile.papers.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#8b0000]" />
                          Publications ({profile.papers.length})
                        </h5>
                        <div className="space-y-3">
                          {profile.papers.map((paper) => (
                            <Card key={paper.id} className="p-4 bg-white">
                              <h6 className="font-medium text-gray-900">
                                {paper.title}
                              </h6>
                              <p className="text-sm text-gray-600 mt-1">
                                {paper.authors}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="secondary">
                                  {paper.journal}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {paper.year}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {paper.citations} citations
                                </span>
                                {paper.url && (
                                  <a
                                    href={paper.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#8b0000] hover:underline flex items-center gap-1"
                                  >
                                    View <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Patents */}
                    {profile.patents.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-[#8b0000]" />
                          Patents ({profile.patents.length})
                        </h5>
                        <div className="space-y-3">
                          {profile.patents.map((patent) => (
                            <Card key={patent.id} className="p-4 bg-white">
                              <h6 className="font-medium text-gray-900">
                                {patent.title}
                              </h6>
                              <p className="text-sm text-gray-600 mt-1">
                                {patent.inventors}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="secondary">
                                  {patent.patentNumber}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {patent.year}
                                </span>
                                {patent.url && (
                                  <a
                                    href={patent.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#8b0000] hover:underline flex items-center gap-1"
                                  >
                                    View <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {profile.projects.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FolderOpen className="w-5 h-5 text-[#8b0000]" />
                          Projects ({profile.projects.length})
                        </h5>
                        <div className="space-y-3">
                          {profile.projects.map((project) => (
                            <Card key={project.id} className="p-4 bg-white">
                              <h6 className="font-medium text-gray-900">
                                {project.title}
                              </h6>
                              <p className="text-sm text-gray-600 mt-1">
                                {project.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                {project.fundingAgency && (
                                  <Badge variant="secondary">
                                    {project.fundingAgency}
                                  </Badge>
                                )}
                                {project.amount && (
                                  <span className="text-sm font-semibold text-green-600">
                                    {project.amount}
                                  </span>
                                )}
                                <span className="text-sm text-gray-500">
                                  {project.year}
                                </span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Claimed Profiles */}
      {claimed.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            Claimed Profiles
          </h3>

          {claimed.map((profile) => {
            const totalItems =
              profile.papers.length +
              profile.patents.length +
              profile.projects.length;

            return (
              <Card
                key={profile.id}
                className="p-4 bg-green-50 border-2 border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {profile.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {totalItems} items added to your dashboard
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-600">Claimed</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {pendingProfiles.length === 0 && claimed.length === 0 && (
        <Card className="p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            All Caught Up!
          </h3>
          <p className="text-gray-600">
            No pending profile matches at this time. We'll notify you when new
            matches are found.
          </p>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="p-12 text-center">
          <Loader2 className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h3>
          <p className="text-gray-600">
            Fetching profile suggestions from external databases.
          </p>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-12 text-center bg-red-50 text-red-900">
          <XCircle className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p className="text-sm">{error}</p>
        </Card>
      )}
    </div>
  );
}
