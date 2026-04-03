import {
  type FacultyMember,
  type Paper,
  type Patent,
  type Project,
  type SearchResult,
} from "../data/searchData";
import { fetchSemanticPaperResults, type PublicDataset } from "./publicData";

let dataset: PublicDataset = {
  facultyData: [],
  papersData: [],
  patentsData: [],
  projectsData: [],
};
type SuggestionSource =
  | "base"
  | "faculty_name"
  | "faculty_department"
  | "faculty_interest"
  | "faculty_keyword"
  | "paper_title"
  | "paper_journal"
  | "paper_keyword"
  | "project_title"
  | "project_desc"
  | "project_keyword"
  | "patent_title"
  | "patent_keyword";

interface SuggestionEntry {
  text: string;
  normalized: string;
  source: SuggestionSource;
  sourceWeight: number;
  freq: number;
}

let suggestionIndex: SuggestionEntry[] = [];
let totalIndexedDocuments = 0;
const termDocumentFrequency = new Map<string, number>();

export function setSearchDataset(nextDataset?: Partial<PublicDataset>) {
  dataset = {
    facultyData: nextDataset?.facultyData ?? [],
    papersData: nextDataset?.papersData ?? [],
    patentsData: nextDataset?.patentsData ?? [],
    projectsData: nextDataset?.projectsData ?? [],
  };
  suggestionIndex = buildSuggestionIndex(dataset);
  buildSearchTermStats(dataset);
}

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "into",
  "your",
  "about",
  "what",
  "when",
  "where",
  "which",
  "their",
  "have",
  "has",
  "had",
  "will",
  "can",
  "how",
  "why",
  "are",
  "was",
  "were",
  "but",
  "not",
  "you",
  "our",
  "its",
  "on",
  "in",
  "to",
  "of",
  "by",
  "at",
  "as",
  "or",
  "an",
  "a",
  "use",
  "uses",
  "used",
  "using",
]);

const SHORT_TECH_TERMS = new Set(["ai", "ml", "vr", "ar", "ui", "ux"]);

function uniqueLower(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean))
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsWholeWord(text: string, token: string): boolean {
  return new RegExp(`\\b${escapeRegExp(token)}\\b`, "i").test(text);
}

function parseSearchTerms(query: string): string[] {
  return uniqueLower(
    query
      .split(/[^a-zA-Z0-9]+/)
      .map((term) => term.trim())
      .filter((term) => {
        if (!term) return false;
        const lowered = term.toLowerCase();
        if (SHORT_TECH_TERMS.has(lowered)) return true;
        if (lowered.length < 3) return false;
        return !STOPWORDS.has(lowered);
      })
  );
}

const MIN_KEYWORD_RESULT_SCORE = 25;

const BASE_SUGGESTIONS = [
  "artificial intelligence",
  "machine learning",
  "deep learning",
  "natural language processing",
  "computer vision",
  "data analytics",
  "cybersecurity",
  "public health",
  "education technology",
];

const SUGGESTION_SOURCE_WEIGHT: Record<SuggestionSource, number> = {
  base: 8,
  faculty_name: 35,
  faculty_department: 20,
  faculty_interest: 26,
  faculty_keyword: 24,
  paper_title: 42,
  paper_journal: 14,
  paper_keyword: 30,
  project_title: 24,
  project_desc: 12,
  project_keyword: 20,
  patent_title: 20,
  patent_keyword: 18,
};

const QUERY_EXPANSIONS: Record<string, string[]> = {
  ai: ["artificial intelligence", "generative ai", "machine learning", "chatgpt"],
  ml: ["machine learning", "predictive modeling"],
  nlp: ["natural language processing", "language model"],
  cv: ["computer vision", "image analysis"],
};

function collectTermsFromText(text: string): string[] {
  return parseSearchTerms(text || "");
}

function collectTermsFromKeywords(values: string[]): string[] {
  const terms: string[] = [];
  values.forEach((value) => {
    const raw = String(value || "").trim().toLowerCase();
    if (!raw) return;
    if (SHORT_TECH_TERMS.has(raw) || raw.length >= 3) {
      terms.push(raw);
    }
    collectTermsFromText(raw).forEach((term) => terms.push(term));
  });
  return terms;
}

function indexDocumentTerms(terms: string[]) {
  const unique = new Set(terms.map((term) => term.trim().toLowerCase()).filter(Boolean));
  if (unique.size === 0) return;
  totalIndexedDocuments += 1;
  unique.forEach((term) => {
    termDocumentFrequency.set(term, (termDocumentFrequency.get(term) || 0) + 1);
  });
}

