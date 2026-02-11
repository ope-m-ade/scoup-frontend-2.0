// Mock data for SCOUP platform - ready for Postgres integration

export interface Faculty {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
  phone?: string;
  officeLocation?: string;
  bio?: string;
  researchInterests?: string;
  personalWebsite?: string;
  profilePhoto?: string;
  qualifications?: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
  }>;
  keywords?: string[];
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  doi?: string;
  citations?: number;
  abstract?: string;
}

export interface Patent {
  id: string;
  title: string;
  patentNumber: string;
  filingDate: string;
  grantDate?: string;
  inventors: string[];
  abstract?: string;
  status: 'pending' | 'granted' | 'expired';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'pending';
  fundingAmount?: number;
  fundingSource?: string;
  collaborators?: string[];
}

// Mock faculty data
export const mockFaculty: Faculty[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sjohnson@salisbury.edu",
    department: "Computer Science",
    title: "Professor",
    phone: "(410) 543-6000",
    officeLocation: "Henson Science Hall 301",
    bio: "Dr. Sarah Johnson is a Professor in the Computer Science department at Salisbury University. With a Ph.D. from MIT, she brings extensive expertise in artificial intelligence and machine learning.",
    researchInterests: "Artificial Intelligence, Machine Learning, Natural Language Processing, Data Science",
    personalWebsite: "https://example.com/sjohnson",
    qualifications: [
      { id: "1", degree: "Ph.D. in Computer Science", institution: "MIT", year: "2010" },
      { id: "2", degree: "M.S. in Computer Science", institution: "Stanford University", year: "2005" }
    ],
    keywords: ["AI", "Machine Learning", "NLP", "Data Science"]
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "mchen@salisbury.edu",
    department: "Business Administration",
    title: "Associate Professor",
    phone: "(410) 543-6100",
    officeLocation: "Perdue Hall 201",
    bio: "Dr. Michael Chen specializes in strategic management and entrepreneurship, with a focus on innovation in small businesses.",
    researchInterests: "Strategic Management, Entrepreneurship, Innovation, Business Analytics",
    qualifications: [
      { id: "1", degree: "Ph.D. in Business Administration", institution: "Harvard Business School", year: "2012" }
    ],
    keywords: ["Strategy", "Entrepreneurship", "Innovation", "Analytics"]
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "erodriguez@salisbury.edu",
    department: "Biology",
    title: "Assistant Professor",
    phone: "(410) 543-6200",
    officeLocation: "Henson Science Hall 205",
    bio: "Dr. Emily Rodriguez focuses on marine biology and environmental science, studying coastal ecosystems.",
    researchInterests: "Marine Biology, Ecology, Environmental Science, Conservation",
    qualifications: [
      { id: "1", degree: "Ph.D. in Marine Biology", institution: "University of Maryland", year: "2015" }
    ],
    keywords: ["Marine Biology", "Ecology", "Conservation", "Coastal Ecosystems"]
  }
];

// Mock papers data
export const mockPapers: Paper[] = [
  {
    id: "1",
    title: "Deep Learning Approaches to Natural Language Understanding",
    authors: ["Sarah Johnson", "John Smith"],
    year: 2023,
    journal: "Journal of Artificial Intelligence Research",
    doi: "10.1613/jair.1.12345",
    citations: 45,
    abstract: "This paper explores novel deep learning architectures for improving natural language understanding tasks."
  },
  {
    id: "2",
    title: "Entrepreneurial Innovation in Digital Transformation",
    authors: ["Michael Chen", "Lisa Wong"],
    year: 2022,
    journal: "Strategic Management Journal",
    doi: "10.1002/smj.3456",
    citations: 32,
    abstract: "An examination of how entrepreneurial firms navigate digital transformation challenges."
  },
  {
    id: "3",
    title: "Climate Change Impacts on Chesapeake Bay Marine Ecosystems",
    authors: ["Emily Rodriguez", "David Martinez"],
    year: 2024,
    journal: "Marine Ecology Progress Series",
    doi: "10.3354/meps14123",
    citations: 18,
    abstract: "A comprehensive study of climate change effects on Chesapeake Bay biodiversity."
  }
];

// Mock patents data
export const mockPatents: Patent[] = [
  {
    id: "1",
    title: "Machine Learning System for Predictive Analytics",
    patentNumber: "US10234567B2",
    filingDate: "2021-03-15",
    grantDate: "2023-06-20",
    inventors: ["Sarah Johnson", "Robert Lee"],
    abstract: "A novel system for predictive analytics using advanced machine learning algorithms.",
    status: "granted"
  },
  {
    id: "2",
    title: "Sustainable Business Process Optimization Framework",
    patentNumber: "US10345678B2",
    filingDate: "2022-08-10",
    inventors: ["Michael Chen"],
    abstract: "A framework for optimizing business processes with sustainability considerations.",
    status: "pending"
  }
];

// Mock projects data
export const mockProjects: Project[] = [
  {
    id: "1",
    title: "AI-Enhanced Educational Platform Development",
    description: "Developing an AI-powered platform to personalize student learning experiences.",
    startDate: "2023-09-01",
    status: "active",
    fundingAmount: 250000,
    fundingSource: "NSF",
    collaborators: ["Sarah Johnson", "Robert Lee", "Amanda White"]
  },
  {
    id: "2",
    title: "Regional Small Business Innovation Study",
    description: "Analyzing innovation patterns in regional small businesses and startups.",
    startDate: "2023-01-15",
    endDate: "2024-12-31",
    status: "active",
    fundingAmount: 150000,
    fundingSource: "Maryland Economic Development",
    collaborators: ["Michael Chen", "Lisa Wong"]
  },
  {
    id: "3",
    title: "Chesapeake Bay Ecosystem Monitoring",
    description: "Long-term monitoring project studying climate change impacts on marine life.",
    startDate: "2022-06-01",
    status: "active",
    fundingAmount: 500000,
    fundingSource: "NOAA",
    collaborators: ["Emily Rodriguez", "David Martinez", "James Wilson"]
  }
];

// Mock analytics data
export const mockPublicationsPerYear = [
  { year: 2019, publications: 45 },
  { year: 2020, publications: 52 },
  { year: 2021, publications: 68 },
  { year: 2022, publications: 73 },
  { year: 2023, publications: 85 },
  { year: 2024, publications: 92 }
];

export const mockFacultyByDepartment = [
  { department: "Computer Science", count: 24 },
  { department: "Business Administration", count: 32 },
  { department: "Biology", count: 28 },
  { department: "Education", count: 35 },
  { department: "Engineering", count: 18 },
  { department: "Psychology", count: 22 },
  { department: "English", count: 26 }
];

export const mockStats = {
  totalFaculty: 185,
  totalPublications: 1247,
  totalProjects: 89,
  totalPatents: 34
};

// Mock user credentials for demo
export const mockUsers = {
  faculty: [
    { email: "sjohnson@salisbury.edu", password: "faculty123", facultyId: "1" },
    { email: "mchen@salisbury.edu", password: "faculty123", facultyId: "2" },
    { email: "erodriguez@salisbury.edu", password: "faculty123", facultyId: "3" },
    { email: "faculty@salisbury.edu", password: "password", facultyId: "1" }
  ],
  admin: [
    { email: "admin@salisbury.edu", password: "admin123" }
  ]
};
