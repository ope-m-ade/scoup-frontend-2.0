import type { FacultyMember, Paper, Patent, Project } from "../data/searchData";

type UnknownRecord = Record<string, unknown>;

const SALISBURY_UNIVERSITY_RE = /\bsalisbury university\b/i;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_RE = /\+?\d[\d(). -]{6,}\d/g;
const NOISY_CATEGORY_RE = /\b(?:nec|general|other)\b/i;
const GENERIC_KEYWORDS = new Set([
  "education",
  "health sciences",
  "humanities",
  "psychology",
  "science",
  "social sciences",
  "salisbury university",
]);

const DEPARTMENT_ALIAS_RULES: Array<[RegExp, string]> = [
  [/^psychology department$/i, "Department of Psychology"],
  [/^social work department$/i, "Department of Social Work"],
  [/^department of social work$/i, "Department of Social Work"],
  [/^biology$/i, "Department of Biological Sciences"],
  [/^exercise science$/i, "Department of Exercise Science"],
  [/^exercise physiology research lab$/i, "Department of Exercise Science"],
  [/^department of biology$/i, "Department of Biological Sciences"],
  [/^biological sciences$/i, "Department of Biological Sciences"],
  [/^chemistry$/i, "Department of Chemistry"],
  [/^communication$/i, "Department of Communication"],
  [/^computer science$/i, "Department of Computer Science"],
  [/^conflict analysis and dispute resolution$/i, "Department of Conflict Analysis and Dispute Resolution"],
  [/^department of geography\s*&\s*geosciences$/i, "Department of Geography and Geosciences"],
  [/^geography\s*(?:&|and)\s*geosciences$/i, "Department of Geography and Geosciences"],
  [/^management$/i, "Department of Management"],
  [/^management and marketing$/i, "Department of Management and Marketing"],
  [/^department of math and computer science$/i, "Department of Mathematics and Computer Science"],
  [/^department of health and sport sciences$/i, "Department of Health and Sport Sciences"],
];

const SCHOOL_ALIAS_RULES: Array<[RegExp, string]> = [
  [/^college of health and human services$/i, "College of Health and Human Services"],
  [/^school of health sciences?$/i, "College of Health and Human Services"],
  [/^school of nursing\b.*$/i, "College of Health and Human Services"],
  [/^school of social work$/i, "College of Health and Human Services"],
  [/^fulton school of liberal arts$/i, "Fulton School of Liberal Arts"],
  [/^school of liberal arts\b.*$/i, "Fulton School of Liberal Arts"],
  [/^henson school of science\s*(?:&|and)\s*technology$/i, "Henson School of Science & Technology"],
  [/^school of science\s*(?:&|and)\s*technology$/i, "Henson School of Science & Technology"],
  [/^school of technology$/i, "Henson School of Science & Technology"],
  [/^perdue school of business$/i, "Perdue School of Business"],
  [/^franklin p\.?\s*perdue school of business$/i, "Perdue School of Business"],
  [/^school of business\b.*$/i, "Perdue School of Business"],
  [/^seidel school of education$/i, "Seidel School of Education"],
  [/^school of education\b.*$/i, "Seidel School of Education"],
  [/^school of education and professional studies$/i, "Seidel School of Education"],
  [/^clarke honors college\b.*$/i, "Clarke Honors College"],
];

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function cleanString(value: unknown): string {
  return String(value ?? "")
    .replace(/\r/g, " ")
    .replace(EMAIL_RE, " ")
    .replace(PHONE_RE, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(cleanString).filter(Boolean);
  }
  const cleaned = cleanString(value);
  return cleaned ? [cleaned] : [];
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];

  values.forEach((value) => {
    const normalized = value.toLowerCase();
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    unique.push(value);
  });

  return unique;
}

function firstNonEmptyString(...values: unknown[]): string {
  for (const value of values) {
    const cleaned = cleanString(value);
    if (cleaned) return cleaned;
  }
  return "";
}

