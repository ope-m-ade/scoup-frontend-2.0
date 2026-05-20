import { useEffect, useState } from "react";
import { BookOpen, Search, Server, Upload, ExternalLink, FileText, Github, Globe, Code2 } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { contactAPI } from "../utils/api";

interface Props {
  onNavigate: (path: string) => void;
}

const DOCS = [
  {
    icon: BookOpen,
    title: "Frontend Overview",
    description:
      "Every public page, faculty dashboard tab, and admin dashboard tab — what each does and how it works. Start here for a full platform walkthrough.",
    path: "scoup-frontend-2.0/docs/frontend-overview.md",
  },
  {
    icon: Search,
    title: "Search Engine",
    description:
      "How SCOUP's search engine works — lexical scoring, semantic fallback, query expansion, result ranking, and the architecture decision to move from client-side to server-side search.",
    path: "scoupdb/docs/search-engine.md",
  },
  {
    icon: Server,
    title: "Backend Architecture & API",
    description:
      "Data models, REST API endpoints, project structure, authentication flow, and deployment configuration for the Django backend.",
    path: "scoupdb/docs/backend-architecture-and-api.md",
  },
  {
    icon: Upload,
    title: "CV Upload & Paper Extraction",
    description:
      "How PDF upload works — extracting paper titles, CrossRef enrichment, the faculty review and confirm flow, and AI keyword generation on imported papers.",
    path: "scoupdb/docs/cv-upload.md",
  },
  {
    icon: FileText,
    title: "Handoff & Architecture Decisions",
    description:
      "Developer handoff notes covering backend maintainability, the school/department relational model, faculty review workflow, and recommendations for future maintainers.",
    path: "scoup-frontend-2.0/HANDOFF_NOTES.md",
  },
];

export function Documentation({ onNavigate }: Props) {
  const [githubBase, setGithubBase] = useState<string>("");
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [docsUrl, setDocsUrl] = useState<string>("");
  const [apiDocsUrl, setApiDocsUrl] = useState<string>("");

  useEffect(() => {
    contactAPI
      .getSettings()
      .then((data: any) => {
        const url: string = data?.github_url || "";
        const base = url.replace(/\/$/, "");
        setRepoUrl(base);
        setGithubBase(base ? `${base}/blob/main` : "");
        setDocsUrl(data?.documentation_url || "");
        setApiDocsUrl(data?.api_documentation_url || "");
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onNavigate={onNavigate} currentPath="/docs" />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#fff9e6] to-white px-6 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Documentation
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Technical references and guides for the SCOUP platform.
              All documents live in the project repository.
            </p>
          </div>
        </section>

        {/* Repositories */}
        <section className="max-w-4xl mx-auto px-6 pt-10 pb-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Project Repositories</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href={repoUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#8b0000]/30 hover:shadow-sm transition-all bg-white ${!repoUrl ? "opacity-50 pointer-events-none" : ""}`}
            >
              <Github className="w-5 h-5 text-gray-500 group-hover:text-[#8b0000] shrink-0 transition-colors" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#8b0000] transition-colors">SCOUP Frontend</p>
                <p className="text-xs text-gray-400 truncate">{repoUrl || "URL not configured"}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#8b0000] shrink-0 ml-auto transition-colors" />
            </a>

            <a
              href="https://github.com/Salisbury-University/2024Fall-COSC425-AcademicMetrics"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#8b0000]/30 hover:shadow-sm transition-all bg-white"
            >
              <Github className="w-5 h-5 text-gray-500 group-hover:text-[#8b0000] shrink-0 transition-colors" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#8b0000] transition-colors">Academic Metrics (v1)</p>
                <p className="text-xs text-gray-400 truncate">Original COSC425 research metrics project</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#8b0000] shrink-0 ml-auto transition-colors" />
            </a>

            {docsUrl && (
              <a
                href={docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#8b0000]/30 hover:shadow-sm transition-all bg-white"
              >
                <Globe className="w-5 h-5 text-gray-500 group-hover:text-[#8b0000] shrink-0 transition-colors" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#8b0000] transition-colors">Documentation Site</p>
                  <p className="text-xs text-gray-400 truncate">{docsUrl}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#8b0000] shrink-0 ml-auto transition-colors" />
              </a>
            )}

            {apiDocsUrl && (
              <a
                href={apiDocsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#8b0000]/30 hover:shadow-sm transition-all bg-white"
              >
                <Code2 className="w-5 h-5 text-gray-500 group-hover:text-[#8b0000] shrink-0 transition-colors" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#8b0000] transition-colors">API Documentation</p>
                  <p className="text-xs text-gray-400 truncate">{apiDocsUrl}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#8b0000] shrink-0 ml-auto transition-colors" />
              </a>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Repository and documentation links can be updated in the admin{" "}
            <button onClick={() => onNavigate("/admin-login")} className="hover:underline hover:text-[#8b0000] transition-colors">Contact Page Editor</button>.
          </p>
        </section>

        {/* Doc cards */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid gap-5">
            {DOCS.map((doc) => {
              const href = githubBase ? `${githubBase}/${doc.path}` : "#";
              const Icon = doc.icon;
              return (
                <a
                  key={doc.title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-start gap-5 p-6 rounded-xl border border-gray-200 hover:border-[#8b0000]/30 hover:shadow-sm transition-all bg-white ${
                    !githubBase ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#8b0000]/8 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#8b0000]/15 transition-colors">
                    <Icon className="w-5 h-5 text-[#8b0000]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#8b0000] transition-colors">
                        {doc.title}
                      </h3>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#8b0000] transition-colors shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{doc.description}</p>
                    {githubBase && (
                      <p className="text-xs text-gray-400 mt-2 font-mono truncate">
                        {doc.path}
                      </p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>

          {!githubBase && (
            <p className="text-sm text-gray-400 text-center mt-8">
              GitHub repository URL not configured.{" "}
              <button
                onClick={() => onNavigate("/contact")}
                className="text-[#8b0000] hover:underline"
              >
                Contact the team
              </button>{" "}
              or set it in the admin Contact Page Editor.
            </p>
          )}
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
