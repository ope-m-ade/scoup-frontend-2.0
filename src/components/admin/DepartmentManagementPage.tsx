import { Building2, Users, FileText, TrendingUp, Plus, Edit, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";

interface Department {
  id: string;
  name: string;
  code: string;
  faculty: number;
  publications: number;
  patents: number;
  projects: number;
  totalViews: number;
  chair: string;
  chairEmail: string;
  growth: number;
}

export function DepartmentManagementPage() {
  const departments: Department[] = [
    {
      id: "1",
      name: "Computer Science",
      code: "COSC",
      faculty: 28,
      publications: 145,
      patents: 8,
      projects: 32,
      totalViews: 8450,
      chair: "Dr. Michael Chen",
      chairEmail: "mchen@salisbury.edu",
      growth: 22
    },
    {
      id: "2",
      name: "Marine Biology",
      code: "MABI",
      faculty: 22,
      publications: 198,
      patents: 3,
      projects: 45,
      totalViews: 9250,
      chair: "Dr. Sarah Watson",
      chairEmail: "swatson@salisbury.edu",
      growth: 18
    },
    {
      id: "3",
      name: "Business Administration",
      code: "BUAD",
      faculty: 34,
      publications: 87,
      patents: 2,
      projects: 28,
      totalViews: 6800,
      chair: "Dr. Robert Johnson",
      chairEmail: "rjohnson@salisbury.edu",
      growth: 12
    },
    {
      id: "4",
      name: "Psychology",
      code: "PSYC",
      faculty: 26,
      publications: 112,
      patents: 1,
      projects: 18,
      totalViews: 5650,
      chair: "Dr. Jennifer Martinez",
      chairEmail: "jmartinez@salisbury.edu",
      growth: 15
    },
    {
      id: "5",
      name: "Environmental Science",
      code: "ENSC",
      faculty: 18,
      publications: 134,
      patents: 4,
      projects: 38,
      totalViews: 7200,
      chair: "Dr. David Green",
      chairEmail: "dgreen@salisbury.edu",
      growth: 20
    },
    {
      id: "6",
      name: "Education",
      code: "EDUC",
      faculty: 31,
      publications: 78,
      patents: 0,
      projects: 22,
      totalViews: 4950,
      chair: "Dr. Emily Patterson",
      chairEmail: "epatterson@salisbury.edu",
      growth: 8
    }
  ];

  const totalFaculty = departments.reduce((sum, dept) => sum + dept.faculty, 0);
  const totalPublications = departments.reduce((sum, dept) => sum + dept.publications, 0);
  const totalPatents = departments.reduce((sum, dept) => sum + dept.patents, 0);
  const totalProjects = departments.reduce((sum, dept) => sum + dept.projects, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 mb-2">Department Management</h1>
          <p className="text-gray-600 font-light">
            Manage departments and track performance across the university
          </p>
        </div>
        <Button className="bg-[#8b0000] hover:bg-[#6b0000] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-10 h-10 bg-[#8b0000]/10 rounded-lg flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5 text-[#8b0000]" />
          </div>
          <div className="text-3xl font-light text-gray-900 mb-1">{departments.length}</div>
          <div className="text-sm text-gray-600">Total Departments</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-light text-gray-900 mb-1">{totalFaculty}</div>
          <div className="text-sm text-gray-600">Total Faculty</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-light text-gray-900 mb-1">{totalPublications}</div>
          <div className="text-sm text-gray-600">Total Publications</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-light text-gray-900 mb-1">{totalPatents}</div>
          <div className="text-sm text-gray-600">Total Patents</div>
        </div>
      </div>

      {/* Departments List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Department</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Chair</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Faculty</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Publications</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Patents</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Projects</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Views</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Growth</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#8b0000]/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-[#8b0000]">{dept.code}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{dept.name}</div>
                        <div className="text-xs text-gray-600">{dept.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{dept.chair}</div>
                      <div className="text-xs text-gray-600">{dept.chairEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{dept.faculty}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{dept.publications}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{dept.patents}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{dept.projects}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{dept.totalViews.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      dept.growth >= 15 
                        ? "text-green-600" 
                        : dept.growth >= 10 
                        ? "text-blue-600" 
                        : "text-gray-600"
                    }`}>
                      <TrendingUp className="w-3 h-3" />
                      +{dept.growth}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#ffd100]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">Top Performing Departments</h2>
              <p className="text-sm text-gray-600">By growth rate</p>
            </div>
          </div>
          <div className="space-y-4">
            {[...departments]
              .sort((a, b) => b.growth - a.growth)
              .slice(0, 5)
              .map((dept, index) => (
                <div key={dept.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#ffd100]/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-[#8b0000]">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{dept.name}</div>
                      <div className="text-xs text-gray-600">{dept.faculty} faculty</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">+{dept.growth}%</div>
                    <div className="text-xs text-gray-600">growth</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#ffd100]" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">Most Productive Departments</h2>
              <p className="text-sm text-gray-600">By publications</p>
            </div>
          </div>
          <div className="space-y-4">
            {[...departments]
              .sort((a, b) => b.publications - a.publications)
              .slice(0, 5)
              .map((dept, index) => (
                <div key={dept.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{dept.name}</div>
                      <div className="text-xs text-gray-600">{dept.faculty} faculty</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{dept.publications}</div>
                    <div className="text-xs text-gray-600">publications</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}