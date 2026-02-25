export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  photo: string;
  bio: string;
  researchInterests: string[];
  aiKeywords: string[];
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  link: string;
  aiKeywords: string[];
}

export interface Patent {
  id: string;
  title: string;
  inventors: string[];
  patentNumber: string;
  year: number;
  description: string;
  link: string;
  aiKeywords: string[];
}

export interface Project {
  id: string;
  title: string;
  leadFaculty: string[];
  status: string;
  description: string;
  startDate: string;
  endDate?: string;
  aiKeywords: string[];
}

export interface SearchResult {
  type: "faculty" | "paper" | "patent" | "project";
  data: FacultyMember | Paper | Patent | Project;
  confidence: number;
  aiJustification: string;
  matchedKeywords: string[];
}
