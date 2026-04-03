import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { Building2, Users, FileText, TrendingUp } from "lucide-react";
import { facultyAPI, papersAPI, patentsAPI, projectsAPI } from "../../utils/api";

interface DepartmentRow {
  name: string;
  faculty: number;
  publications: number;
  patents: number;
  projects: number;
}

export function DepartmentManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState<DepartmentRow[]>([]);

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

        const bucket: Record<string, DepartmentRow> = {};
        const ensure = (name: string) => {
          const key = name.trim() || "Unassigned";
          if (!bucket[key]) {
            bucket[key] = { name: key, faculty: 0, publications: 0, patents: 0, projects: 0 };
          }
          return bucket[key];
        };

        faculty.forEach((f: any) => {
          ensure(String(f?.department || "Unassigned")).faculty += 1;
        });

        papers.forEach((p: any) => {
          ensure(String(p?.department || p?.faculty_department || "Unassigned")).publications += 1;
        });

        patents.forEach((p: any) => {
          ensure(String(p?.department || p?.faculty_department || "Unassigned")).patents += 1;
        });

        projects.forEach((p: any) => {
          ensure(String(p?.department || p?.faculty_department || "Unassigned")).projects += 1;
        });

        setDepartments(Object.values(bucket).sort((a, b) => b.faculty - a.faculty));
      } catch (err: any) {
        setError(err?.message || "Unable to load department data.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const totals = useMemo(
    () => ({
      departments: departments.length,
      faculty: departments.reduce((sum, d) => sum + d.faculty, 0),
      publications: departments.reduce((sum, d) => sum + d.publications, 0),
      patents: departments.reduce((sum, d) => sum + d.patents, 0),
    }),
    [departments],
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-light text-gray-900 mb-2">Department Management</h1>
        <p className="text-gray-600 font-light">Live department metrics derived from backend records</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">Loading departments...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard label="Departments" value={totals.departments} icon={Building2} />
            <StatCard label="Faculty" value={totals.faculty} icon={Users} />
            <StatCard label="Publications" value={totals.publications} icon={FileText} />
            <StatCard label="Patents" value={totals.patents} icon={TrendingUp} />
          </div>

          {departments.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-600">No department data available.</div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Department</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Faculty</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Publications</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Patents</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Projects</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {departments.map((dept) => (
                    <tr key={dept.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900">{dept.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{dept.faculty}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{dept.publications}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{dept.patents}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{dept.projects}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: ComponentType<{ className?: string }> }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="w-10 h-10 bg-[#8b0000]/10 rounded-lg flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-[#8b0000]" />
      </div>
      <div className="text-3xl font-light text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
