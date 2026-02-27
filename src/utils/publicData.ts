import type { FacultyMember, Paper, Patent, Project } from "../data/searchData";

const envApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
const API_BASE_URL = (
  envApiBaseUrl || (import.meta.env.DEV ? "http://localhost:8000/api" : "")
).replace(/\/+$/, "");

export interface PublicDataset {
  facultyData: FacultyMember[];
  papersData: Paper[];
  patentsData: Patent[];
  projectsData: Project[];
}

export async function fetchPublicDataset(): Promise<PublicDataset> {
  if (!API_BASE_URL) {
    throw new Error("Missing VITE_API_BASE_URL in production environment.");
  }

  const response = await fetch(`${API_BASE_URL}/public/search-data/`);
  if (!response.ok) {
    throw new Error(`Failed to load public data: HTTP ${response.status}`);
  }

  const data = await response.json();
  return {
    facultyData: Array.isArray(data?.facultyData) ? data.facultyData : [],
    papersData: Array.isArray(data?.papersData) ? data.papersData : [],
    patentsData: Array.isArray(data?.patentsData) ? data.patentsData : [],
    projectsData: Array.isArray(data?.projectsData) ? data.projectsData : [],
  };
}