function normalizeDepartmentLabel(raw: string): string {
  let value = cleanString(raw)
    .replace(/&amp;/gi, "and")
    .replace(/^\d+\s*/g, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/\(.*$/g, " ")
    .replace(/[.;:,]+$/g, "")
    .replace(/\bsalisbury university\b/gi, " ")
    .replace(/\b(?:salisbury|maryland|md|usa|united states)\b/gi, " ")
    .replace(/\bHenson Science Hall\b.*$/i, " ")
    .replace(/\bat\b.*$/i, " ")
    .replace(/\b\d{4,}\b.*$/g, " ")
    .replace(/\bSalisbury Maryland\b/i, "")
    .replace(/\bSalisbury MD\b/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!value || /^[A-Za-z]$/.test(value)) return "";

  for (const [pattern, replacement] of DEPARTMENT_ALIAS_RULES) {
    if (pattern.test(value)) return replacement;
  }

  if (/^[A-Za-z&/ -]+ Department$/i.test(value)) {
    value = `Department of ${value.replace(/\s+Department$/i, "").trim()}`;
  }

  return value;
}

function isValidDepartmentLabel(value: string): boolean {
  return /\b(department|program)\b/i.test(value) && !isSchoolLabel(value);
}

function isSchoolLabel(value: string): boolean {
  return /\b(school|college)\b/i.test(value);
}

function normalizeSchoolLabel(raw: string): string {
  const value = normalizeDepartmentLabel(raw);
  if (!value) return "";

  for (const [pattern, replacement] of SCHOOL_ALIAS_RULES) {
    if (pattern.test(value)) return replacement;
  }

  return isSchoolLabel(value) ? value : "";
}

function cleanAffiliation(value: string): string {
  return cleanString(value)
    .replace(/\bSponsor:.*$/i, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDepartmentFromAffiliation(affiliation: string): string {
  const cleaned = cleanAffiliation(affiliation);
  if (!cleaned || !SALISBURY_UNIVERSITY_RE.test(cleaned)) return "";

  const exactPatterns = [
    /Department of [^,;.]+/i,
    /School of [^,;.]+/i,
    /College of [^,;.]+/i,
    /Program in [^,;.]+/i,
    /Program of [^,;.]+/i,
    /[^,;.]+ Department/i,
  ];

  for (const pattern of exactPatterns) {
    const match = cleaned.match(pattern);
    if (match) {
      const candidate = normalizeDepartmentLabel(match[0]);
      return isValidDepartmentLabel(candidate) ? candidate : "";
    }
  }

  const beforeUniversity = cleaned.split(/salisbury university/i)[0]?.replace(/[,-]+$/g, "").trim() ?? "";
  if (!beforeUniversity) return "";

  const segments = beforeUniversity
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  for (let i = segments.length - 1; i >= 0; i -= 1) {
    const candidate = normalizeDepartmentLabel(segments[i]);
    if (!candidate) continue;
    if (isValidDepartmentLabel(candidate)) return candidate;
  }

  const fallback = normalizeDepartmentLabel(beforeUniversity);
  if (!fallback) return "";
  if (
    isValidDepartmentLabel(fallback) &&
    /^[A-Za-z&/ -]+$/.test(fallback) &&
    fallback.split(" ").length <= 8
  ) {
    return fallback;
  }
  return "";
}

function extractDepartmentsFromAffiliations(value: unknown): string[] {
  return uniqueStrings(
    toStringArray(value)
      .map(extractDepartmentFromAffiliation)
      .filter(Boolean),
  );
}

function extractSchoolFromAffiliation(affiliation: string): string {
  const cleaned = cleanAffiliation(affiliation);
  if (!cleaned || !SALISBURY_UNIVERSITY_RE.test(cleaned)) return "";

  const patterns = [/School of [^,;.]+/i, /College of [^,;.]+/i];
  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      return normalizeSchoolLabel(match[0]);
    }
  }

  const beforeUniversity = cleaned.split(/salisbury university/i)[0]?.replace(/[,-]+$/g, "").trim() ?? "";
  return normalizeSchoolLabel(beforeUniversity);
}

function extractSchoolsFromAffiliations(value: unknown): string[] {
  return uniqueStrings(
    toStringArray(value)
      .map(extractSchoolFromAffiliation)
      .filter(Boolean),
  );
}

function extractDepartmentsFromFacultyAffiliations(value: unknown): string[] {
  const record = asRecord(value);
  const departments = Object.values(record).flatMap((entry) => extractDepartmentsFromAffiliations(entry));
  return uniqueStrings(departments);
}

function extractSchoolsFromFacultyAffiliations(value: unknown): string[] {
  const record = asRecord(value);
  const schools = Object.values(record).flatMap((entry) => extractSchoolsFromAffiliations(entry));
  return uniqueStrings(schools);
}

function getRawDepartments(record: UnknownRecord): string[] {
  const directDepartment = normalizeDepartmentLabel(firstNonEmptyString(record.department, record.faculty_department));
  const affiliations = extractDepartmentsFromAffiliations(record.departmentAffiliations ?? record.department_affiliations);
  const facultyAffiliations = extractDepartmentsFromFacultyAffiliations(record.facultyAffiliations ?? record.faculty_affiliations);
  return uniqueStrings([
    isValidDepartmentLabel(directDepartment) ? directDepartment : "",
    ...affiliations,
    ...facultyAffiliations,
  ].filter(Boolean));
}

function getRawSchools(record: UnknownRecord): string[] {
  const directSchool = normalizeDepartmentLabel(firstNonEmptyString(record.department, record.faculty_department));
  const affiliations = extractSchoolsFromAffiliations(record.schoolAffiliations ?? record.school_affiliations ?? record.departmentAffiliations ?? record.department_affiliations);
  const facultyAffiliations = extractSchoolsFromFacultyAffiliations(record.facultyAffiliations ?? record.faculty_affiliations);
  return uniqueStrings([
    isSchoolLabel(directSchool) ? directSchool : "",
    ...affiliations,
    ...facultyAffiliations,
  ].filter(Boolean));
}

function normalizeCategoryList(values: unknown): string[] {
  return uniqueStrings(
    toStringArray(values).filter((value) => value.length >= 4 && !NOISY_CATEGORY_RE.test(value)),
  );
}

function normalizeKeywordList(values: unknown): string[] {
  return uniqueStrings(
    toStringArray(values).filter((value) => {
      const normalized = value.toLowerCase();
      return value.length >= 3 && !GENERIC_KEYWORDS.has(normalized) && !NOISY_CATEGORY_RE.test(value);
    }),
  );
}

function buildRelevantKeywords(...sources: unknown[]): string[] {
  const keywords = uniqueStrings(
    sources.flatMap((source) => normalizeKeywordList(source)),
  );
  return keywords.slice(0, 12);
}

function normalizeFacultyAffiliationMap(value: unknown): Record<string, string[]> | undefined {
  const record = asRecord(value);
  const entries = Object.entries(record)
    .map(([name, affiliations]) => {
      const departments = extractDepartmentsFromAffiliations(affiliations);
      return [cleanString(name), departments] as const;
    })
    .filter(([name, departments]) => name && departments.length > 0);

  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries);
}

