import {
  facultyData as fallbackFacultyData,
  papersData as fallbackPapersData,
  patentsData as fallbackPatentsData,
  projectsData as fallbackProjectsData,
  FacultyMember,
  Paper,
  Patent,
  Project,
} from "../data/searchData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export interface PublicDataset {
  facultyData: FacultyMember[];
  papersData: Paper[];
  patentsData: Patent[];
  projectsData: Project[];
}

export const fallbackDataset: PublicDataset = {
  facultyData: fallbackFacultyData,
  papersData: fallbackPapersData,
  patentsData: fallbackPatentsData,
  projectsData: fallbackProjectsData,
};

export async function fetchPublicDataset(): Promise<PublicDataset> {
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

