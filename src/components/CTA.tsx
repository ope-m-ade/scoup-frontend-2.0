import { ArrowRight, Zap, Shield, Headphones } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function CTA() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="max-w-6xl mx-auto">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-6">
            Ready to unlock SU's potential?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join the growing network of faculty, researchers, and industry partners leveraging SCOUP to foster meaningful collaboration and innovation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="group">
              Start free trial
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              Schedule demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 14-day free trial • Setup in 5 minutes
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">Immediate Discovery</h3>
              <p className="text-sm text-muted-foreground">
                Start finding faculty expertise and collaboration opportunities across all SU departments immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">University Integrated</h3>
              <p className="text-sm text-muted-foreground">
                Built specifically for Salisbury University with deep integration into existing systems and workflows.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Expert support team ready to help you optimize your search experience.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          <div className="bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl p-8 border border-border/50">
            <div className="text-center mb-8">
              <h3 className="text-xl mb-2">Collaboration Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Track partnership outcomes, identify successful collaboration patterns, and discover emerging interdisciplinary opportunities
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc1ODY1MjY1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Analytics Dashboard"
                className="w-full h-80 object-cover rounded-lg border border-border/50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}