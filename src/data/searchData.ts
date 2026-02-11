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

// Mock faculty data
export const facultyData: FacultyMember[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    title: "Professor of Computer Science",
    department: "Computer Science",
    email: "schen@salisbury.edu",
    phone: "(410) 543-6000",
    photo: "",
    bio: "Dr. Chen specializes in artificial intelligence and machine learning with a focus on natural language processing and computer vision.",
    researchInterests: ["Artificial Intelligence", "Machine Learning", "Natural Language Processing", "Computer Vision"],
    aiKeywords: ["AI", "machine learning", "NLP", "deep learning", "neural networks", "computer vision"]
  },
  {
    id: "2",
    name: "Dr. Michael Rodriguez",
    title: "Associate Professor of Environmental Science",
    department: "Environmental Science",
    email: "mrodriguez@salisbury.edu",
    phone: "(410) 543-6100",
    photo: "",
    bio: "Dr. Rodriguez conducts research on coastal ecology and climate change impacts on marine ecosystems.",
    researchInterests: ["Coastal Ecology", "Climate Change", "Marine Biology", "Environmental Policy"],
    aiKeywords: ["ecology", "climate", "marine", "coastal", "sustainability", "conservation"]
  },
  {
    id: "3",
    name: "Dr. Emily Watson",
    title: "Professor of Business Analytics",
    department: "Business Administration",
    email: "ewatson@salisbury.edu",
    phone: "(410) 543-6200",
    photo: "",
    bio: "Dr. Watson's research focuses on data analytics, business intelligence, and decision support systems.",
    researchInterests: ["Business Analytics", "Data Science", "Decision Support", "Predictive Modeling"],
    aiKeywords: ["analytics", "data science", "business intelligence", "big data", "forecasting"]
  },
  {
    id: "4",
    name: "Dr. James Thompson",
    title: "Associate Professor of Chemistry",
    department: "Chemistry",
    email: "jthompson@salisbury.edu",
    phone: "(410) 543-6300",
    photo: "",
    bio: "Dr. Thompson researches organic chemistry with applications in pharmaceutical development.",
    researchInterests: ["Organic Chemistry", "Drug Discovery", "Synthesis", "Medicinal Chemistry"],
    aiKeywords: ["chemistry", "pharmaceuticals", "drug development", "synthesis", "molecules"]
  },
  {
    id: "5",
    name: "Dr. Lisa Martinez",
    title: "Professor of Psychology",
    department: "Psychology",
    email: "lmartinez@salisbury.edu",
    phone: "(410) 543-6400",
    photo: "",
    bio: "Dr. Martinez specializes in cognitive psychology and human-computer interaction.",
    researchInterests: ["Cognitive Psychology", "Human-Computer Interaction", "User Experience", "Behavioral Science"],
    aiKeywords: ["psychology", "cognition", "HCI", "UX", "behavior", "perception"]
  }
];

// Mock papers data
export const papersData: Paper[] = [
  {
    id: "1",
    title: "Deep Learning Approaches for Medical Image Segmentation",
    authors: ["Dr. Sarah Chen", "Dr. Robert Lee"],
    year: 2023,
    abstract: "This paper presents novel deep learning techniques for automated medical image segmentation, achieving state-of-the-art results on benchmark datasets.",
    link: "https://doi.org/10.1000/example1",
    aiKeywords: ["deep learning", "medical imaging", "segmentation", "CNN", "healthcare"]
  },
  {
    id: "2",
    title: "Climate Change Impacts on Chesapeake Bay Ecosystems",
    authors: ["Dr. Michael Rodriguez", "Dr. Amanda Green"],
    year: 2023,
    abstract: "A comprehensive study examining the effects of rising temperatures and sea levels on Chesapeake Bay marine life.",
    link: "https://doi.org/10.1000/example2",
    aiKeywords: ["climate change", "Chesapeake Bay", "marine ecology", "environmental science"]
  },
  {
    id: "3",
    title: "Predictive Analytics for Supply Chain Optimization",
    authors: ["Dr. Emily Watson", "Dr. David Kim"],
    year: 2022,
    abstract: "This research demonstrates how machine learning models can improve supply chain forecasting and reduce operational costs.",
    link: "https://doi.org/10.1000/example3",
    aiKeywords: ["predictive analytics", "supply chain", "machine learning", "optimization", "business"]
  },
  {
    id: "4",
    title: "Novel Synthesis Pathways for Anti-Cancer Compounds",
    authors: ["Dr. James Thompson", "Dr. Patricia Wilson"],
    year: 2023,
    abstract: "Development of new organic synthesis methods for creating potentially therapeutic anti-cancer molecules.",
    link: "https://doi.org/10.1000/example4",
    aiKeywords: ["organic chemistry", "synthesis", "cancer", "pharmaceuticals", "drug development"]
  },
  {
    id: "5",
    title: "Cognitive Load in Virtual Reality Learning Environments",
    authors: ["Dr. Lisa Martinez", "Dr. Kevin Brown"],
    year: 2022,
    abstract: "An investigation of how VR interfaces affect cognitive processing and learning outcomes in educational settings.",
    link: "https://doi.org/10.1000/example5",
    aiKeywords: ["cognitive psychology", "virtual reality", "education", "learning", "HCI"]
  }
];

