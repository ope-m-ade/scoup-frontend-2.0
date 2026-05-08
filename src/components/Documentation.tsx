import { ArrowRight, BookOpen, ClipboardList, FileText, Search, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface DocumentationProps {
  onNavigate: (path: string) => void;
}

const documents = [
  {
    title: "Search Engine Report",
    description:
      "Current architecture, ranking model, evidence scoring, AI keyword generation, frontend suggestions, and known tradeoffs.",
    status: "Updated May 8, 2026",
    icon: Search,
    path: "/documentation/search-engine",
  },
  {
    title: "CV Upload & Paper Extraction",
    description:
      "How the AI-powered CV upload works — PDF extraction, OpenAI structured parsing, CrossRef & Semantic Scholar abstract fetching, deduplication, and the manual paper search.",
    status: "Updated May 8, 2026",
    icon: FileText,
    path: "/documentation/cv-upload",
  },
  {
    title: "Implementation Plan Gap Analysis",
    description:
      "A section-by-section comparison between the SCOUP implementation plan and the current product: search, dashboards, governance, communications, analytics, and pilot readiness.",
    status: "Updated May 8, 2026",
    icon: ClipboardList,
    path: "/documentation/implementation-gap-analysis",
  },
];

export function Documentation({ onNavigate }: DocumentationProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onNavigate={onNavigate} currentPath="/documentation" />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-[#fff9e6] to-white px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd100]/70 bg-white px-4 py-2 text-sm font-medium text-[#8b0000] shadow-sm mb-6">
              <BookOpen className="w-4 h-4" />
              SCOUP Documentation
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Platform <span className="text-[#8b0000]">Documentation</span>
            </h1>
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-3xl">
              Technical notes and implementation references for the SCOUP platform.
            </p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-gray-900 mb-2">
                Documents
              </h2>
              <p className="text-sm text-gray-600">
                Start here for current implementation details and working notes.
              </p>
            </div>

            <div className="space-y-4">
              {documents.map((document) => {
                const Icon = document.icon;
                return (
                  <Card
                    key={document.title}
                    className="p-6 border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                      <div className="w-12 h-12 rounded-lg bg-[#8b0000] text-[#ffd100] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl font-medium text-gray-900">
                            {document.title}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3bf] px-3 py-1 text-xs font-medium text-[#8b0000]">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {document.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {document.description}
                        </p>
                      </div>
                      <Button
                        onClick={() => onNavigate(document.path)}
                        className="bg-[#8b0000] hover:bg-[#700000] text-white shrink-0"
                      >
                        Open
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export function SearchEngineDocumentation({ onNavigate }: DocumentationProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onNavigate={onNavigate} currentPath="/documentation" />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-[#fff9e6] to-white px-6 py-14">
          <div className="max-w-5xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => onNavigate("/documentation")}
              className="mb-6 text-gray-700 hover:text-[#8b0000] hover:bg-[#fff3bf]"
            >
              Back to documentation
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#8b0000] text-[#ffd100] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#8b0000]">
                  Technical Report
                </p>
                <h1 className="text-4xl font-light text-gray-900">
                  Search Engine Report
                </h1>
              </div>
            </div>
            <p className="text-gray-600 max-w-3xl leading-relaxed">
              Current architecture and behavior for SCOUP search, including backend
              ranking, evidence scoring, AI keyword generation, frontend suggestions,
              and result rendering.
            </p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="max-w-5xl mx-auto grid gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-3">
                Current Location
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                The full markdown report is maintained in the repository at:
              </p>
              <code className="block rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-800 overflow-x-auto">
                docs/search-engine-contract.md
              </code>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                What It Covers
              </h2>
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                <li className="rounded-lg border border-gray-200 p-3">Backend `/api/search/` flow</li>
                <li className="rounded-lg border border-gray-200 p-3">Query parsing and normalization</li>
                <li className="rounded-lg border border-gray-200 p-3">Evidence model and confidence scores</li>
                <li className="rounded-lg border border-gray-200 p-3">Faculty, paper, patent, and project scoring</li>
                <li className="rounded-lg border border-gray-200 p-3">Semantic paper search and embeddings</li>
                <li className="rounded-lg border border-gray-200 p-3">OpenAI AI keyword generation</li>
                <li className="rounded-lg border border-gray-200 p-3">Frontend suggestions and rendering</li>
                <li className="rounded-lg border border-gray-200 p-3">Known tradeoffs and expected behavior</li>
              </ul>
            </Card>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export function ImplementationGapAnalysisDocumentation({ onNavigate }: DocumentationProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onNavigate={onNavigate} currentPath="/documentation" />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-[#fff9e6] to-white px-6 py-14">
          <div className="max-w-5xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => onNavigate("/documentation")}
              className="mb-6 text-gray-700 hover:text-[#8b0000] hover:bg-[#fff3bf]"
            >
              Back to documentation
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#8b0000] text-[#ffd100] flex items-center justify-center">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#8b0000]">
                  Product Report
                </p>
                <h1 className="text-4xl font-light text-gray-900">
                  Implementation Plan Gap Analysis
                </h1>
              </div>
            </div>
            <p className="text-gray-600 max-w-3xl leading-relaxed">
              Current comparison between the SCOUP implementation plan and the
              working application, including stakeholder roles, search behavior,
              dashboards, governance, communications, analytics, and pilot readiness.
            </p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="max-w-5xl mx-auto grid gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-3">
                Current Location
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                The full markdown report is maintained in the repository at:
              </p>
              <code className="block rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-800 overflow-x-auto">
                docs/scoup-implementation-plan-gap-analysis.md
              </code>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                What It Covers
              </h2>
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                <li className="rounded-lg border border-gray-200 p-3">Stakeholder role comparison</li>
                <li className="rounded-lg border border-gray-200 p-3">External, faculty, and admin portal gaps</li>
                <li className="rounded-lg border border-gray-200 p-3">Search engine alignment with the plan</li>
                <li className="rounded-lg border border-gray-200 p-3">Keyword stewardship and AI keyword gaps</li>
                <li className="rounded-lg border border-gray-200 p-3">Governance and approval workflow gaps</li>
                <li className="rounded-lg border border-gray-200 p-3">External inquiries and support ticket gaps</li>
                <li className="rounded-lg border border-gray-200 p-3">Analytics and feedback-loop gaps</li>
                <li className="rounded-lg border border-gray-200 p-3">Recommended build order</li>
              </ul>
            </Card>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
