import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { Navbar } from "./Navbar";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { contactAPI } from "../utils/api";

interface ContactProps {
  onNavigate: (path: string) => void;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  email: string;
  linkedin_url: string;
  photo: string | null;
}

interface ContactSettings {
  general_email: string;
  support_email: string;
  github_url: string;
  linkedin_url: string;
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
}

export function Contact({ onNavigate }: ContactProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [team, s] = await Promise.all([
          contactAPI.getTeam(),
          contactAPI.getSettings(),
        ]);
        setTeamMembers(Array.isArray(team) ? team : team?.results || []);
        setSettings(s);
      } catch {
        // fall back to empty
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onNavigate={onNavigate} currentPath="contact" />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#fff9e6] to-white px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Get in <span className="text-[#8b0000]">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Have questions about SCOUP? Our team is here to help faculty, researchers, and community partners.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#8b0000] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#ffd100]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">General Inquiries</h3>
                  <p className="text-gray-600 mb-4 font-light">
                    Questions about SCOUP or partnership opportunities
                  </p>
                  <a
                    href={`mailto:${settings?.general_email || "scoup@salisbury.edu"}`}
                    className="text-[#8b0000] hover:text-[#6b0000] font-medium transition-colors"
                  >
                    {settings?.general_email || "scoup@salisbury.edu"}
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#8b0000] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#ffd100]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Technical Support</h3>
                  <p className="text-gray-600 mb-4 font-light">
                    Help with your faculty dashboard or platform features
                  </p>
                  <a
                    href={`mailto:${settings?.support_email || "scoup-support@salisbury.edu"}`}
                    className="text-[#8b0000] hover:text-[#6b0000] font-medium transition-colors"
                  >
                    {settings?.support_email || "scoup-support@salisbury.edu"}
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Meet the <span className="text-[#8b0000]">Team</span>
              </h2>
              <p className="text-lg text-gray-600 font-light">
                The dedicated developers behind SCOUP
              </p>
            </div>

            {isLoading ? (
              <p className="text-center text-gray-500">Loading team...</p>
            ) : (
              <div className="space-y-8">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#8b0000]">
                    <div className="grid md:grid-cols-[200px_1fr] gap-8 p-8">
                      <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="relative w-48 h-48 rounded-lg overflow-hidden ring-4 ring-[#ffd100] shadow-lg">
                          <img
                            src={member.photo || ""}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            {member.name}
                          </h3>
                          <p className="text-[#8b0000] font-medium mb-4">
                            {member.role}
                          </p>
                          <p className="text-gray-600 leading-relaxed mb-6">
                            {member.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button asChild className="bg-[#8b0000] hover:bg-[#700000] text-white">
                            <a href={`mailto:${member.email}`}>
                              <Mail className="w-4 h-4 mr-2" />
                              Email
                            </a>
                          </Button>
                          {member.linkedin_url && (
                            <Button asChild variant="outline" className="border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000] hover:text-white">
                              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-4 h-4 mr-2" />
                                LinkedIn
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Project Links */}
          <div className="mb-16">
            <Card className="bg-gradient-to-br from-[#8b0000] to-[#700000] text-white p-8">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4">Explore SCOUP</h3>
                <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
                  Explore our open-source codebase on GitHub
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild className="bg-white text-[#8b0000] hover:bg-gray-100">
                    <a href={settings?.github_url || "#"} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                  {/* <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-[#8b0000]">
                    <a href={settings?.linkedin_url || "#"} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      Follow on LinkedIn
                    </a>
                  </Button> */}
                </div>
              </div>
            </Card>
          </div>

          {/* Location */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#8b0000] rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#ffd100]" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-700 font-light">
                  {settings?.address_line_1 || "Salisbury University"}<br />
                  {settings?.address_line_2 || "1101 Camden Avenue"}<br />
                  {settings?.address_line_3 || "Salisbury, MD 21801"}
                </p>
              </div>
            </div>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5dc] border-t border-[#e5e5c5] mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="mb-4">
                <span className="text-xl font-bold text-gray-900">SCOUP</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Salisbury University's centralized knowledge and collaboration platform. Connecting internal expertise with external opportunities to drive innovation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">About</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => onNavigate("/about")} className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm">
                    SCOUP Overview
                  </button>
                </li>
                <li>
                  <a href={settings?.github_url || "#"} className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm">
                    GitHub
                  </a>
                </li>
                <li>
                  <button onClick={() => onNavigate("/contact")} className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm">
                    Contact
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("/admin-login")} className="text-gray-600 hover:text-[#8b0000] transition-colors text-sm">
                    Admin Login
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-[#e5e5c5]">
            <p className="text-sm text-gray-600">© 2025 SCOUP Team. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-600 hover:text-[#8b0000] transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#8b0000] transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#8b0000] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
