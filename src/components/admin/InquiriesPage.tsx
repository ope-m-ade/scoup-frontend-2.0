import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Globe,
  Mail,
  MessageSquare,
  Tag,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { adminInquiriesAPI } from "../../utils/api";
import { Button } from "../ui/button";

type Inquiry = {
  id: number;
  status: "pending" | "reviewed" | "closed";
  source_type: "faculty" | "external";
  created_at: string;
  from_faculty_name: string;
  from_faculty_email: string;
  from_faculty_department: string;
  target_faculty_name: string;
  target_faculty_id: string;
  target_department: string;
  target_school: string;
  shared_keywords: string[];
  note: string;
  admin_notes: string;
  reviewed_by: string;
};

type InquiryStatus = Inquiry["status"];
type StatusFilter = InquiryStatus | "all";
type SourceFilter = Inquiry["source_type"] | "all";

const STATUS_BADGE: Record<InquiryStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  reviewed: "bg-blue-50 text-blue-700 border-blue-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_ICON: Record<InquiryStatus, LucideIcon> = {
  pending: Clock,
  reviewed: CheckCircle2,
  closed: XCircle,
};

const STATUS_LABEL: Record<InquiryStatus, string> = {
  pending: "Pending",
  reviewed: "Reviewed",
  closed: "Closed",
};

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<number | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

  useEffect(() => {
    adminInquiriesAPI
      .list()
      .then((res) => setInquiries(res.results ?? []))
      .catch(() => setError("Failed to load inquiries."))
      .finally(() => setIsLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      pending: inquiries.filter((i) => i.status === "pending").length,
      reviewed: inquiries.filter((i) => i.status === "reviewed").length,
      closed: inquiries.filter((i) => i.status === "closed").length,
      faculty: inquiries.filter((i) => i.source_type === "faculty").length,
      external: inquiries.filter((i) => i.source_type === "external").length,
    }),
    [inquiries],
  );

  const visible = useMemo(
    () =>
      inquiries.filter(
        (inq) =>
          (statusFilter === "all" || inq.status === statusFilter) &&
          (sourceFilter === "all" || inq.source_type === sourceFilter),
      ),
    [inquiries, sourceFilter, statusFilter],
  );

  const handleStatus = async (id: number, newStatus: InquiryStatus) => {
    try {
      const updated = await adminInquiriesAPI.update(id, { status: newStatus });
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id ? { ...inq, status: updated.status ?? newStatus, reviewed_by: updated.reviewed_by ?? inq.reviewed_by } : inq,
        ),
      );
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleNoteSave = async (id: number) => {
    const nextNotes = notesDraft[id] ?? "";
    setSaving(id);
    try {
      await adminInquiriesAPI.update(id, { admin_notes: nextNotes });
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id ? { ...inq, admin_notes: nextNotes } : inq,
        ),
      );
    } catch {
      alert("Failed to save note.");
    } finally {
      setSaving(null);
    }
  };

  function StatusPill({
    value,
    label,
    count,
  }: {
    value: StatusFilter;
    label: string;
    count?: number;
  }) {
    const active = statusFilter === value;
    return (
      <button
        type="button"
        onClick={() => setStatusFilter(value)}
        style={{ padding: "0.5rem 1rem" }}
        className={`rounded-full text-sm font-medium border transition-all duration-200 ${
          active
            ? "bg-[#8b0000] text-white border-[#8b0000] shadow-sm"
            : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
        }`}
      >
        {label}
        {count !== undefined ? ` (${count})` : ""}
      </button>
    );
  }

  const exportCsv = () => {
    const headers = [
      "ID", "Date", "Status", "Source", "From Name", "From Email",
      "From Department", "Target Faculty", "Target Department",
      "Target School", "Shared Keywords", "Note", "Admin Notes", "Reviewed By",
    ];
    const rows = inquiries.map(inq => [
      inq.id,
      formatDate(inq.created_at),
      inq.status,
      inq.source_type,
      inq.from_faculty_name,
      inq.from_faculty_email,
      inq.from_faculty_department,
      inq.target_faculty_name,
      inq.target_department,
      inq.target_school,
      (inq.shared_keywords ?? []).join("; "),
      inq.note,
      inq.admin_notes,
      inq.reviewed_by,
    ].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`));

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scoup-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Inquiries</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Review faculty-to-faculty and external collaboration requests, track
            follow-up, and keep internal notes in one place.
          </p>
        </div>
        {inquiries.length > 0 && (
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusPill value="all" label="All" count={inquiries.length} />
          <StatusPill value="pending" label="Pending" count={counts.pending} />
          <StatusPill
            value="reviewed"
            label="Reviewed"
            count={counts.reviewed}
          />
          <StatusPill value="closed" label="Closed" count={counts.closed} />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-500 font-medium whitespace-nowrap">
            Source
          </label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent transition-all duration-200"
          >
            <option value="all">All sources</option>
            <option value="faculty">Faculty ({counts.faculty})</option>
            <option value="external">External ({counts.external})</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center gap-3 py-16 justify-center text-sm text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#8b0000] rounded-full animate-spin" />
          Loading inquiries…
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-base text-gray-400 font-medium">
            {statusFilter === "all" && sourceFilter === "all"
              ? "No inquiries yet."
              : "No inquiries match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((inq) => {
            const isOpen = expanded === inq.id;
            const StatusIcon = STATUS_ICON[inq.status];
            const keywords = inq.shared_keywords ?? [];
            const fromName =
              inq.from_faculty_name?.trim() ||
              (inq.source_type === "external"
                ? "External requester"
                : "Faculty requester");
            const targetName =
              inq.target_faculty_name?.trim() || "Selected faculty member";

            return (
              <div
                key={inq.id}
                className={`bg-white border rounded-lg overflow-hidden transition-all duration-200 ${
                  inq.status === "pending"
                    ? "border-yellow-200"
                    : "border-gray-200"
                } ${isOpen ? "shadow-md" : "hover:shadow-sm"}`}
              >
                {/* Collapsed row */}
                <button
                  type="button"
                  className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => {
                    setExpanded(isOpen ? null : inq.id);
                    if (!isOpen && notesDraft[inq.id] === undefined) {
                      setNotesDraft((d) => ({
                        ...d,
                        [inq.id]: inq.admin_notes ?? "",
                      }));
                    }
                  }}
                >
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Names */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-base font-semibold text-gray-900 leading-tight">
                        {fromName}
                      </span>
                      <span className="text-gray-300 text-sm">→</span>
                      <span className="text-base font-semibold text-[#8b0000] leading-tight">
                        {targetName}
                      </span>
                    </div>
                    {/* Meta */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border text-xs font-medium px-2.5 py-0.5 ${STATUS_BADGE[inq.status]}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {STATUS_LABEL[inq.status]}
                      </span>
                      {inq.source_type === "external" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border text-xs font-medium px-2.5 py-0.5 bg-green-50 text-green-700 border-green-200">
                          <Globe className="w-3 h-3" /> External
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border text-xs font-medium px-2.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                          <Users className="w-3 h-3" /> Faculty
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(inq.created_at)}
                      </span>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-6 pt-5 pb-6 space-y-5">
                    {/* From / To */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
                          {inq.source_type === "external"
                            ? "External Requester"
                            : "From Faculty"}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          {fromName}
                        </p>
                        {inq.from_faculty_email && (
                          <a
                            href={`mailto:${inq.from_faculty_email}`}
                            className="inline-flex items-center gap-1.5 text-sm text-[#8b0000] hover:underline mb-2"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {inq.from_faculty_email}
                          </a>
                        )}
                        {inq.from_faculty_department && (
                          <p className="flex items-center gap-1.5 text-sm text-gray-600 mt-2">
                            <Building2 className="w-3.5 h-3.5" />
                            {inq.from_faculty_department}
                          </p>
                        )}
                      </div>

                      <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
                          Regarding
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          {targetName}
                        </p>
                        {inq.target_department && (
                          <p className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Building2 className="w-3.5 h-3.5" />
                            {inq.target_department}
                          </p>
                        )}
                        {inq.target_school && (
                          <p className="text-sm text-gray-500 mt-2">
                            {inq.target_school}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shared keywords */}
                    {keywords.length > 0 && (
                      <div className="space-y-2.5">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" /> Shared Keywords
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {keywords.map((kw) => (
                            <span
                              key={kw}
                              style={{ padding: "0.25rem 0.75rem" }}
                              className="text-sm bg-[#ffd100]/15 text-[#8b0000] border border-[#ffd100]/30 rounded-md inline-flex items-center"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Message / Note */}
                    {inq.note && (
                      <div className="space-y-4">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                          {inq.source_type === "external"
                            ? "Message from Requester"
                            : "Note from Faculty"}
                        </p>
                        <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3.5 leading-relaxed">
                          {inq.note}
                        </p>
                      </div>
                    )}

                    {/* Admin notes */}
                    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                          Admin Notes
                        </p>
                        {inq.reviewed_by && (
                          <p className="text-xs text-gray-400">
                            Reviewed by <span className="font-medium text-gray-600">{inq.reviewed_by}</span>
                          </p>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        value={notesDraft[inq.id] ?? inq.admin_notes ?? ""}
                        onChange={(e) =>
                          setNotesDraft((d) => ({
                            ...d,
                            [inq.id]: e.target.value,
                          }))
                        }
                        placeholder="Add internal notes, follow-up status, or routing details..."
                        className="w-full px-4 py-3.5 text-sm text-gray-800 bg-white resize-none border-0 focus:outline-none placeholder:text-gray-400 leading-relaxed"
                      />
                      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={saving === inq.id}
                          onClick={() => handleNoteSave(inq.id)}
                        >
                          {saving === inq.id ? "Saving…" : "Save Notes"}
                        </Button>

                        {inq.status === "pending" && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                            onClick={() => handleStatus(inq.id, "reviewed")}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark Reviewed
                          </Button>
                        )}

                        {inq.status !== "closed" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-gray-600"
                            onClick={() => handleStatus(inq.id, "closed")}
                          >
                            <XCircle className="w-4 h-4" />
                            Close
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatus(inq.id, "pending")}
                          >
                            Reopen
                          </Button>
                        )}

                        {inq.from_faculty_email && (
                          <a
                            className="ml-auto"
                            href={`mailto:${inq.from_faculty_email}?subject=${encodeURIComponent(
                              `Re: Collaboration Inquiry – ${targetName}`,
                            )}&body=${encodeURIComponent(
                              `Hello ${fromName},\n\nThank you for your inquiry regarding ${targetName}. We have received your request and will follow up shortly.\n\nBest,\nSCOUP Team`,
                            )}`}
                          >
                            <Button
                              size="sm"
                              className="bg-[#8b0000] hover:bg-[#700000] text-white font-semibold"
                            >
                              <Mail className="w-4 h-4" />
                              {inq.source_type === "external"
                                ? "Reply to Requester"
                                : "Reply to Sender"}
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