function buildSearchTermStats(input: PublicDataset) {
  totalIndexedDocuments = 0;
  termDocumentFrequency.clear();

  input.facultyData.forEach((faculty) => {
    indexDocumentTerms([
      ...collectTermsFromText(
        `${faculty.name} ${faculty.department} ${faculty.title} ${faculty.bio} ${faculty.researchInterests.join(" ")}`
      ),
      ...collectTermsFromKeywords(faculty.aiKeywords || []),
    ]);
  });

  input.papersData.forEach((paper) => {
    indexDocumentTerms([
      ...collectTermsFromText(
        `${paper.title} ${paper.abstract} ${paper.journal || ""} ${paper.authors.join(" ")}`
      ),
      ...collectTermsFromKeywords(paper.aiKeywords || []),
    ]);
  });

  input.patentsData.forEach((patent) => {
    indexDocumentTerms([
      ...collectTermsFromText(
        `${patent.title} ${patent.description} ${patent.inventors.join(" ")}`
      ),
      ...collectTermsFromKeywords(patent.aiKeywords || []),
    ]);
  });

  input.projectsData.forEach((project) => {
    indexDocumentTerms([
      ...collectTermsFromText(
        `${project.title} ${project.description} ${project.leadFaculty.join(" ")}`
      ),
      ...collectTermsFromKeywords(project.aiKeywords || []),
    ]);
  });
}

function termRarityWeight(term: string): number {
  if (!totalIndexedDocuments) return 1;
  const normalized = term.trim().toLowerCase();
  if (!normalized) return 1;
  const df = termDocumentFrequency.get(normalized) || 0;
  const ratio = df / totalIndexedDocuments;

  if (ratio >= 0.6) return 0.2;
  if (ratio >= 0.4) return 0.28;
  if (ratio >= 0.25) return 0.4;
  if (ratio >= 0.15) return 0.55;
  if (ratio >= 0.08) return 0.72;
  return 1;
}

const BIOLOGY_CORE_TERMS = [
  "biology",
  "biological",
  "biomedical",
  "molecular",
  "microbiology",
  "biochemistry",
  "genetics",
  "genomic",
  "cell",
  "anatomy",
  "physiology",
  "ecology",
  "immunology",
  "embryology",
  "botany",
  "zoology",
];

function applyDomainPenalty(
  normalizedSearchTerms: string[],
  normalizedTitle: string,
  normalizedContent: string,
  normalizedKeywords: string[],
  score: number
): number {
  if (score <= 0) return score;

  const queryHasBiology = normalizedSearchTerms.some((term) =>
    term.includes("biology") || term === "biological"
  );
  const queryHasAgriculture = normalizedSearchTerms.some((term) =>
    term.includes("agricultur")
  );

  if (!queryHasBiology || queryHasAgriculture) {
    return score;
  }

  const aggregateText = `${normalizedTitle} ${normalizedContent} ${normalizedKeywords.join(" ")}`;
  const hasAgricultureAssociation = aggregateText.includes("agricultur");
  if (!hasAgricultureAssociation) {
    return score;
  }

  const hasCoreBioSignal = BIOLOGY_CORE_TERMS.some((term) => aggregateText.includes(term));
  const penalty = hasCoreBioSignal ? 8 : 18;
  return Math.max(0, score - penalty);
}

function buildSuggestionIndex(input: PublicDataset): SuggestionEntry[] {
  const byNormalized = new Map<string, SuggestionEntry>();
  const add = (raw: string, source: SuggestionSource) => {
    const value = String(raw || "").trim().replace(/\s+/g, " ");
    if (value.length < 3 || value.length > 140) return;
    const normalized = value.toLowerCase();

    const existing = byNormalized.get(normalized);
    if (existing) {
      existing.freq += 1;
      if (SUGGESTION_SOURCE_WEIGHT[source] > existing.sourceWeight) {
        existing.source = source;
        existing.sourceWeight = SUGGESTION_SOURCE_WEIGHT[source];
        existing.text = value;
      }
      return;
    }

    byNormalized.set(normalized, {
      text: value,
      normalized,
      source,
      sourceWeight: SUGGESTION_SOURCE_WEIGHT[source],
      freq: 1,
    });
  };

  BASE_SUGGESTIONS.forEach((value) => add(value, "base"));

  input.facultyData.forEach((faculty) => {
    add(faculty.name, "faculty_name");
    add(faculty.department, "faculty_department");
    add(faculty.title, "faculty_department");
    faculty.researchInterests.forEach((value) => add(value, "faculty_interest"));
    faculty.aiKeywords.forEach((value) => add(value, "faculty_keyword"));
  });

  input.papersData.forEach((paper) => {
    add(paper.title, "paper_title");
    add(paper.journal || "", "paper_journal");
    paper.aiKeywords.forEach((value) => add(value, "paper_keyword"));
  });

  input.projectsData.forEach((project) => {
    add(project.title, "project_title");
    add(project.description, "project_desc");
    project.aiKeywords.forEach((value) => add(value, "project_keyword"));
  });

  input.patentsData.forEach((patent) => {
    add(patent.title, "patent_title");
    patent.aiKeywords.forEach((value) => add(value, "patent_keyword"));
  });

  return Array.from(byNormalized.values());
}

