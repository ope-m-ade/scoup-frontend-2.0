import { Mail, Phone, ExternalLink, FileText, Lightbulb, FolderOpen, User } from "lucide-react";
import { SearchResult } from "../data/searchData";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  activeFilters: string[];
}

export function SearchResults({ results, query, activeFilters }: SearchResultsProps) {
  // Filter results based on active filters
  const filteredResults = results.filter(result => activeFilters.includes(result.type));

  if (filteredResults.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="text-gray-400 mb-4">
          <FileText className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-light text-gray-700 mb-2">No results found</h3>
        <p className="text-gray-500 font-light">
          {results.length > 0 
            ? "Try adjusting your filters to see more results"
            : "Try adjusting your search terms or exploring different keywords"
          }
        </p>
      </div>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (confidence >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return "High Match";
    if (confidence >= 60) return "Good Match";
    return "Moderate Match";
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900 mb-2">
          Search Results for "{query}"
        </h2>
        <p className="text-gray-600 font-light">
          Found {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"}
        </p>
      </div>

      <div className="space-y-6">
        {filteredResults.map((result, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            {/* Result Type Badge & Confidence */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {result.type === "faculty" && (
                  <div className="flex items-center gap-2 text-[#8b0000]">
                    <User className="w-5 h-5" />
                    <span className="font-medium text-sm">Faculty Member</span>
                  </div>
                )}
                {result.type === "paper" && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium text-sm">Research Paper</span>
                  </div>
                )}
                {result.type === "patent" && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Lightbulb className="w-5 h-5" />
                    <span className="font-medium text-sm">Patent</span>
                  </div>
                )}
                {result.type === "project" && (
                  <div className="flex items-center gap-2 text-green-600">
                    <FolderOpen className="w-5 h-5" />
                    <span className="font-medium text-sm">Project</span>
                  </div>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(result.confidence)}`}>
                {result.confidence}% · {getConfidenceLabel(result.confidence)}
              </div>
            </div>

            {/* Faculty Result */}
            {result.type === "faculty" && "name" in result.data && (
              <div className="flex gap-6">
                <img
                  src={result.data.photo}
                  alt={result.data.name}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-900 mb-1">
                    {result.data.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {result.data.title} · {result.data.department}
                  </p>
                  
                  {/* Research Interests - Prominent Display */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Research Interests
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.data.researchInterests.map((interest, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gradient-to-r from-[#8b0000] to-[#6b0000] text-white text-sm rounded-full font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Justification */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-900 font-light">
                      <span className="font-medium">AI Match Summary: </span>
                      {result.aiJustification}
                    </p>
                  </div>

                  {/* Contact Section - Enhanced */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Contact Information
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={`mailto:${result.data.email}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#8b0000] transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {result.data.email}
                      </a>
                      <a
                        href={`tel:${result.data.phone}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#8b0000] transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {result.data.phone}
                      </a>
                      <a
                        href={`mailto:${result.data.email}?subject=Inquiry via SCOUP Platform&body=Hello Dr. ${result.data.name.split(' ').pop()},%0D%0A%0D%0AI found your profile on the SCOUP platform and would like to connect regarding your research in ${result.data.researchInterests[0]}.%0D%0A%0D%0A`}
                        className="ml-auto px-4 py-2 bg-[#8b0000] hover:bg-[#6b0000] text-[#ffd100] rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Contact Me
                      </a>
                    </div>
                  </div>

                  {/* Matched Keywords */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Matched Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.slice(0, 5).map((keyword, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#ffd100] text-[#8b0000] text-xs rounded-full font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                      {result.matchedKeywords.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{result.matchedKeywords.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Paper Result */}
            {result.type === "paper" && "title" in result.data && "abstract" in result.data && (
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {result.data.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {result.data.authors.join(", ")} · {result.data.year}
                </p>

                {/* AI Justification */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-900 font-light">
                    <span className="font-medium">AI Summary: </span>
                    {result.aiJustification}
                  </p>
                </div>

                {/* Abstract */}
                <p className="text-sm text-gray-700 font-light mb-3 line-clamp-3">
                  {result.data.abstract}
                </p>

                {/* Matched Keywords & Link */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.slice(0, 4).map((keyword, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <a
                    href={result.data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#8b0000] hover:text-[#6b0000] font-medium transition-colors"
                  >
                    View Paper
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Patent Result */}
            {result.type === "patent" && "title" in result.data && "patentNumber" in result.data && (
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {result.data.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {result.data.inventors.join(", ")} · Patent: {result.data.patentNumber} · {result.data.year}
                </p>

                {/* AI Justification */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-900 font-light">
                    <span className="font-medium">AI Summary: </span>
                    {result.aiJustification}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 font-light mb-3">
                  {result.data.description}
                </p>

                {/* Matched Keywords & Link */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.slice(0, 4).map((keyword, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <a
                    href={result.data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#8b0000] hover:text-[#6b0000] font-medium transition-colors"
                  >
                    View Patent
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Project Result */}
            {result.type === "project" && "title" in result.data && "status" in result.data && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-medium text-gray-900">
                    {result.data.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    result.data.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {result.data.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Lead Faculty: {result.data.leadFaculty.join(", ")} · Started: {result.data.startDate}
                </p>

                {/* AI Justification */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-900 font-light">
                    <span className="font-medium">AI Summary: </span>
                    {result.aiJustification}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 font-light mb-3">
                  {result.data.description}
                </p>

                {/* Matched Keywords */}
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords.slice(0, 5).map((keyword, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}