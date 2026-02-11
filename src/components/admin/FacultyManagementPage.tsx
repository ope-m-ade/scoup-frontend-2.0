import { useState } from "react";
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, CheckCircle, XCircle, Mail, User, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface FacultyMember {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "active" | "pending" | "inactive";
  profileCompletion: number;
  publications: number;
  patents: number;
  projects: number;
  lastActive: string;
  joinDate: string;
  pendingChanges?: {
    type: "profile" | "publication" | "project";
    description: string;
    submittedAt: string;
  }[];
  contentFlags?: {
    type: "accuracy" | "clarity" | "appropriateness";
    field: string;
    reason: string;
  }[];
}

export function FacultyManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "pending" | "inactive" | "needs_review">("all");
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "review_queue">("list");

  // Mock faculty data with content review needs
  const facultyMembers: FacultyMember[] = [
    {
      id: "1",
      name: "Dr. Sarah Chen",
      email: "schen@salisbury.edu",
      department: "Computer Science",
      status: "active",
      profileCompletion: 95,
      publications: 23,
      patents: 2,
      projects: 5,
      lastActive: "2 hours ago",
      joinDate: "2020-09-01",
      pendingChanges: [
        {
          type: "profile",
          description: "Updated research interests to include 'Quantum Computing'",
          submittedAt: "2 days ago"
        }
      ]
    },
    {
      id: "2",
      name: "Dr. Michael Rodriguez",
      email: "mrodriguez@salisbury.edu",
      department: "Business Administration",
      status: "pending",
      profileCompletion: 45,
      publications: 0,
      patents: 0,
      projects: 0,
      lastActive: "1 day ago",
      joinDate: "2025-01-15",
      pendingChanges: [
        {
          type: "profile",
          description: "New profile awaiting approval",
          submittedAt: "1 day ago"
        }
      ],
      contentFlags: [
        {
          type: "clarity",
          field: "Biography",
          reason: "Bio contains informal language - needs professional tone"
        }
      ]
    },
    {
      id: "3",
      name: "Dr. Emily Watson",
      email: "ewatson@salisbury.edu",
      department: "Marine Biology",
      status: "active",
      profileCompletion: 88,
      publications: 31,
      patents: 1,
      projects: 8,
      lastActive: "5 hours ago",
      joinDate: "2018-08-20",
      pendingChanges: [
        {
          type: "publication",
          description: "Added 3 new publications from 2024",
          submittedAt: "3 days ago"
        }
      ]
    },
    {
      id: "4",
      name: "Dr. James Patterson",
      email: "jpatterson@salisbury.edu",
      department: "Education",
      status: "active",
      profileCompletion: 72,
      publications: 15,
      patents: 0,
      projects: 3,
      lastActive: "1 week ago",
      joinDate: "2019-09-01"
    },
    {
      id: "5",
      name: "Dr. Lisa Anderson",
      email: "landerson@salisbury.edu",
      department: "Engineering",
      status: "inactive",
      profileCompletion: 60,
      publications: 8,
      patents: 3,
      projects: 2,
      lastActive: "3 months ago",
      joinDate: "2021-01-10"
    }
  ];

  const filteredFaculty = facultyMembers.filter((faculty) => {
    const matchesSearch = 
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = false;
    if (filterStatus === "all") {
      matchesFilter = true;
    } else if (filterStatus === "needs_review") {
      matchesFilter = (faculty.pendingChanges && faculty.pendingChanges.length > 0) || 
                      (faculty.contentFlags && faculty.contentFlags.length > 0);
    } else {
      matchesFilter = faculty.status === filterStatus;
    }

    return matchesSearch && matchesFilter;
  });

  // Filter for review queue
  const reviewQueueFaculty = facultyMembers.filter(f => 
    (f.pendingChanges && f.pendingChanges.length > 0) || 
    (f.contentFlags && f.contentFlags.length > 0)
  );

  const statusCounts = {
    all: facultyMembers.length,
    active: facultyMembers.filter(f => f.status === "active").length,
    pending: facultyMembers.filter(f => f.status === "pending").length,
    inactive: facultyMembers.filter(f => f.status === "inactive").length,
    needs_review: reviewQueueFaculty.length,
  };

  const handleApproveChange = (facultyId: string, changeIndex: number) => {
    console.log("Approving change for faculty:", facultyId, "change:", changeIndex);
    // In real app: update backend and remove from pending
  };

  const handleRejectChange = (facultyId: string, changeIndex: number) => {
    console.log("Rejecting change for faculty:", facultyId, "change:", changeIndex);
    // In real app: update backend and notify faculty
  };

  const handleResolveFlag = (facultyId: string, flagIndex: number) => {
    console.log("Resolving flag for faculty:", facultyId, "flag:", flagIndex);
    // In real app: mark as resolved in backend
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-600 mt-1">
            Manage faculty profiles, review content, and ensure quality standards
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-[#8b0000] hover:bg-[#6b0000] text-white" : ""}
          >
            Faculty List
          </Button>
          <Button 
            variant={viewMode === "review_queue" ? "default" : "outline"}
            onClick={() => setViewMode("review_queue")}
            className={viewMode === "review_queue" ? "bg-[#8b0000] hover:bg-[#6b0000] text-white" : ""}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Review Queue ({reviewQueueFaculty.length})
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <button
          onClick={() => setFilterStatus("all")}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            filterStatus === "all" 
              ? "border-[#8b0000] bg-[#8b0000]/5" 
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-sm text-gray-600 mb-1">Total Faculty</div>
          <div className="text-3xl font-light text-gray-900">{statusCounts.all}</div>
        </button>
        <button
          onClick={() => setFilterStatus("active")}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            filterStatus === "active" 
              ? "border-green-600 bg-green-50" 
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-sm text-gray-600 mb-1">Active</div>
          <div className="text-3xl font-light text-green-600">{statusCounts.active}</div>
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            filterStatus === "pending" 
              ? "border-yellow-600 bg-yellow-50" 
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-3xl font-light text-yellow-600">{statusCounts.pending}</div>
        </button>
        <button
          onClick={() => setFilterStatus("inactive")}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            filterStatus === "inactive" 
              ? "border-gray-600 bg-gray-50" 
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-sm text-gray-600 mb-1">Inactive</div>
          <div className="text-3xl font-light text-gray-600">{statusCounts.inactive}</div>
        </button>
        <button
          onClick={() => setFilterStatus("needs_review")}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            filterStatus === "needs_review" 
              ? "border-orange-600 bg-orange-50" 
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-sm text-gray-600 mb-1">Needs Review</div>
          <div className="text-3xl font-light text-orange-600">{statusCounts.needs_review}</div>
        </button>
      </div>

      {/* Search Bar */}
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

      {/* Content Review Queue View */}
      {viewMode === "review_queue" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#8b0000] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Content Review Queue
                </p>
                <p className="text-sm text-gray-700">
                  Review pending changes and content flags to ensure accuracy, clarity, and compliance with institutional standards.
                </p>
              </div>
            </div>
          </div>

          {reviewQueueFaculty.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
              <p className="text-gray-600">No items pending review at this time.</p>
            </div>
          ) : (
            reviewQueueFaculty.map((faculty) => (
              <div key={faculty.id} className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Faculty Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{faculty.name}</h3>
                    <p className="text-sm text-gray-600">{faculty.department}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    faculty.status === "active" ? "bg-green-100 text-green-700" :
                    faculty.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1)}
                  </span>
                </div>

                {/* Content Flags */}
                {faculty.contentFlags && faculty.contentFlags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <h4 className="font-medium text-gray-900">Content Quality Flags</h4>
                    </div>
                    <div className="space-y-2">
                      {faculty.contentFlags.map((flag, index) => (
                        <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  flag.type === "accuracy" ? "bg-red-100 text-red-700" :
                                  flag.type === "clarity" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-purple-100 text-purple-700"
                                }`}>
                                  {flag.type.charAt(0).toUpperCase() + flag.type.slice(1)}
                                </span>
                                <span className="text-sm font-medium text-gray-900">{flag.field}</span>
                              </div>
                              <p className="text-sm text-gray-700">{flag.reason}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveFlag(faculty.id, index)}
                              className="ml-3"
                            >
                              Resolve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Changes */}
                {faculty.pendingChanges && faculty.pendingChanges.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-gray-900">Pending Changes</h4>
                    </div>
                    <div className="space-y-2">
                      {faculty.pendingChanges.map((change, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                  {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
                                </span>
                                <span className="text-xs text-gray-600">Submitted {change.submittedAt}</span>
                              </div>
                              <p className="text-sm text-gray-900">{change.description}</p>
                            </div>
                            <div className="flex gap-2 ml-3">
                              <Button
                                size="sm"
                                onClick={() => handleApproveChange(faculty.id, index)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectChange(faculty.id, index)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Faculty List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Faculty Member</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Department</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Profile</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Content</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Last Active</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFaculty.map((faculty) => (
                  <tr key={faculty.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{faculty.name}</div>
                        <div className="text-sm text-gray-600">{faculty.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{faculty.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        faculty.status === "active" 
                          ? "bg-green-100 text-green-700" 
                          : faculty.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {faculty.status === "active" && <CheckCircle className="w-3 h-3" />}
                        {faculty.status === "pending" && <XCircle className="w-3 h-3" />}
                        {faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                faculty.profileCompletion >= 80 
                                  ? "bg-green-600" 
                                  : faculty.profileCompletion >= 50 
                                  ? "bg-yellow-600" 
                                  : "bg-red-600"
                              }`}
                              style={{ width: `${faculty.profileCompletion}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 w-10">{faculty.profileCompletion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 text-xs text-gray-600">
                        <span>{faculty.publications}p</span>
                        <span>{faculty.patents}pt</span>
                        <span>{faculty.projects}pr</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{faculty.lastActive}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Mail className="w-4 h-4 text-gray-600" />
                        </button>
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

          {filteredFaculty.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No faculty members found</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#8b0000] to-[#6b0000] rounded-lg p-6 text-white">
        <h3 className="font-medium text-lg mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Approve Pending Profiles ({statusCounts.pending})
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Send Reminder Emails
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Export Faculty List
          </Button>
        </div>
      </div>
    </div>
  );
}