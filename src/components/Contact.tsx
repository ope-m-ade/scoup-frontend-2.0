import { Button } from "./ui/button";
import {
  ArrowRight,
  Target,
  Network,
  Building2,
  BarChart3,
  MessageSquare,
  Users,
  Zap,
  Shield,
  Headphones,
} from "lucide-react";
import { Navbar } from "./Navbar";

interface ContactProps {
  onNavigate: (
    page: "home" | "about" | "contact" | "faculty-login" | "admin-login",
  ) => void;
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
  email: string;
  image?: string;
  initials: string;
}

export function Contact({ onNavigate }: ContactProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Navbar at top */}
      <Navbar onNavigate={onNavigate} currentPage="contact" />

      {/* 2. Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-6">
          <h1 className="text-4xl font-bold text-gray-900">Get in Touch</h1>
          <p className="text-lg text-gray-600">
            Have questions about SCOUP? Our team is here to help.
          </p>
        </section>
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: General Inquiries */}
          <Card>
            <Mail className="w-8 h-8 text-[#8b0000]" /> {/* Icon */}
            <h3>General Inquiries</h3>
            <a href="mailto:scoup@salisbury.edu">scoup@salisbury.edu</a>
          </Card>

          {/* Card 2: Technical Support */}
          {/* Card 3: Location */}
        </div>

        {/* Team Grid */}
        {/* Location Card */}
      </main>

      {/* 3. Footer at bottom */}
      <footer>...</footer>
    </div>
  );
}
