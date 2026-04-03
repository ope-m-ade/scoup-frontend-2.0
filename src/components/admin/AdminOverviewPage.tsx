import { useEffect, useMemo, useState } from "react";
import { Users, FileText, Lightbulb, FolderOpen, Eye } from "lucide-react";
import { facultyAPI, papersAPI, patentsAPI, projectsAPI } from "../../utils/api";

export function AdminOverviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [faculty, setFaculty] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [patents, setPatents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [facultyRes, papersRes, patentsRes, projectsRes] = await Promise.all([
          facultyAPI.getAll(),
          papersAPI.getAll(),
          patentsAPI.getAll(),
          projectsAPI.getAll(),
        ]);

        setFaculty(Array.isArray(facultyRes) ? facultyRes : facultyRes?.results || []);
        setPapers(Array.isArray(papersRes) ? papersRes : papersRes?.results || []);
        setPatents(Array.isArray(patentsRes) ? patentsRes : patentsRes?.results || []);
        setProjects(Array.isArray(projectsRes) ? projectsRes : projectsRes?.results || []);
      } catch (err: any) {
        setError(err?.message || "Unable to load admin overview.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const departments = useMemo(() => {
    const counts: Record<string, number> = {};
    faculty.forEach((f: any) => {
      const dept = String(f?.department || "Unassigned").trim() || "Unassigned";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [faculty]);

  const stats = [
    { label: "Faculty", value: faculty.length, icon: Users },
    { label: "Papers", value: papers.length, icon: FileText },
    { label: "Patents", value: patents.length, icon: Lightbulb },
    { label: "Projects", value: projects.length, icon: FolderOpen },
    { label: "Total Assets", value: papers.length + patents.length + projects.length, icon: Eye },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-light text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 font-light">Live platform overview from backend data</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">Loading admin metrics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2"><Icon className="w-5 h-5" />{stat.label}</div>
                  <div className="text-3xl font-light text-gray-900">{stat.value.toLocaleString()}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Top Departments by Faculty Count</h2>
            {departments.length === 0 ? (
              <p className="text-sm text-gray-600">No department data available yet.</p>
            ) : (
              <div className="space-y-3">
                {departments.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0">
                    <span className="text-gray-900">{dept.name}</span>
                    <span className="text-sm text-gray-600">{dept.count} faculty</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
