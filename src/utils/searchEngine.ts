import type { SearchResult } from "../data/searchData";
import { fetchUnifiedSearch, type PublicDataset } from "./publicData";
import {
  normalizeFacultyRecord,
  normalizePaperRecord,
  normalizePatentRecord,
  normalizeProjectRecord,
  getDepartmentAffiliations,
} from "./datasetNormalization";

// ---------------------------------------------------------------------------
// Suggestion system — built from analytics data already in memory
//
// Before typing:  show top papers by citation count (most visible research)
// While typing:   autocomplete across paper titles + research topics/keywords
//                 ranked by match quality (starts-with > word-boundary > contains)
// ---------------------------------------------------------------------------

interface PaperEntry {
  title: string;
  citations: number;
}

interface TopicEntry {
  text: string;
  weight: number;
}

let topPapers: PaperEntry[] = [];
let topicIndex: TopicEntry[] = [];

export function setSearchDataset(dataset?: Partial<PublicDataset>): void {
  if (!dataset) return;

  // --- Top papers by citation count (for default/cold-start suggestions) ---
  topPapers = (dataset.papersData ?? [])
    .filter((p) => p.title && p.title.trim().length > 0)
    .map((p) => ({
      title: p.title.trim(),
      citations: p.citations ?? 0,
    }))
    .sort((a, b) => b.citations - a.citations);

  // --- Topic index for autocomplete while typing ---
  const byKey = new Map<string, TopicEntry>();

  const add = (text: string, weight: number) => {
    const t = text.trim();
    if (!t || t.length < 2 || t.length > 120) return;
    const key = t.toLowerCase();
    const existing = byKey.get(key);
    if (existing) {
      existing.weight = Math.max(existing.weight, weight);
    } else {
      byKey.set(key, { text: t, weight });
    }
  };

  // Paper titles — highest weight (most specific, what users actually search for)
  (dataset.papersData ?? []).forEach((p) => {
    if (p.title) add(p.title, 50);
    p.aiKeywords?.forEach((k) => add(k, 30));
  });

  // Faculty research interests and keywords
  (dataset.facultyData ?? []).forEach((f) => {
    if (f.name) add(f.name, 35);
    f.researchInterests?.forEach((k) => add(k, 28));
    f.aiKeywords?.forEach((k) => add(k, 22));
    getDepartmentAffiliations(f).forEach((k) => add(k, 18));
  });

  // Projects and patents
  (dataset.projectsData ?? []).forEach((p) => {
    if (p.title) add(p.title, 25);
    p.aiKeywords?.forEach((k) => add(k, 18));
  });
  (dataset.patentsData ?? []).forEach((p) => {
    if (p.title) add(p.title, 22);
    p.aiKeywords?.forEach((k) => add(k, 16));
  });

  topicIndex = Array.from(byKey.values()).sort((a, b) => b.weight - a.weight);
}

export function getSearchSuggestions(query: string, limit = 8): string[] {
  const trimmed = query.trim().toLowerCase();

  // Nothing typed — show most-cited papers as discovery suggestions.
  // These give users a sense of what research is in the database.
  if (!trimmed) {
    return topPapers.slice(0, limit).map((p) => p.title);
  }

  // Typing — search across all titles and topics.
  // Tier ranking:
  //   1. Entry exactly matches query
  //   2. Entry starts with query
  //   3. A word within the entry starts with query  (e.g. "bio" → "molecular biology")
  //   4. Entry contains query anywhere
  // Within each tier, higher weight (paper titles > keywords) wins.
  const scored = topicIndex
    .filter((e) => e.text.toLowerCase().includes(trimmed))
    .map((e) => {
      const lower = e.text.toLowerCase();
      let tier = 4;
      if (lower === trimmed) tier = 1;
      else if (lower.startsWith(trimmed)) tier = 2;
      else if (lower.split(/\s+/).some((w) => w.startsWith(trimmed))) tier = 3;
      return { e, tier };
    })
    .sort((a, b) => a.tier - b.tier || b.e.weight - a.e.weight)
    .slice(0, limit);

  return scored.map((s) => s.e.text);
}

// ---------------------------------------------------------------------------
// Search — calls the backend, maps to SearchResult[]
// ---------------------------------------------------------------------------

export async function performSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    const raw = await fetchUnifiedSearch(query);
    return raw.map((item): SearchResult => {
      let data: SearchResult["data"];
      if (item.type === "faculty") {
        data = normalizeFacultyRecord(item.data);
      } else if (item.type === "paper") {
        data = normalizePaperRecord(item.data);
      } else if (item.type === "patent") {
        data = normalizePatentRecord(item.data);
      } else {
        data = normalizeProjectRecord(item.data);
      }
      return {
        type: item.type,
        data,
        confidence: item.confidence,
        aiJustification: item.aiJustification,
        matchedKeywords: item.matchedKeywords,
      };
    });
  } catch {
    return [];
  }
}