export function getSearchSuggestions(query: string, limit = 8): string[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return suggestionIndex
      .slice()
      .sort((a, b) => b.sourceWeight - a.sourceWeight || b.freq - a.freq)
      .slice(0, limit)
      .map((item) => item.text);
  }
  if (suggestionIndex.length === 0) return [];

  const parsedTerms = parseSearchTerms(trimmed);
  const expandedPhrases = parsedTerms.flatMap((term) => QUERY_EXPANSIONS[term] || []);
  const expandedTerms = uniqueLower([
    ...parsedTerms,
    ...expandedPhrases.flatMap((phrase) => parseSearchTerms(phrase)),
  ]);
  const rawParts = trimmed.split(/\s+/).filter(Boolean);
  const lastPart = rawParts.length ? rawParts[rawParts.length - 1] : trimmed;

  const ranked = suggestionIndex
    .map((entry) => {
      const value = entry.normalized;
      let score = 0;

      if (value === trimmed) score += 260;
      if (value.startsWith(trimmed)) score += 180;
      else if (value.includes(trimmed)) score += 95;

      if (lastPart.length >= 2 && value.startsWith(lastPart)) score += 40;
      else if (lastPart.length >= 3 && value.includes(lastPart)) score += 20;

      expandedTerms.forEach((term) => {
        if (containsWholeWord(value, term)) score += 32;
        else if (term.length >= 4 && value.includes(term)) score += 14;
      });

      expandedPhrases.forEach((phrase) => {
        if (value.includes(phrase.toLowerCase())) score += 36;
      });

      score += entry.sourceWeight;
      score += Math.min(36, Math.log2(entry.freq + 1) * 14);
      score -= Math.max(0, value.length - trimmed.length) * 0.08;

      const hasShortTechIntent = parsedTerms.some((term) => SHORT_TECH_TERMS.has(term));
      if (hasShortTechIntent) {
        const hasAIWord = parsedTerms.some((term) => containsWholeWord(value, term));
        const hasExpansionWord = expandedTerms.some((term) => containsWholeWord(value, term));
        if (!hasAIWord && !hasExpansionWord) {
          score -= 90;
        }
      }

      return { entry, score };
    })
    .filter((item) => item.score >= 70)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit * 2);

  const unique = new Set<string>();
  const results: string[] = [];
  ranked.forEach((item) => {
    if (results.length >= limit) return;
    const key = item.entry.normalized;
    if (unique.has(key)) return;
    unique.add(key);
    results.push(item.entry.text);
  });

  if (results.length > 0) {
    return results;
  }

  return BASE_SUGGESTIONS.filter((item) => item.includes(trimmed)).slice(0, limit);
}

/**
 * Calculate confidence score based on keyword matches
 */
