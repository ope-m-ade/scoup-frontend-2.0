import { ArrowLeft, Upload, Brain, Search, CheckCircle, AlertCircle, FileText, BookOpen, Lightbulb, FolderOpen } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface Props {
  onNavigate: (path: string) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      {children}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-5">
      <div className="w-8 h-8 rounded-full bg-[#8b0000] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
        {n}
      </div>
      <div>
        <p className="font-semibold text-gray-800 mb-1">{title}</p>
        <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function InfoBox({ icon: Icon, title, color, children }: { icon: any; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border p-4 mb-4 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function CVUploadDocumentation({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onNavigate={onNavigate} />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#fff9e6] to-white px-6 py-14">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => onNavigate("/documentation")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Documentation
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#8b0000] text-[#ffd100] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">CV Upload & Paper Extraction</h1>
                <p className="text-gray-500 text-sm mt-0.5">Updated May 8, 2026 · Faculty Dashboard Feature</p>
              </div>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              A complete walkthrough of how SCOUP extracts academic output from a faculty CV — from PDF parsing through AI
              extraction, abstract enrichment, deduplication, and the review-before-save workflow.
            </p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">

            {/* Overview */}
            <Section title="Overview">
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                The CV Upload feature lets faculty upload their resume or academic CV as a PDF. SCOUP automatically:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 list-none">
                {[
                  ["Extracts text from the PDF using pdfplumber", Upload],
                  ["Parses papers, patents, projects, and profile info using OpenAI GPT-4o-mini", Brain],
                  ["Fetches real abstracts from CrossRef and Semantic Scholar", Search],
                  ["Deduplicates against existing data before showing results", CheckCircle],
                  ["Lets faculty review and approve exactly what gets saved", CheckCircle],
                ].map(([text, Icon]: any, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-[#8b0000] mt-0.5 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </Section>

            {/* Step-by-step */}
            <Section title="How It Works — Step by Step">
              <Step n={1} title="PDF Upload">
                Faculty drag-and-drop or click to upload a PDF (max 50 MB). The file is sent to the Django backend
                via a multipart POST to <code className="bg-gray-100 px-1 rounded text-xs">/api/faculty/upload-cv-papers/</code>.
                Only PDF files are accepted; scanned PDFs without text layers will return an error.
              </Step>

              <Step n={2} title="Text Extraction (pdfplumber)">
                The server opens the PDF with <strong>pdfplumber</strong> and extracts raw text from every page.
                Up to the first 14,000 characters are passed to the AI model (roughly 8–12 dense pages).
                If the PDF yields no text (e.g., a scanned image), the request is rejected with a clear message.
              </Step>

              <Step n={3} title="AI Parsing (OpenAI GPT-4o-mini)">
                The extracted text is sent to <strong>GPT-4o-mini</strong> with a structured system prompt that instructs the
                model to return a JSON object with four keys:
                <div className="mt-2 bg-gray-50 rounded-lg p-3 font-mono text-xs leading-relaxed">
                  {"{"}<br />
                  &nbsp;&nbsp;"profile": {"{ title, bio, department }"}<br />
                  &nbsp;&nbsp;"papers": [{"{ title, year, journal, doi, authors }"}],<br />
                  &nbsp;&nbsp;"patents": [{"{ title, patent_number, year, inventors }"}],<br />
                  &nbsp;&nbsp;"projects": [{"{ title, description, year }"}]<br />
                  {"}"}
                </div>
                <p className="mt-2">
                  The prompt explicitly instructs the model to look in sections labelled
                  "Publications", "Research", "Published Intellectual Contributions", "Refereed Articles", etc.
                  DOI links (<code className="bg-gray-100 px-1 rounded text-xs">https://doi.org/10.xxxx/...</code>) are
                  normalised to bare DOI strings before processing.
                </p>
              </Step>

              <Step n={4} title="Deduplication">
                Before enrichment, extracted papers are deduplicated in two passes:
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li><strong>By DOI</strong> — if two papers share the same DOI, only the first is kept.</li>
                  <li><strong>By title</strong> — title is normalised (lowercased, punctuation stripped) and compared;
                    papers with identical normalised titles are collapsed.</li>
                </ol>
              </Step>

              <Step n={5} title="Abstract Enrichment">
                For each unique paper, SCOUP attempts to fetch the real abstract in this order:
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li><strong>CrossRef by DOI</strong> — exact match; most reliable. JATS XML tags are stripped.</li>
                  <li><strong>Semantic Scholar title search</strong> — top 3 results; only accepted if title word-overlap ≥ 45%.</li>
                  <li><strong>CrossRef title search</strong> — top 3 results; same 45% similarity threshold.</li>
                </ol>
                <p className="mt-1">
                  If no abstract is found from any source, the paper is returned with an empty abstract. Faculty
                  can later upload the paper's own PDF on the edit page to have AI extract the abstract from full text.
                </p>
              </Step>

              <Step n={6} title="Review Screen">
                All extracted items are returned to the frontend for review. <strong>Nothing is saved yet.</strong>
                Faculty see grouped sections (Profile, Papers, Patents, Projects) with checkboxes. They can:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Select or deselect individual items</li>
                  <li>Use "Select all / Deselect all" per section</li>
                  <li>Search for additional papers by title or DOI and add them inline</li>
                  <li>Start over and upload a different file</li>
                </ul>
              </Step>

              <Step n={7} title="Save (Confirm)">
                When faculty click <strong>Save selected items</strong>, the approved list is sent to
                <code className="bg-gray-100 px-1 rounded text-xs"> /api/faculty/confirm-cv-items/</code>.
                The backend:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Creates papers with <code className="bg-gray-100 px-1 rounded text-xs">status = "draft"</code> — not publicly visible until published</li>
                  <li>Deduplicates by DOI (existing paper? just adds the faculty as an author)</li>
                  <li>Deduplicates by title if no DOI is present</li>
                  <li>Generates a placeholder DOI (<code className="bg-gray-100 px-1 rounded text-xs">cv-import-xxx</code>) for papers with no DOI — this is internal only and never shown in the UI</li>
                  <li>Converts bare year integers to <code className="bg-gray-100 px-1 rounded text-xs">YYYY-01-01</code> for storage in the <code className="bg-gray-100 px-1 rounded text-xs">date_published</code> field</li>
                </ul>
              </Step>
            </Section>

            {/* Manual search */}
            <Section title="Manual Paper Search">
              <p className="text-sm text-gray-600 mb-3">
                Faculty can also search for specific papers without uploading a CV. The search bar (available on both
                the upload page and the review screen) queries:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li><strong>By DOI</strong> — detected automatically if the query starts with <code className="bg-gray-100 px-1 rounded text-xs">10.</code> or contains <code className="bg-gray-100 px-1 rounded text-xs">doi.org/</code>. Fetches from CrossRef for an exact metadata match.</li>
                <li><strong>By title</strong> — queries Semantic Scholar (up to 8 results) and CrossRef (up to 5 results) in parallel, deduplicating by DOI.</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">
                Results show title, year, journal, DOI, abstract preview, and source. Clicking <strong>Add</strong>
                immediately puts the paper in the review list as selected.
              </p>
            </Section>

            {/* Paper PDF for abstract */}
            <Section title="Extracting an Abstract from the Paper's Own PDF">
              <p className="text-sm text-gray-600 mb-3">
                If a paper has no abstract (common for older publications not indexed in CrossRef or Semantic Scholar),
                faculty can upload the paper PDF directly on the paper's edit page:
              </p>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Go to <strong>Papers</strong> → click <strong>Edit</strong> on any paper</li>
                <li>In the Abstract section, click <strong>Upload paper PDF to auto-extract</strong></li>
                <li>The PDF is sent to <code className="bg-gray-100 px-1 rounded text-xs">/api/faculty/extract-abstract/</code></li>
                <li>pdfplumber extracts the full text; GPT-4o-mini either finds the abstract verbatim or writes a concise 3–5 sentence summary</li>
                <li>The extracted abstract is populated into the field — faculty can edit it before saving</li>
              </ol>
            </Section>

            {/* Draft / Published */}
            <Section title="Draft vs. Published Papers">
              <InfoBox icon={AlertCircle} title="CV-imported papers start as Draft" color="bg-amber-50 border-amber-200 text-amber-800">
                Any paper added through CV upload defaults to <strong>Draft</strong> status and is not visible in
                the public SCOUP search. This gives faculty a chance to review the imported data before it goes live.
              </InfoBox>
              <InfoBox icon={CheckCircle} title="Publishing options" color="bg-green-50 border-green-200 text-green-800">
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Publish one</strong> — click the eye icon on any draft paper in the Papers list</li>
                  <li><strong>Publish selected</strong> — check the boxes on multiple drafts, then click "Publish selected"</li>
                  <li><strong>Publish all drafts</strong> — click "Publish all drafts (N)" in the header without selecting anything</li>
                </ul>
              </InfoBox>
            </Section>

            {/* What gets extracted */}
            <Section title="What Gets Extracted">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: BookOpen,
                    label: "Research Papers",
                    fields: ["Title", "Year", "Journal / Conference", "DOI", "Authors", "Abstract (via CrossRef/SS)"],
                  },
                  {
                    icon: Lightbulb,
                    label: "Patents",
                    fields: ["Title", "Patent number", "Year", "Inventors"],
                  },
                  {
                    icon: FolderOpen,
                    label: "Projects",
                    fields: ["Title", "Brief description", "Year"],
                  },
                  {
                    icon: FileText,
                    label: "Profile Info",
                    fields: ["Academic title (Professor, etc.)", "Professional bio", "Department"],
                  },
                ].map(({ icon: Icon, label, fields }) => (
                  <div key={label} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-[#8b0000]" />
                      <span className="font-semibold text-sm text-gray-800">{label}</span>
                    </div>
                    <ul className="text-xs text-gray-500 space-y-0.5 list-disc list-inside">
                      {fields.map(f => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            {/* Limitations */}
            <Section title="Known Limitations">
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li><strong>Scanned PDFs</strong> — image-only PDFs with no text layer cannot be parsed. Faculty must use a text-based PDF.</li>
                <li><strong>Abstract availability</strong> — CrossRef and Semantic Scholar don't have abstracts for all papers, especially older or non-OA works. Upload the paper PDF to generate one with AI.</li>
                <li><strong>Long CVs</strong> — only the first ~14,000 characters are sent to GPT-4o-mini. Very long CVs may have papers from later pages missed. Split the CV or use manual search for omitted papers.</li>
                <li><strong>AI accuracy</strong> — the model is instructed not to hallucinate DOIs, but review all extracted data before publishing, especially for papers from ambiguously formatted sections.</li>
              </ul>
            </Section>

          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
