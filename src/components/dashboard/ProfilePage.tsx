import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera, Plus, X, Edit2, Save, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { ProfileCompletionWidget } from "./ProfileCompletionWidget";

interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    title: "",
    phone: "",
    officeLocation: "",
    bio: "",
    researchInterests: "",
    personalWebsite: ""
  });

  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [aiGeneratedKeywords, setAiGeneratedKeywords] = useState<string[]>([]);

  const [newQualification, setNewQualification] = useState({
    degree: "",
    institution: "",
    year: ""
  });

  const [showAddQualification, setShowAddQualification] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingResearch, setIsGeneratingResearch] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    type: 'bio' | 'research' | null;
    content: string;
  }>({ type: null, content: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddQualification = () => {
    if (newQualification.degree && newQualification.institution && newQualification.year) {
      setQualifications(prev => [
        ...prev,
        { ...newQualification, id: Date.now().toString() }
      ]);
      setNewQualification({ degree: "", institution: "", year: "" });
      setShowAddQualification(false);
    }
  };

  const handleDeleteQualification = (id: string) => {
    setQualifications(prev => prev.filter(q => q.id !== id));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log("Saving profile data:", formData, qualifications);
  };

  const getInitials = () => {
    return `${formData.firstName[0]}${formData.lastName[0]}`;
  };

  const generateAIBio = async () => {
    setIsGeneratingBio(true);
    setAiSuggestion({ type: null, content: "" });

    // Simulate AI generation with delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate bio based on profile data
    const highestDegree = qualifications[0]?.degree || "advanced degree";
    const department = formData.department;
    const title = formData.title;
    const name = `${formData.firstName} ${formData.lastName}`;

    const generatedBio = `${name} is ${title} in the ${department} department at Salisbury University. With ${highestDegree.includes('Ph.D.') ? 'a Ph.D.' : 'an ' + highestDegree} from ${qualifications[0]?.institution || 'a prestigious institution'}, Dr. ${formData.lastName} brings extensive expertise in ${department.toLowerCase()} to the university community. Their work focuses on advancing knowledge and fostering student success through innovative research and dedicated teaching. Dr. ${formData.lastName} is committed to interdisciplinary collaboration and contributing to Salisbury University's mission of excellence in education and research.`;

    setAiSuggestion({ type: 'bio', content: generatedBio });
    setIsGeneratingBio(false);
  };

  const generateAIResearchInterests = async () => {
    setIsGeneratingResearch(true);
    setAiSuggestion({ type: null, content: "" });

    // Simulate AI generation with delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate research interests based on department
    const department = formData.department;
    const degreeField = qualifications[0]?.degree.split(' in ')[1] || department;
    
    let generatedInterests = "";
    
    if (department.toLowerCase().includes('computer') || department.toLowerCase().includes('cs')) {
      generatedInterests = "Artificial Intelligence, Machine Learning, Natural Language Processing, Data Science, Software Engineering, Human-Computer Interaction, Cybersecurity, Cloud Computing, Algorithm Design";
    } else if (department.toLowerCase().includes('business')) {
      generatedInterests = "Strategic Management, Organizational Behavior, Marketing Analytics, Entrepreneurship, Financial Management, Supply Chain Management, Business Intelligence, Innovation Management";
    } else if (department.toLowerCase().includes('biology')) {
      generatedInterests = "Molecular Biology, Genetics, Ecology, Evolutionary Biology, Biotechnology, Marine Biology, Environmental Science, Cellular Biology";
    } else if (department.toLowerCase().includes('education')) {
      generatedInterests = "Curriculum Development, Educational Technology, Student Assessment, Inclusive Education, Learning Analytics, Pedagogical Innovation, Educational Leadership";
    } else if (department.toLowerCase().includes('engineering')) {
      generatedInterests = "Systems Engineering, Sustainable Design, Automation, Materials Science, Project Management, Engineering Education, Applied Research";
    } else {
      generatedInterests = `${degreeField}, Research Methodology, Interdisciplinary Studies, Applied ${degreeField}, Innovation in ${department}, Academic Collaboration, Student Mentorship`;
    }

    setAiSuggestion({ type: 'research', content: generatedInterests });
    setIsGeneratingResearch(false);
  };

  const acceptAISuggestion = () => {
    if (aiSuggestion.type === 'bio') {
      setFormData(prev => ({ ...prev, bio: aiSuggestion.content }));
    } else if (aiSuggestion.type === 'research') {
      setFormData(prev => ({ ...prev, researchInterests: aiSuggestion.content }));
    }
    setAiSuggestion({ type: null, content: "" });
  };

  const rejectAISuggestion = () => {
    setAiSuggestion({ type: null, content: "" });
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords(prev => [...prev, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const handleDeleteKeyword = (keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword));
  };

  const generateAIKeywords = async () => {
    setIsGeneratingKeywords(true);
    setAiGeneratedKeywords([]);

    // Simulate AI generation with delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate keywords based on department
    const department = formData.department;
    const degreeField = qualifications[0]?.degree.split(' in ')[1] || department;
    
    let generatedKeywords: string[] = [];
    
    if (department.toLowerCase().includes('computer') || department.toLowerCase().includes('cs')) {
      generatedKeywords = ["Artificial Intelligence", "Machine Learning", "Natural Language Processing", "Data Science", "Software Engineering", "Human-Computer Interaction", "Cybersecurity", "Cloud Computing", "Algorithm Design"];
    } else if (department.toLowerCase().includes('business')) {
      generatedKeywords = ["Strategic Management", "Organizational Behavior", "Marketing Analytics", "Entrepreneurship", "Financial Management", "Supply Chain Management", "Business Intelligence", "Innovation Management"];
    } else if (department.toLowerCase().includes('biology')) {
      generatedKeywords = ["Molecular Biology", "Genetics", "Ecology", "Evolutionary Biology", "Biotechnology", "Marine Biology", "Environmental Science", "Cellular Biology"];
    } else if (department.toLowerCase().includes('education')) {
      generatedKeywords = ["Curriculum Development", "Educational Technology", "Student Assessment", "Inclusive Education", "Learning Analytics", "Pedagogical Innovation", "Educational Leadership"];
    } else if (department.toLowerCase().includes('engineering')) {
      generatedKeywords = ["Systems Engineering", "Sustainable Design", "Automation", "Materials Science", "Project Management", "Engineering Education", "Applied Research"];
    } else {
      generatedKeywords = [degreeField, "Research Methodology", "Interdisciplinary Studies", "Applied " + degreeField, "Innovation in " + department, "Academic Collaboration", "Student Mentorship"];
    }

    setAiGeneratedKeywords(generatedKeywords);
    setIsGeneratingKeywords(false);
  };

  const acceptAIKeywords = () => {
    setKeywords(aiGeneratedKeywords);
    setAiGeneratedKeywords([]);
  };

  const rejectAIKeywords = () => {
    setAiGeneratedKeywords([]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your profile information and qualifications</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Profile Photo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profilePhoto} />
              <AvatarFallback className="text-2xl bg-[#8b0000] text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-[#8b0000] text-white p-2 rounded-full cursor-pointer hover:bg-[#700000] transition-colors"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{formData.firstName} {formData.lastName}</h3>
            <p className="text-gray-600">{formData.title}</p>
            <p className="text-gray-600">{formData.department}</p>
            {isEditing && (
              <p className="text-sm text-gray-500 mt-2">Click the camera icon to upload a new photo</p>
            )}
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
          <div>
            <Label htmlFor="officeLocation">Office Location</Label>
            <Input
              id="officeLocation"
              name="officeLocation"
              value={formData.officeLocation}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
          <div>
            <Label htmlFor="personalWebsite">Personal Website</Label>
            <Input
              id="personalWebsite"
              name="personalWebsite"
              value={formData.personalWebsite}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
            />
          </div>
        </div>
      </Card>

      {/* Bio & Research */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Biography & Research</h2>
        
        {/* AI Suggestion Banner */}
        {aiSuggestion.type && (
          <Alert className="mb-4 border-2 border-[#ffd100] bg-yellow-50">
            <Sparkles className="h-4 w-4 text-[#8b0000]" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-semibold text-[#8b0000]">
                  AI-Generated {aiSuggestion.type === 'bio' ? 'Biography' : 'Research Interests'}
                </p>
                <p className="text-sm text-gray-700">{aiSuggestion.content}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={acceptAISuggestion}
                    size="sm"
                    className="bg-[#8b0000] hover:bg-[#700000]"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={rejectAISuggestion}
                    size="sm"
                    variant="outline"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="bio">Biography</Label>
              {isEditing && (
                <Button
                  onClick={generateAIBio}
                  size="sm"
                  variant="outline"
                  disabled={isGeneratingBio}
                  className="text-[#8b0000] border-[#8b0000] hover:bg-[#8b0000] hover:text-white"
                >
                  {isGeneratingBio ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`min-h-[100px] ${!isEditing ? "bg-gray-50" : ""}`}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="researchInterests">Research Interests</Label>
              {isEditing && (
                <Button
                  onClick={generateAIResearchInterests}
                  size="sm"
                  variant="outline"
                  disabled={isGeneratingResearch}
                  className="text-[#8b0000] border-[#8b0000] hover:bg-[#8b0000] hover:text-white"
                >
                  {isGeneratingResearch ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              id="researchInterests"
              name="researchInterests"
              value={formData.researchInterests}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50" : ""}
              placeholder="Separate interests with commas"
            />
          </div>
        </div>
      </Card>

      {/* Qualifications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Qualifications & Education</h2>
          {isEditing && (
            <Button
              onClick={() => setShowAddQualification(true)}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Qualification
            </Button>
          )}
        </div>

        {showAddQualification && (
          <Card className="p-4 mb-4 border-2 border-[#8b0000]">
            <h3 className="font-semibold mb-3">Add New Qualification</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="new-degree">Degree</Label>
                <Input
                  id="new-degree"
                  value={newQualification.degree}
                  onChange={(e) => setNewQualification(prev => ({ ...prev, degree: e.target.value }))}
                  placeholder="e.g., Ph.D. in Computer Science"
                />
              </div>
              <div>
                <Label htmlFor="new-institution">Institution</Label>
                <Input
                  id="new-institution"
                  value={newQualification.institution}
                  onChange={(e) => setNewQualification(prev => ({ ...prev, institution: e.target.value }))}
                  placeholder="e.g., University of Maryland"
                />
              </div>
              <div>
                <Label htmlFor="new-year">Year</Label>
                <Input
                  id="new-year"
                  value={newQualification.year}
                  onChange={(e) => setNewQualification(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="e.g., 2015"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddQualification} size="sm">
                  Add Qualification
                </Button>
                <Button
                  onClick={() => {
                    setShowAddQualification(false);
                    setNewQualification({ degree: "", institution: "", year: "" });
                  }}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {qualifications.map((qual) => (
            <div
              key={qual.id}
              className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{qual.degree}</h3>
                <p className="text-gray-600">{qual.institution}</p>
                <Badge variant="secondary" className="mt-1">{qual.year}</Badge>
              </div>
              {isEditing && (
                <Button
                  onClick={() => handleDeleteQualification(qual.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Keywords */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Keywords</h2>
          {isEditing && (
            <Button
              onClick={generateAIKeywords}
              size="sm"
              variant="outline"
              disabled={isGeneratingKeywords}
              className="text-[#8b0000] border-[#8b0000] hover:bg-[#8b0000] hover:text-white"
            >
              {isGeneratingKeywords ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
          )}
        </div>

        {aiGeneratedKeywords.length > 0 && (
          <Alert className="mb-4 border-2 border-[#ffd100] bg-yellow-50">
            <Sparkles className="h-4 w-4 text-[#8b0000]" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-semibold text-[#8b0000]">
                  AI-Generated Keywords
                </p>
                <p className="text-sm text-gray-700">
                  {aiGeneratedKeywords.join(', ')}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={acceptAIKeywords}
                    size="sm"
                    className="bg-[#8b0000] hover:bg-[#700000]"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={rejectAIKeywords}
                    size="sm"
                    variant="outline"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div>
            <Label htmlFor="newKeyword">Add Keyword</Label>
            <div className="flex items-center">
              <Input
                id="newKeyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="e.g., Machine Learning"
                className="flex-1"
              />
              <Button
                onClick={handleAddKeyword}
                size="sm"
                className="ml-2"
              >
                Add
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleDeleteKeyword(keyword)}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Completion Widget */}
      <ProfileCompletionWidget
        profilePhoto={profilePhoto}
        formData={formData}
        qualifications={qualifications}
        keywords={keywords}
      />
    </div>
  );
}