function calculateConfidence(
  searchTerms: string[],
  aiKeywords: string[],
  titleText: string,
  contentText: string
): { score: number; matchedKeywords: string[] } {
  if (searchTerms.length === 0) {
    return { score: 0, matchedKeywords: [] };
  }

  const normalizedSearchTerms = uniqueLower(searchTerms);
  const normalizedKeywords = uniqueLower(aiKeywords).filter(
    (kw) => kw.length >= 3 || SHORT_TECH_TERMS.has(kw)
  );
  const normalizedTitle = titleText.toLowerCase();
  const normalizedContent = contentText.toLowerCase();

  let termStrength = 0;
  let matchedTermRarity = 0;
  const matchedTerms = new Set<string>();
  const matchedKeywords = new Set<string>();

  normalizedSearchTerms.forEach((term) => {
    const rarity = termRarityWeight(term);
    let points = 0;
    const exactKeyword = normalizedKeywords.find((keyword) => keyword === term);
    const partialKeyword =
      term.length >= 4
        ? normalizedKeywords.find(
            (keyword) =>
              keyword.includes(term) ||
              (term.includes(keyword) && keyword.length >= 4)
          )
        : undefined;

    if (containsWholeWord(normalizedTitle, term)) {
      points += 26;
      matchedTerms.add(term);
    } else if (containsWholeWord(normalizedContent, term)) {
      points += 14;
      matchedTerms.add(term);
    }

    if (exactKeyword) {
      points += 18;
      matchedTerms.add(term);
      matchedKeywords.add(exactKeyword);
    } else if (partialKeyword) {
      points += 10;
      matchedTerms.add(term);
      matchedKeywords.add(partialKeyword);
    }

    if (points > 0) {
      matchedTermRarity += rarity;
    }
    termStrength += Math.min(34, points * rarity);
  });

  if (matchedTerms.size === 0) {
    return { score: 0, matchedKeywords: [] };
  }

  const singleTermQuery = normalizedSearchTerms.length === 1;
  const coverageWeight = singleTermQuery ? 35 : 70;
  const strengthWeight = singleTermQuery ? 45 : 20;
  const keywordWeight = singleTermQuery ? 20 : 10;

  const coverage = matchedTerms.size / Math.max(1, normalizedSearchTerms.length);
  const coverageScore = coverage * coverageWeight;
  const averageStrength = termStrength / matchedTerms.size;
  const strengthScore = Math.min(strengthWeight, (averageStrength / 34) * strengthWeight);
  const keywordBonus = Math.min(keywordWeight, matchedKeywords.size * (singleTermQuery ? 5 : 3));
  let confidence = Math.round(clampScore(coverageScore + strengthScore + keywordBonus));
  const avgRarity = matchedTermRarity / matchedTerms.size;

  const singleTerm = singleTermQuery ? normalizedSearchTerms[0] : "";
  if (singleTerm && SHORT_TECH_TERMS.has(singleTerm)) {
    const hasTitleSignal = containsWholeWord(normalizedTitle, singleTerm);
    const hasKeywordSignal = normalizedKeywords.some((keyword) => keyword === singleTerm);
    if (!hasTitleSignal && !hasKeywordSignal) {
      return { score: 0, matchedKeywords: [] };
    }
  }

  if (singleTermQuery && avgRarity < 0.45) {
    confidence = Math.min(confidence, 68);
  }

  confidence = applyDomainPenalty(
    normalizedSearchTerms,
    normalizedTitle,
    normalizedContent,
    normalizedKeywords,
    confidence
  );

  return { score: confidence, matchedKeywords: Array.from(matchedKeywords).slice(0, 8) };
}

/**
 * Generate AI justification for why this result matches
 */
