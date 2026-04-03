import { useEffect, useMemo, useState } from "react";
import { TrendingUp, Users, Eye, FileText, Globe } from "lucide-react";
import { apiCall } from "../../utils/api";

export function PlatformAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [facultyCount, setFacultyCount] = useState(0);
  const [paperCount, setPaperCount] = useState(0);
  const [patentCount, setPatentCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await apiCall("/public/search-data/");
        const faculty = Array.isArray(data?.facultyData) ? data.facultyData : [];
        const papers = Array.isArray(data?.papersData) ? data.papersData : [];
        const patents = Array.isArray(data?.patentsData) ? data.patentsData : [];
        const projects = Array.isArray(data?.projectsData) ? data.projectsData : [];

        setFacultyCount(faculty.length);
        setPaperCount(papers.length);
        setPatentCount(patents.length);
        setProjectCount(projects.length);
      } catch (err: any) {
        setError(err?.message || "Unable to load platform analytics.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const totalAssets = useMemo(
    () => facultyCount + paperCount + patentCount + projectCount,
    [facultyCount, paperCount, patentCount, projectCount],
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-600 mt-1">Live public dataset metrics (no mock data)</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">Loading platform analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard icon={<Users className="w-5 h-5" />} label="Faculty" value={facultyCount} />
            <MetricCard icon={<FileText className="w-5 h-5" />} label="Papers" value={paperCount} />
            <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="Patents" value={patentCount} />
            <MetricCard icon={<Globe className="w-5 h-5" />} label="Projects" value={projectCount} />
            <MetricCard icon={<Eye className="w-5 h-5" />} label="Total Assets" value={totalAssets} />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-3">Summary</h2>
            <p className="text-sm text-gray-700">
              This panel reflects only live data returned by <code>/api/public/search-data/</code>. Add backend analytics endpoints
              for trends, traffic sources, and query intelligence.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 text-gray-600 mb-2">{icon}<span>{label}</span></div>
      <div className="text-3xl font-light text-gray-900">{value.toLocaleString()}</div>
    </div>
  );
}
