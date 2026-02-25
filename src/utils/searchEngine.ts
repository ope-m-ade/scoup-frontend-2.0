import {
  type FacultyMember,
  type Paper,
  type Patent,
  type Project,
  type SearchResult,
} from "../data/searchData";
import type { PublicDataset } from "./publicData";

let dataset: PublicDataset = {
  facultyData: [],
  papersData: [],
  patentsData: [],
  projectsData: [],
};

export function setSearchDataset(nextDataset?: Partial<PublicDataset>) {
  dataset = {
    facultyData: nextDataset?.facultyData ?? [],
    papersData: nextDataset?.papersData ?? [],
    patentsData: nextDataset?.patentsData ?? [],
    projectsData: nextDataset?.projectsData ?? [],
  };
}

/**
 * Calculate confidence score based on keyword matches
 */
function calculateConfidence(
  searchTerms: string[],
  aiKeywords: string[],
  contentText: string
): { score: number; matchedKeywords: string[] } {
  const normalizedSearchTerms = searchTerms.map((term) => term.toLowerCase());
  const normalizedKeywords = aiKeywords.map((kw) => kw.toLowerCase());
  const normalizedContent = contentText.toLowerCase();

  let matchScore = 0;
  const matchedKeywords: string[] = [];

  // Check for exact keyword matches (highest weight)
  normalizedSearchTerms.forEach((term) => {
    normalizedKeywords.forEach((keyword) => {
      if (keyword.includes(term) || term.includes(keyword)) {
        matchScore += 30;
        if (!matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
    });
  });

  // Check for partial matches in content
  normalizedSearchTerms.forEach((term) => {
    if (normalizedContent.includes(term)) {
      matchScore += 15;
    }
  });

  // Normalize score to 0-100 range
  const confidence = Math.min(100, matchScore);

  return { score: confidence, matchedKeywords };
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
    return `This faculty member's expertise in ${interests} strongly aligns with your search. Matched ${matchedKeywords.length} relevant keywords including ${matchedKeywords.slice(0, 2).join(", ")}.`;
  }

  if (type === "paper" && "abstract" in data) {
    return `This research paper directly addresses your query with ${matchedKeywords.length} keyword matches. The study focuses on ${matchedKeywords.slice(0, 2).join(" and ")}, making it highly relevant to your search.`;
  }

  if (type === "patent" && "patentNumber" in data) {
    return `This patent innovation relates to ${matchedKeywords.slice(0, 2).join(" and ")}. The technology described shows strong alignment with your search criteria across ${matchedKeywords.length} keywords.`;
  }

  if (type === "project" && "status" in data) {
    return `This ${data.status.toLowerCase()} project focuses on ${matchedKeywords.slice(0, 2).join(" and ")}, matching ${matchedKeywords.length} of your search terms. The project objectives align well with your query.`;
  }

  return `This result matches ${matchedKeywords.length} keywords from your search query.`;
}

/**
 * Main search function - searches through backend-loaded public dataset
 */
export async function performSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  const searchTerms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 2);
  const results: SearchResult[] = [];

  // Search faculty
  dataset.facultyData.forEach((faculty) => {
    const contentText = `${faculty.name} ${faculty.title} ${faculty.department} ${faculty.bio} ${faculty.researchInterests.join(" ")}`;
    const { score, matchedKeywords } = calculateConfidence(
      searchTerms,
      faculty.aiKeywords,
      contentText
    );

    if (score > 0) {
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
    const contentText = `${paper.title} ${paper.abstract} ${paper.authors.join(" ")}`;
    const { score, matchedKeywords } = calculateConfidence(
      searchTerms,
      paper.aiKeywords,
      contentText
    );

    if (score > 0) {
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
    const contentText = `${patent.title} ${patent.description} ${patent.inventors.join(" ")}`;
    const { score, matchedKeywords } = calculateConfidence(
      searchTerms,
      patent.aiKeywords,
      contentText
    );

    if (score > 0) {
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
    const contentText = `${project.title} ${project.description} ${project.leadFaculty.join(" ")}`;
    const { score, matchedKeywords } = calculateConfidence(
      searchTerms,
      project.aiKeywords,
      contentText
    );

    if (score > 0) {
      results.push({
        type: "project",
        data: project,
        confidence: score,
        aiJustification: generateAIJustification("project", matchedKeywords, score, project),
        matchedKeywords,
      });
    }
  });

  // Sort by confidence score (highest first)
  return results.sort((a, b) => b.confidence - a.confidence);
}