function generateAIJustification(
  type: string,
  matchedKeywords: string[],
  confidence: number,
  data: FacultyMember | Paper | Patent | Project
): string {
  if (type === "faculty" && "name" in data) {
    const interests = data.researchInterests?.slice(0, 2).join(" and ") || "their research area";
    return `Matched profile signals in ${interests}. Keyword evidence: ${matchedKeywords.slice(0, 2).join(", ") || "content match"}.`;
  }

  if (type === "paper" && "abstract" in data) {
    const evidence = matchedKeywords.slice(0, 2).join(", ");
    if (confidence >= 80) {
      return `Strong relevance signal from title/abstract alignment${evidence ? ` and keywords (${evidence})` : ""}.`;
    }
    return `Potential relevance based on partial title/abstract alignment${evidence ? ` and keywords (${evidence})` : ""}.`;
  }

  if (type === "patent" && "patentNumber" in data) {
    return `Keyword overlap suggests this patent may be related${matchedKeywords.length ? ` (${matchedKeywords.slice(0, 2).join(", ")})` : ""}.`;
  }

  if (type === "project" && "status" in data) {
    return `This ${data.status.toLowerCase()} project shows relevance via matched terms${matchedKeywords.length ? ` (${matchedKeywords.slice(0, 2).join(", ")})` : ""}.`;
  }

  return `This result matches your query based on indexed content signals.`;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Main search function - searches through backend-loaded public dataset
 */
export async function performSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  const searchTerms = parseSearchTerms(query);
  if (searchTerms.length === 0) {
    return [];
  }
  const results: SearchResult[] = [];

  // Search faculty
  dataset.facultyData.forEach((faculty) => {
    const titleText = `${faculty.name} ${faculty.title} ${faculty.department}`;
    const contentText = `${faculty.name} ${faculty.title} ${faculty.department} ${faculty.bio} ${faculty.researchInterests.join(" ")}`;
    const { score, matchedKeywords } = calculateConfidence(
      searchTerms,
      faculty.aiKeywords,
      titleText,
      contentText
    );

    if (score >= MIN_KEYWORD_RESULT_SCORE) {
      results.push({
        type: "faculty",
        data: faculty,
        confidence: score,
        aiJustification: generateAIJustification("faculty", matchedKeywords, score, faculty),
        matchedKeywords,
      });
    }
  });

  // Search papers
  dataset.papersData.forEach((paper) => {
    const titleText = `${paper.title}`;
    const contentText = `${paper.title} ${paper.abstract} ${paper.authors.join(" ")}`;
    const { score, matchedKeywords } = calculateConfidence(
      searchTerms,
      paper.aiKeywords,
      titleText,
      contentText
    );

    if (score >= MIN_KEYWORD_RESULT_SCORE) {
      results.push({
        type: "paper",
        data: paper,
        confidence: score,
        aiJustification: generateAIJustification("paper", matchedKeywords, score, paper),
        matchedKeywords,
      });
    }
  });

  // Search patents
  dataset.patentsData.forEach((patent) => {
    const titleText = `${patent.title}`;
    const contentText = `${patent.title} ${patent.description} ${patent.inventors.join(" ")}`;
    const { score, matchedKeywords } = calculateConfidence(
      searchTerms,
      patent.aiKeywords,
      titleText,
      contentText
    );

    if (score >= MIN_KEYWORD_RESULT_SCORE) {
      results.push({
        type: "patent",
        data: patent,
        confidence: score,
        aiJustification: generateAIJustification("patent", matchedKeywords, score, patent),
        matchedKeywords,
      });
    }
  });

  // Search projects
  dataset.projectsData.forEach((project) => {
    const titleText = `${project.title}`;
    const contentText = `${project.title} ${project.description} ${project.leadFaculty.join(" ")}`;
    const { score, matchedKeywords } = calculateConfidence(
      searchTerms,
      project.aiKeywords,
      titleText,
      contentText
    );

    if (score >= MIN_KEYWORD_RESULT_SCORE) {
      results.push({
        type: "project",
        data: project,
        confidence: score,
        aiJustification: generateAIJustification("project", matchedKeywords, score, project),
        matchedKeywords,
      });
    }
  });

  // Blend semantic paper search results with keyword results.
  try {
    const semanticPapers = await fetchSemanticPaperResults(query, 25);
    const paperResultById = new Map<string, SearchResult>();
    results.forEach((result) => {
      if (result.type === "paper" && "id" in result.data) {
        paperResultById.set(result.data.id, result);
      }
    });

    semanticPapers.forEach((paper) => {
      const semanticScore = clampScore(Number(paper.semanticScore || 0));
      if (semanticScore <= 0) return;

      const existing = paperResultById.get(paper.id);
      const semanticMatchedKeywords = (paper.aiKeywords || []).filter((keyword) => {
        const loweredKeyword = keyword.toLowerCase();
        return searchTerms.some((term) => {
          if (term.length < 3) {
            return containsWholeWord(loweredKeyword, term);
          }
          return loweredKeyword.includes(term);
        });
      });

      if (existing) {
        existing.confidence = Math.round(
          clampScore(existing.confidence * 0.35 + semanticScore * 0.65)
        );
        existing.aiJustification = `${existing.aiJustification} Semantic similarity score: ${semanticScore.toFixed(
          1
        )}.`;
        existing.matchedKeywords = Array.from(
          new Set([...existing.matchedKeywords, ...semanticMatchedKeywords])
        ).slice(0, 8);
      } else if (semanticScore >= 55) {
        results.push({
          type: "paper",
          data: paper,
          confidence: Math.round(semanticScore),
          aiJustification: `This paper is semantically similar to your query (score ${semanticScore.toFixed(
            1
          )}).`,
          matchedKeywords: semanticMatchedKeywords.slice(0, 8),
        });
      }
    });
  } catch {
    // Semantic endpoint failures should not block keyword search.
  }

  // Sort by confidence score and keep top ranked results for quality/performance.
  return results.sort((a, b) => b.confidence - a.confidence).slice(0, 250);
}
