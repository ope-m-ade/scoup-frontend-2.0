import { Search, Zap, Database, Filter, ChevronDown, User, FileText, Award, Lightbulb } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useState } from "react";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

  const filterOptions = [
    { value: "all", label: "All Content", icon: <Database className="w-4 h-4" /> },
    { value: "faculty", label: "Faculty", icon: <User className="w-4 h-4" /> },
    { value: "projects", label: "Projects", icon: <Lightbulb className="w-4 h-4" /> },
    { value: "papers", label: "Papers", icon: <FileText className="w-4 h-4" /> },
    { value: "patents", label: "Patents", icon: <Award className="w-4 h-4" /> }
  ];

  const getSelectedFilter = () => filterOptions.find(option => option.value === searchFilter) || filterOptions[0];

  return (
    <section className="relative bg-gradient-to-br from-background via-secondary/20 to-accent/30 py-24 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full mb-6">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Salisbury University Knowledge Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Connect with SU's intellectual capital
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Discover faculty expertise, ongoing research projects, and collaboration opportunities at Salisbury University. 
            Our AI breaks down information silos to foster meaningful partnerships.
          </p>
        </div>

        {/* Search Demo */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search faculty expertise, research papers, patents, projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-48 py-4 text-lg bg-card/50 backdrop-blur-sm border-border/50"
            />
            
            {/* Filter Dropdown */}
            <div className="absolute right-24 top-1/2 transform -translate-y-1/2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 bg-card/80 backdrop-blur-sm border-border/50">
                    {getSelectedFilter().icon}
                    <span className="ml-1 mr-1 text-xs">{getSelectedFilter().label}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSearchFilter(option.value)}
                      className="flex items-center gap-2"
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Zap className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["cybersecurity research", "environmental patents", "AI projects", "business analytics papers"].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setSearchQuery(suggestion)}
                className="px-3 py-1 text-sm bg-secondary/50 hover:bg-secondary rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-2">400+</div>
            <div className="text-muted-foreground">Faculty Experts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">200+</div>
            <div className="text-muted-foreground">Active Research Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">50+</div>
            <div className="text-muted-foreground">Industry Partnerships</div>
          </div>
        </div>
      </div>
    </section>
  );
}