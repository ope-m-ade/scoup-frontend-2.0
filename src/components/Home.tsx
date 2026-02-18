import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Search, TrendingUp, Users } from "lucide-react";
import { Navbar } from "./Navbar";
import { SearchResults } from "./SearchResults";
import { performSearch, setSearchDataset } from "../utils/searchEngine";
import { SearchResult } from "../data/searchData";
import salisburyLogo from "../assets/images/Salisbury_University_logo.png";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fallbackDataset, fetchPublicDataset } from "../utils/publicData";

interface HomeProps {
  onNavigate: (page: "home" | "about" | "faculty-login" | "admin-login") => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(["faculty", "paper", "patent", "project"]);
  const [isSearching, setIsSearching] = useState(false);
  const [publicDataset, setPublicDataset] = useState(fallbackDataset);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const results = await performSearch(searchQuery);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Analytics data - generated from mock data
  const [publicationsPerYear, setPublicationsPerYear] = useState<{ year: string; publications: number }[]>([]);
  const [facultyByDepartment, setFacultyByDepartment] = useState<{ department: string; faculty: number }[]>([]);
  const [stats, setStats] = useState({
    totalPublications: 0,
    facultyMembers: 0,
    activePatents: 0,
    ongoingProjects: 0
  });

  useEffect(() => {
    const generateAnalytics = () => {
      // Publications per year
      const yearCounts = publicDataset.papersData.reduce((acc, paper) => {
        const year = paper.year.toString();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const pubsData = Object.entries(yearCounts)
        .map(([year, publications]) => ({ year, publications }))
        .sort((a, b) => parseInt(a.year) - parseInt(b.year));
      
      setPublicationsPerYear(pubsData);

      // Faculty by department
      const deptCounts = publicDataset.facultyData.reduce((acc, faculty) => {
        acc[faculty.department] = (acc[faculty.department] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const deptData = Object.entries(deptCounts)
        .map(([department, faculty]) => ({ department, faculty }));
      
      setFacultyByDepartment(deptData);

      // Overall stats
      setStats({
        totalPublications: publicDataset.papersData.length,
        facultyMembers: publicDataset.facultyData.length,
        activePatents: publicDataset.patentsData.length,
        ongoingProjects: publicDataset.projectsData.length
      });
    };

    generateAnalytics();
  }, [publicDataset]);

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const apiDataset = await fetchPublicDataset();
        setPublicDataset(apiDataset);
        setSearchDataset(apiDataset);
      } catch (error) {
        console.error("Failed to load backend dataset, using fallback data:", error);
        setSearchDataset(fallbackDataset);
      }
    };

    loadPublicData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Navbar onNavigate={onNavigate} currentPage="home" />

      {hasSearched ? (
        // Search Results View
        <div className="flex-1 bg-white">
          {/* Search Bar in Results */}
          <div className="bg-gradient-to-b from-[#fff9e6] to-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-6 py-6">
              <div className="flex justify-center mb-4">
                <form onSubmit={handleSearch} className="w-full max-w-2xl">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search faculty expertise, research, or projects..."
                      className="w-full px-6 py-3 pr-14 text-base border-2 border-gray-300 rounded-full focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#ffd100]/30 transition-all shadow-md font-light bg-white"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8b0000] hover:bg-[#6b0000] text-[#ffd100] p-2 rounded-full transition-colors shadow-md"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Filters */}
              <div className="flex justify-center items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-600 font-medium">Filter:</span>
                <button
                  onClick={() => toggleFilter("faculty")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeFilters.includes("faculty")
                      ? "bg-[#8b0000] text-[#ffd100]"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Faculty
                </button>
                <button
                  onClick={() => toggleFilter("paper")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeFilters.includes("paper")
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Papers
                </button>
                <button
                  onClick={() => toggleFilter("patent")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeFilters.includes("patent")
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Patents
                </button>
                <button
                  onClick={() => toggleFilter("project")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeFilters.includes("project")
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Projects
                </button>
              </div>
              
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => {
                    setHasSearched(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="text-sm text-gray-600 hover:text-[#8b0000] transition-colors"
                >
                  ← Back to home
                </button>
              </div>
            </div>
          </div>
          <SearchResults results={searchResults} query={searchQuery} activeFilters={activeFilters} />
        </div>
      ) : (
        // Hero Section with Search
        <section className="flex items-center justify-center bg-gradient-to-b from-[#fff9e6] via-white to-gray-50 px-6 py-32 md:py-40 min-h-screen relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-20 right-10 w-64 h-64 bg-[#ffd100] rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#8b0000] rounded-full opacity-5 blur-3xl"></div>
          
          <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
            {/* Heading */}
            <div className="space-y-5">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-[#8b0000] text-[#ffd100] text-sm font-medium rounded-full">
                  Salisbury University
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight">
                Discover. <span className="text-[#8b0000]">Connect.</span> Collaborate.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                AI-powered platform connecting Salisbury University's expertise with real-world impact.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto pt-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search faculty expertise, research, or projects..."
                  className="w-full px-6 py-4 pr-14 text-base border-2 border-gray-300 rounded-full focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#ffd100]/30 transition-all shadow-lg font-light bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8b0000] hover:bg-[#6b0000] text-[#ffd100] p-3 rounded-full transition-colors shadow-md"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Analytics Section - Only show when not searching */}
      {!hasSearched && (
        <section className="bg-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Platform <span className="text-[#8b0000]">Analytics</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                Explore Salisbury University's growing research footprint and faculty expertise across departments
              </p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Publications Per Year Chart */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#ffd100]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">Publications Per Year</h3>
                    <p className="text-sm text-gray-600">Research output trend over time</p>
                  </div>
                </div>
                
                {publicationsPerYear.length > 0 ? (
                  <>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={publicationsPerYear}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="year" 
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#ffffff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '8px 12px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="publications" 
                            stroke="#8b0000" 
                            strokeWidth={3}
                            dot={{ fill: '#8b0000', r: 5 }}
                            activeDot={{ r: 7, fill: '#ffd100', stroke: '#8b0000', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Publications (2018-2025)</span>
                        <span className="font-semibold text-[#8b0000]">
                          {publicationsPerYear.reduce((sum, item) => sum + item.publications, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center px-4">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Publication Data</h4>
                      <p className="text-sm text-gray-600">
                        Publication analytics will appear here once data is added to the system.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Faculty by Department - Bar Chart */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#8b0000] rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#ffd100]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">Faculty by Department</h3>
                    <p className="text-sm text-gray-600">Faculty distribution across categories</p>
                  </div>
                </div>
                
                {facultyByDepartment.length > 0 ? (
                  <>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={facultyByDepartment} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            type="number"
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis 
                            type="category"
                            dataKey="department" 
                            width={120}
                            stroke="#6b7280"
                            style={{ fontSize: '11px' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '8px 12px'
                            }}
                          />
                          <Bar 
                            dataKey="faculty" 
                            fill="#8b0000"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Faculty Members</span>
                        <span className="font-semibold text-[#8b0000]">
                          {facultyByDepartment.reduce((sum, item) => sum + item.faculty, 0)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center px-4">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Faculty Data</h4>
                      <p className="text-sm text-gray-600">
                        Faculty analytics will appear here once data is added to the system.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center p-6 bg-gradient-to-br from-[#8b0000] to-[#6b0000] rounded-xl text-white">
                <div className="text-4xl font-light mb-2">{stats.totalPublications.toLocaleString()}</div>
                <div className="text-sm text-white/80">Total Publications</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#8b0000] to-[#6b0000] rounded-xl text-white">
                <div className="text-4xl font-light mb-2">{stats.facultyMembers.toLocaleString()}</div>
                <div className="text-sm text-white/80">Faculty Members</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#ffd100] to-[#e6bc00] rounded-xl text-[#8b0000]">
                <div className="text-4xl font-light mb-2">{stats.activePatents.toLocaleString()}</div>
                <div className="text-sm text-[#8b0000]/80">Active Patents</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#ffd100] to-[#e6bc00] rounded-xl text-[#8b0000]">
                <div className="text-4xl font-light mb-2">{stats.ongoingProjects.toLocaleString()}</div>
                <div className="text-sm text-[#8b0000]/80">Ongoing Projects</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#f5f5dc] border-t border-[#e5e5c5] mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left - Branding */}
            <div>
              <div className="mb-4">
                <span className="text-xl font-bold text-gray-900">SCOUP</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Salisbury University's centralized knowledge and collaboration platform. Connecting internal expertise with external opportunities to drive innovation.
              </p>
            </div>

            {/* Middle - Resources */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm">
                    Tutorials
                  </a>
                </li>
              </ul>
            </div>

            {/* Right - About */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">About</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => onNavigate("about")}
                    className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm"
                  >
                    SCOUP Overview
                  </button>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm">
                    Contact
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("admin-login")}
                    className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm"
                  >
                    Admin Login
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-[#e5e5c5]">
            <p className="text-sm text-gray-600">© 2025 SCOUP Team. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-600 hover:text-[#8b0000] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#8b0000] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#8b0000] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
