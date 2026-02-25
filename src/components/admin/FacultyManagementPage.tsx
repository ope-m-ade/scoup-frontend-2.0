import { useEffect, useMemo, useState } from "react";
import { Search, Mail, User, CheckCircle, XCircle } from "lucide-react";
import { Input } from "../ui/input";
import { facultyAPI } from "../../utils/api";

interface FacultyRow {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "active" | "inactive";
}

export function FacultyManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [facultyRows, setFacultyRows] = useState<FacultyRow[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await facultyAPI.getAll();
        const rows = (Array.isArray(data) ? data : data?.results || []).map((item: any) => {
          const first = String(item?.first_name || "").trim();
          const last = String(item?.last_name || "").trim();
          const fallbackName = String(item?.name || item?.full_name || item?.username || "Unnamed Faculty");
          const name = `${first} ${last}`.trim() || fallbackName;

          return {
            id: String(item?.id ?? item?.pk ?? name),
            name,
            email: String(item?.email || ""),
            department: String(item?.department || "Unassigned"),
            status: item?.is_active === false ? "inactive" : "active",
          } as FacultyRow;
        });

        setFacultyRows(rows);
      } catch (err: any) {
        setError(err?.message || "Unable to load faculty list.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const filteredFaculty = useMemo(() => {
    return facultyRows.filter((faculty) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        faculty.name.toLowerCase().includes(q) ||
        faculty.email.toLowerCase().includes(q) ||
        faculty.department.toLowerCase().includes(q);

      const matchesFilter = filterStatus === "all" ? true : faculty.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [facultyRows, searchTerm, filterStatus]);

  const statusCounts = useMemo(
    () => ({
      all: facultyRows.length,
      active: facultyRows.filter((f) => f.status === "active").length,
      inactive: facultyRows.filter((f) => f.status === "inactive").length,
    }),
    [facultyRows],
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
        <p className="text-gray-600 mt-1">Live faculty records from backend</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard label="Total Faculty" value={statusCounts.all} active={filterStatus === "all"} onClick={() => setFilterStatus("all")} />
        <StatusCard label="Active" value={statusCounts.active} active={filterStatus === "active"} onClick={() => setFilterStatus("active")} />
        <StatusCard label="Inactive" value={statusCounts.inactive} active={filterStatus === "inactive"} onClick={() => setFilterStatus("inactive")} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search faculty by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">Loading faculty...</div>
      ) : filteredFaculty.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty found</h3>
          <p className="text-gray-600">Try a different search or status filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Department</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFaculty.map((faculty) => (
                <tr key={faculty.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{faculty.name}</td>
                  <td className="px-6 py-4">
                    {faculty.email ? (
                      <a href={`mailto:${faculty.email}`} className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-[#8b0000]">
                        <Mail className="w-4 h-4" />
                        {faculty.email}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">No email</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{faculty.department}</td>
                  <td className="px-6 py-4">
                    {faculty.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-sm text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <XCircle className="w-4 h-4" />
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusCard({ label, value, active, onClick }: { label: string; value: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all text-left ${active ? "border-[#8b0000] bg-[#8b0000]/5" : "border-gray-200 hover:border-gray-300"}`}
    >
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-3xl font-light text-gray-900">{value}</div>
    </button>
  );
}