// Mock patents data
export const patentsData: Patent[] = [
  {
    id: "1",
    title: "AI-Powered Diagnostic System for Early Disease Detection",
    inventors: ["Dr. Sarah Chen", "Dr. Michael Liu"],
    patentNumber: "US-2023-001234",
    year: 2023,
    description: "An intelligent system using machine learning algorithms to detect early signs of diseases from medical imaging data.",
    link: "https://patents.google.com/example1",
    aiKeywords: ["AI", "diagnostics", "machine learning", "healthcare", "medical imaging"]
  },
  {
    id: "2",
    title: "Biodegradable Microplastic Filter for Marine Applications",
    inventors: ["Dr. Michael Rodriguez"],
    patentNumber: "US-2022-005678",
    year: 2022,
    description: "A novel filtering system designed to remove microplastics from water while being environmentally safe.",
    link: "https://patents.google.com/example2",
    aiKeywords: ["environmental", "marine", "filtration", "sustainability", "microplastics"]
  },
  {
    id: "3",
    title: "Real-Time Business Intelligence Dashboard System",
    inventors: ["Dr. Emily Watson", "Dr. John Anderson"],
    patentNumber: "US-2023-009876",
    year: 2023,
    description: "An innovative platform for real-time data visualization and business analytics with predictive capabilities.",
    link: "https://patents.google.com/example3",
    aiKeywords: ["business intelligence", "analytics", "dashboard", "real-time", "data visualization"]
  }
];

// Mock projects data
export const projectsData: Project[] = [
  {
    id: "1",
    title: "AI for Coastal Resilience Planning",
    leadFaculty: ["Dr. Michael Rodriguez", "Dr. Sarah Chen"],
    status: "Active",
    description: "Developing AI models to predict and mitigate coastal erosion and flooding impacts in the Chesapeake Bay region.",
    startDate: "2023-01-15",
    endDate: "2025-12-31",
    aiKeywords: ["AI", "coastal", "climate resilience", "machine learning", "environmental"]
  },
  {
    id: "2",
    title: "Smart Campus Energy Management System",
    leadFaculty: ["Dr. Emily Watson"],
    status: "Active",
    description: "Implementing IoT sensors and analytics to optimize energy consumption across campus buildings.",
    startDate: "2022-09-01",
    endDate: "2024-08-31",
    aiKeywords: ["IoT", "energy", "sustainability", "analytics", "smart campus"]
  },
  {
    id: "3",
    title: "Virtual Reality Therapy for PTSD Treatment",
    leadFaculty: ["Dr. Lisa Martinez"],
    status: "Active",
    description: "Researching the effectiveness of VR-based exposure therapy for treating post-traumatic stress disorder.",
    startDate: "2023-03-01",
    endDate: "2025-02-28",
    aiKeywords: ["VR", "psychology", "therapy", "PTSD", "mental health"]
  },
  {
    id: "4",
    title: "Drug Discovery for Antibiotic-Resistant Bacteria",
    leadFaculty: ["Dr. James Thompson"],
    status: "Active",
    description: "Synthesizing and testing novel compounds to combat antibiotic-resistant bacterial infections.",
    startDate: "2022-06-01",
    endDate: "2024-05-31",
    aiKeywords: ["pharmaceuticals", "antibiotics", "drug discovery", "chemistry", "healthcare"]
  }
];