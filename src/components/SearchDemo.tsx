import { useState } from "react";
import { Search, Filter, Calendar, User, Building, Lightbulb, BookOpen, Users, Mail, Phone, FileText, Award, Layers, ChevronDown, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function SearchDemo() {
  const [activeQuery, setActiveQuery] = useState("cybersecurity data analytics");
  const [activeTab, setActiveTab] = useState("all");
  const [searchFilter, setSearchFilter] = useState("all");

  const filterOptions = [
    { value: "all", label: "All Content", icon: <Database className="w-4 h-4" /> },
    { value: "faculty", label: "Faculty", icon: <User className="w-4 h-4" /> },
    { value: "projects", label: "Projects", icon: <Lightbulb className="w-4 h-4" /> },
    { value: "papers", label: "Papers", icon: <FileText className="w-4 h-4" /> },
    { value: "patents", label: "Patents", icon: <Award className="w-4 h-4" /> }
  ];

  const getSelectedFilter = () => filterOptions.find(option => option.value === searchFilter) || filterOptions[0];
  
  const allResults = [
    {
      id: 1,
      type: "Faculty Expert",
      title: "Dr. Sarah Chen, Computer Science",
      description: "Specializes in cybersecurity, machine learning applications for threat detection, and privacy-preserving analytics",
      metadata: { department: "Computer Science", experience: "12 years", projects: "8 active", availability: "Available" },
      icon: <User className="w-4 h-4" />,
      category: "experts"
    },
    {
      id: 2,
      type: "Research Paper",
      title: "Privacy-Preserving Analytics in Smart City Infrastructure",
      description: "Published study on implementing differential privacy techniques for municipal data analysis while maintaining utility",
      metadata: { published: "2024", citations: "23", journal: "IEEE Security", impact: "8.2" },
      icon: <FileText className="w-4 h-4" />,
      category: "papers"
    },
    {
      id: 3,
      type: "Research Project",
      title: "Smart City Security Infrastructure",
      description: "NSF-funded project developing AI-powered cybersecurity solutions for municipal systems",
      metadata: { funding: "$450K", duration: "2 years", collaborators: "3 departments", status: "Active" },
      icon: <Lightbulb className="w-4 h-4" />,
      category: "projects"
    },
    {
      id: 4,
      type: "Patent Application",
      title: "Distributed Anomaly Detection System for IoT Networks",
      description: "Novel approach to real-time threat detection in smart city sensor networks using federated learning",
      metadata: { filed: "2023", inventor: "Chen, S. et al.", status: "Pending", classification: "H04L" },
      icon: <Award className="w-4 h-4" />,
      category: "patents"
    },
    {
      id: 5,
      type: "Research Paper",
      title: "Machine Learning for Cybersecurity: A Comprehensive Survey",
      description: "Systematic review of ML applications in cybersecurity with focus on industrial implementations",
      metadata: { published: "2023", citations: "156", journal: "ACM Computing Surveys", impact: "9.1" },
      icon: <FileText className="w-4 h-4" />,
      category: "papers"
    },
    {
      id: 6,
      type: "Research Project",
      title: "Data Analytics for Environmental Monitoring",
      description: "Collaborative project using sensor networks and ML for real-time environmental data analysis",
      metadata: { funding: "$320K", duration: "18 months", collaborators: "2 departments", status: "Active" },
      icon: <Lightbulb className="w-4 h-4" />,
      category: "projects"
    }
  ];

  const getFilteredResults = (category: string) => {
    if (category === "all") return allResults;
    return allResults.filter(result => result.category === category);
  };

  const queries = [
    "cybersecurity data analytics",
    "environmental sustainability research",
    "business process optimization",
    "educational technology innovation"
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Demo Interface */}
          <div>
            <h2 className="text-3xl md:text-4xl mb-6">
              See it in action
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Search through SU's research papers, patents, active projects, and faculty expertise with intelligent keyword matching.
            </p>

            {/* Search Interface */}
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  value={activeQuery}
                  onChange={(e) => setActiveQuery(e.target.value)}
                  placeholder="Search keywords in papers, patents, projects, or find faculty expertise..."
                  className="pl-12 pr-36 py-3 bg-card border-border"
                />
                
                {/* Filter Dropdown in Search */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        {getSelectedFilter().icon}
                        <span className="ml-1 mr-1 text-xs">{getSelectedFilter().label}</span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {filterOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => {
                            setSearchFilter(option.value);
                            // Sync with tabs - map filter values to tab values
                            const tabMapping = {
                              "all": "all",
                              "faculty": "experts", 
                              "projects": "projects",
                              "papers": "papers",
                              "patents": "patents"
                            };
                            setActiveTab(tabMapping[option.value as keyof typeof tabMapping] || "all");
                          }}
                          className="flex items-center gap-2"
                        >
                          {option.icon}
                          <span>{option.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {queries.map((query) => (
                  <Button
                    key={query}
                    variant={activeQuery === query ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveQuery(query)}
                    className="text-sm"
                  >
                    {query}
                  </Button>
                ))}
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="w-3 h-3" />
                  Available now
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <BookOpen className="w-3 h-3" />
                  Active research
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Users className="w-3 h-3" />
                  Collaboration ready
                </Badge>
              </div>
            </div>
          </div>

          {/* Results Preview with Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                Found {getFilteredResults(activeTab).length} results in 47ms
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="experts" className="text-xs">Experts</TabsTrigger>
                <TabsTrigger value="projects" className="text-xs">Projects</TabsTrigger>
                <TabsTrigger value="papers" className="text-xs">Papers</TabsTrigger>
                <TabsTrigger value="patents" className="text-xs">Patents</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <div className="space-y-3">
                  {getFilteredResults(activeTab).map((result) => (
                    <Card key={result.id} className="border-border/50 hover:border-border transition-colors cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {result.icon}
                            <Badge variant="outline" className="text-xs">
                              {result.type}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{result.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-3">
                          {result.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2 text-xs">
                            {Object.entries(result.metadata).map(([key, value]) => (
                              <span key={key} className="bg-secondary/50 px-2 py-1 rounded">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            {result.category === "experts" ? (
                              <>
                                <Mail className="w-3 h-3 mr-1" />
                                Connect
                              </>
                            ) : (
                              <>
                                <BookOpen className="w-3 h-3 mr-1" />
                                View
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-center pt-4">
              <Button variant="outline">View all results</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}