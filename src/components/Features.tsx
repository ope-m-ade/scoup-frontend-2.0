import { Search, Users, Brain, Shield, BarChart3, Building, Network, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function Features() {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "AI-Enhanced Discovery",
      description: "Find the right faculty expert with confidence-calibrated search results that understand expertise domains and research contexts."
    },
    {
      icon: <Network className="w-8 h-8 text-primary" />,
      title: "Collaboration Networks",
      description: "Discover internal connections and potential synergies between departments to form cross-disciplinary research teams."
    },
    {
      icon: <Building className="w-8 h-8 text-primary" />,
      title: "Industry Partnerships",
      description: "Connect businesses, nonprofits, and agencies with relevant SU expertise through streamlined contact pathways."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Expertise Mapping",
      description: "Visualize knowledge distribution across departments and identify opportunities for interdisciplinary collaboration."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: "Direct Communication",
      description: "Facilitate meaningful connections with built-in contact management and collaboration request workflows."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Team Formation",
      description: "Automatically suggest optimal team compositions based on complementary expertise and past collaboration success."
    }
  ];

  return (
    <section className="py-24 px-4 bg-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4">
            Breaking down information silos at Salisbury University
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to discover expertise, foster partnerships, and enable meaningful collaboration both internally and externally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}