import { useEffect, useMemo, useState } from "react";
import { Lightbulb, Users, Target, CheckCircle2 } from "lucide-react";
import { facultyAPI, papersAPI, patentsAPI, projectsAPI } from "../../utils/api";

interface DepartmentMetric {
  name: string;
  faculty: number;
  papers: number;
  patents: number;
  projects: number;
  score: number;
}

export function StrategicInsightsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState<DepartmentMetric[]>([]);

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

        const faculty = Array.isArray(facultyRes) ? facultyRes : facultyRes?.results || [];
        const papers = Array.isArray(papersRes) ? papersRes : papersRes?.results || [];
        const patents = Array.isArray(patentsRes) ? patentsRes : patentsRes?.results || [];
        const projects = Array.isArray(projectsRes) ? projectsRes : projectsRes?.results || [];

        const byDept: Record<string, DepartmentMetric> = {};
        const ensure = (name: string) => {
          const key = name.trim() || "Unassigned";
          if (!byDept[key]) {
            byDept[key] = { name: key, faculty: 0, papers: 0, patents: 0, projects: 0, score: 0 };
          }
          return byDept[key];
        };

        faculty.forEach((f: any) => ensure(String(f?.department || "Unassigned")).faculty += 1);
        papers.forEach((p: any) => ensure(String(p?.department || p?.faculty_department || "Unassigned")).papers += 1);
        patents.forEach((p: any) => ensure(String(p?.department || p?.faculty_department || "Unassigned")).patents += 1);
        projects.forEach((p: any) => ensure(String(p?.department || p?.faculty_department || "Unassigned")).projects += 1);

        const result = Object.values(byDept).map((m) => ({
          ...m,
          score: Math.min(100, m.faculty * 4 + m.papers * 2 + m.patents * 4 + m.projects * 3),
        }));

        setMetrics(result.sort((a, b) => b.score - a.score));
      } catch (err: any) {
        setError(err?.message || "Unable to load strategic insights.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const top = useMemo(() => metrics.slice(0, 3), [metrics]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Strategic Insights</h1>
        <p className="text-gray-600 mt-1">Recommendations generated from live departmental activity</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">Loading strategic insights...</div>
      ) : metrics.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">No data available to generate insights yet.</div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-[#8b0000] to-[#6b0000] rounded-lg p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#ffd100] rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-[#8b0000]" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Strategic Summary</h3>
                <p className="text-sm text-white/90">
                  Insights are based on current faculty, papers, patents, and projects grouped by department.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-medium text-gray-900 mb-4">Top Opportunity Departments</h2>
            <div className="grid gap-4">
              {top.map((dept) => (
                <div key={dept.name} className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{dept.name}</h3>
                    <span className="text-sm font-medium text-[#8b0000]">Score {dept.score}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4" />{dept.faculty} faculty</div>
                    <div>{dept.papers} papers</div>
                    <div>{dept.patents} patents</div>
                    <div>{dept.projects} projects</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-medium text-gray-900 mb-4">Recommendations</h2>
            <div className="space-y-3">
              {top.map((dept) => (
                <div key={`${dept.name}-rec`} className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-[#8b0000] mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Expand support for {dept.name}</div>
                      <p className="text-sm text-gray-700 mt-1">
                        Prioritize this department for partnerships and visibility because it currently has strong activity across research outputs.
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Suggested action: feature this department in external search highlights.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
