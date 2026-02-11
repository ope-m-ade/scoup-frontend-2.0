import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { Eye, EyeOff, Lock, Mail, University, ArrowLeft } from "lucide-react";

interface FacultyLoginProps {
  onBack?: () => void;
  onLoginSuccess?: () => void;
  onSignup?: () => void;
}

export function FacultyLogin({ onBack, onLoginSuccess, onSignup }: FacultyLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login process
    try {
      // Mock authentication - replace with real authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.emailOrUsername && formData.password) {
        console.log("Login attempt:", formData);
        // Handle successful login here
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError("Please fill in all fields");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <University className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold text-primary">SCOUP</h1>
          </div>
          <p className="text-muted-foreground">Faculty Portal Access</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Welcome Back</CardTitle>
              {onBack && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardDescription>
              Sign in to access your faculty dashboard and collaboration tools
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="emailOrUsername">Email Address or Username</Label>
                <div className="relative">
                  <Input
                    id="emailOrUsername"
                    type="text"
                    placeholder="your.email@salisbury.edu or username"
                    value={formData.emailOrUsername}
                    onChange={(e) => handleInputChange("emailOrUsername", e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Need access to SCOUP?
                </p>
                <Button variant="outline" className="w-full" onClick={onSignup}>
                  Request Faculty Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <Button variant="link" className="px-0 text-sm">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="px-0 text-sm">
              Privacy Policy
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}