function normalizeFacultySchoolAffiliationMap(value: unknown): Record<string, string[]> | undefined {
  const record = asRecord(value);
  const entries = Object.entries(record)
    .map(([name, affiliations]) => {
      const schools = extractSchoolsFromAffiliations(affiliations);
      return [cleanString(name), schools] as const;
    })
    .filter(([name, schools]) => name && schools.length > 0);

  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries);
}

function normalizeMetricsProfile(record: UnknownRecord) {
  const totalCitations = Number(record.totalCitations ?? record.total_citations ?? record.tc_count ?? 0) || 0;
  const articleCount = Number(record.articleCount ?? record.article_count ?? 0) || 0;
  const averageCitations = Number(record.averageCitations ?? record.average_citations ?? 0) || 0;

  if (!totalCitations && !articleCount && !averageCitations) return undefined;

  return {
    totalCitations,
    articleCount,
    averageCitations,
  };
}

function normalizePaperLink(record: UnknownRecord): string {
  const doi = firstNonEmptyString(record.doi);
  if (doi) return `https://doi.org/${doi}`;

  const link = firstNonEmptyString(record.link, record.url, record.download_url, record.license_url);
  if (!link) return "";
  if (/^https?:\/\//i.test(link)) return link;
  return `https://${link}`;
}

export function getDepartmentAffiliations(recordLike: unknown): string[] {
  return getRawDepartments(asRecord(recordLike));
}

export function getSchoolAffiliations(recordLike: unknown): string[] {
  return getRawSchools(asRecord(recordLike));
}

function normalizePersonName(value: unknown): string {
  return cleanString(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildFacultyDepartmentLookup(papersData: unknown[]): Map<string, string[]> {
  const lookup = new Map<string, string[]>();

  papersData.forEach((paperLike) => {
    const paper = asRecord(paperLike);
    const affiliations = normalizeFacultyAffiliationMap(
      paper.facultyAffiliations ?? paper.faculty_affiliations,
    );

    if (!affiliations) return;

    Object.entries(affiliations).forEach(([name, departments]) => {
      const normalizedName = normalizePersonName(name);
      if (!normalizedName || departments.length === 0) return;

      lookup.set(
        normalizedName,
        uniqueStrings([...(lookup.get(normalizedName) ?? []), ...departments]),
      );
    });
  });

  return lookup;
}

function buildFacultySchoolLookup(papersData: unknown[]): Map<string, string[]> {
  const lookup = new Map<string, string[]>();

  papersData.forEach((paperLike) => {
    const paper = asRecord(paperLike);
    const affiliations = normalizeFacultySchoolAffiliationMap(
      paper.facultyAffiliations ?? paper.faculty_affiliations,
    );

    if (!affiliations) return;

    Object.entries(affiliations).forEach(([name, schools]) => {
      const normalizedName = normalizePersonName(name);
      if (!normalizedName || schools.length === 0) return;

      lookup.set(
        normalizedName,
        uniqueStrings([...(lookup.get(normalizedName) ?? []), ...schools]),
      );
    });
  });

  return lookup;
}

export function getPrimaryDepartment(recordLike: unknown): string {
  const record = asRecord(recordLike);
  const normalizedDirect = normalizeDepartmentLabel(firstNonEmptyString(record.department, record.faculty_department));
  return getRawDepartments(record)[0] || (isValidDepartmentLabel(normalizedDirect) ? normalizedDirect : "") || "Unassigned";
}

export function isLikelyExternalFaculty(recordLike: unknown): boolean {
  const record = asRecord(recordLike);
  const rawAffiliations = toStringArray(record.departmentAffiliations ?? record.department_affiliations);
  if (rawAffiliations.length === 0) return false;
  return !rawAffiliations.some((affiliation) => SALISBURY_UNIVERSITY_RE.test(affiliation));
}

export function normalizeFacultyRecord(recordLike: unknown): FacultyMember {
  const record = asRecord(recordLike);
  const departmentAffiliations = getRawDepartments(record);
  const schoolAffiliations = getRawSchools(record);
  const name = firstNonEmptyString(
    [record.first_name, record.last_name].map(cleanString).filter(Boolean).join(" "),
    record.name,
    record.full_name,
    record.username,
    "Unnamed Faculty",
  );
  const researchInterests = buildRelevantKeywords(record.researchInterests, record.research_interests, record.themes);
  const aiKeywords = buildRelevantKeywords(
    record.aiKeywords,
    record.ai_keywords,
    record.themes,
  );

  return {
    id: firstNonEmptyString(record.id, record._id, record.pk, name),
    name,
    title: firstNonEmptyString(record.title),
    department: departmentAffiliations[0] || "Unassigned",
    departmentAffiliations,
    schoolAffiliations,
    email: firstNonEmptyString(record.email),
    phone: firstNonEmptyString(record.phone),
    photo: firstNonEmptyString(record.photo, record.profile_photo),
    bio: firstNonEmptyString(record.bio, record.description, record.abstract),
    researchInterests,
    aiKeywords,
    metricsProfile: normalizeMetricsProfile(record),
    themes: normalizeKeywordList(record.themes),
    journals: normalizeKeywordList(record.journals),
    sourceProfile: record,
  };
}

export function normalizePaperRecord(recordLike: unknown): Paper {
  const record = asRecord(recordLike);
  const facultyAffiliations = normalizeFacultyAffiliationMap(record.facultyAffiliations ?? record.faculty_affiliations);
  const facultySchoolAffiliations = normalizeFacultySchoolAffiliationMap(record.facultyAffiliations ?? record.faculty_affiliations);
  const departmentAffiliations = uniqueStrings(
    getRawDepartments(record).concat(facultyAffiliations ? Object.values(facultyAffiliations).flat() : []),
  );
  const schoolAffiliations = uniqueStrings(
    getRawSchools(record).concat(facultySchoolAffiliations ? Object.values(facultySchoolAffiliations).flat() : []),
  );
  const title = firstNonEmptyString(
    Array.isArray(record.title) ? record.title[0] : record.title,
    "Untitled Paper",
  );

  return {
    id: firstNonEmptyString(record.id, record._id, record.pk, title),
    title,
    doi: firstNonEmptyString(record.doi),
    journal: firstNonEmptyString(record.journal),
    authors: uniqueStrings(toStringArray(record.authors ?? record.faculty_members)),
    year: Number(record.year ?? String(firstNonEmptyString(record.date_published_print, record.date_published_online)).slice(0, 4) ?? 0) || 0,
    abstract: firstNonEmptyString(record.abstract),
    link: normalizePaperLink(record),
    aiKeywords: buildRelevantKeywords(
      record.aiKeywords,
      record.ai_keywords,
      record.themes,
    ),
    citations: Number(record.citations ?? record.tc_count ?? 0) || undefined,
    publishedOnline: firstNonEmptyString(record.publishedOnline, record.date_published_online),
    publishedPrint: firstNonEmptyString(record.publishedPrint, record.date_published_print),
    facultyMembers: uniqueStrings(toStringArray(record.facultyMembers ?? record.faculty_members)),
    facultyAffiliations,
    departmentAffiliations,
    schoolAffiliations,
    engagementMetrics: Number(record.tc_count ?? 0) ? { citations: Number(record.tc_count) } : undefined,
  };
}

export function normalizePatentRecord(recordLike: unknown): Patent {
  const record = asRecord(recordLike);
  const title = firstNonEmptyString(record.title, "Untitled Patent");

  return {
    id: firstNonEmptyString(record.id, record._id, record.pk, title),
    title,
    inventors: uniqueStrings(toStringArray(record.inventors ?? record.authors ?? record.faculty_members)),
    patentNumber: firstNonEmptyString(record.patentNumber, record.patent_number),
    year: Number(record.year) || 0,
    description: firstNonEmptyString(record.description, record.abstract),
    link: firstNonEmptyString(record.link, record.url),
    aiKeywords: buildRelevantKeywords(record.aiKeywords, record.ai_keywords, record.themes),
    departmentAffiliations: getRawDepartments(record),
    schoolAffiliations: getRawSchools(record),
  };
}

export function normalizeProjectRecord(recordLike: unknown): Project {
  const record = asRecord(recordLike);
  const title = firstNonEmptyString(record.title, "Untitled Project");

  return {
    id: firstNonEmptyString(record.id, record._id, record.pk, title),
    title,
    leadFaculty: uniqueStrings(toStringArray(record.leadFaculty ?? record.lead_faculty ?? record.faculty_members)),
    status: firstNonEmptyString(record.status, "Unknown"),
    description: firstNonEmptyString(record.description, record.abstract),
    startDate: firstNonEmptyString(record.startDate, record.start_date),
    endDate: firstNonEmptyString(record.endDate, record.end_date) || undefined,
    aiKeywords: buildRelevantKeywords(record.aiKeywords, record.ai_keywords, record.themes),
    departmentAffiliations: getRawDepartments(record),
    schoolAffiliations: getRawSchools(record),
  };
}

export function normalizePublicDataset(data: {
  facultyData?: unknown[];
  papersData?: unknown[];
  patentsData?: unknown[];
  projectsData?: unknown[];
}) {
  const facultyData = Array.isArray(data.facultyData) ? data.facultyData : [];
  const papersData = Array.isArray(data.papersData) ? data.papersData : [];
  const patentsData = Array.isArray(data.patentsData) ? data.patentsData : [];
  const projectsData = Array.isArray(data.projectsData) ? data.projectsData : [];
  const departmentLookup = buildFacultyDepartmentLookup(papersData);
  const schoolLookup = buildFacultySchoolLookup(papersData);

  return {
    facultyData: facultyData
      .map((recordLike) => {
        const faculty = normalizeFacultyRecord(recordLike);
        const inferredDepartments = departmentLookup.get(normalizePersonName(faculty.name)) ?? [];
        const inferredSchools = schoolLookup.get(normalizePersonName(faculty.name)) ?? [];
        const departmentAffiliations = uniqueStrings([
          ...(faculty.departmentAffiliations ?? []),
          ...inferredDepartments,
        ]);
        const schoolAffiliations = uniqueStrings([
          ...(faculty.schoolAffiliations ?? []),
          ...inferredSchools,
        ]);

        return {
          ...faculty,
          department: departmentAffiliations[0] || faculty.department,
          departmentAffiliations,
          schoolAffiliations,
        };
      })
      .filter(
        (faculty) =>
          faculty.departmentAffiliations.length > 0 ||
          (faculty.schoolAffiliations ?? []).length > 0,
      ),
    papersData: papersData.map(normalizePaperRecord),
    patentsData: patentsData.map(normalizePatentRecord),
    projectsData: projectsData.map(normalizeProjectRecord),
  };
}
