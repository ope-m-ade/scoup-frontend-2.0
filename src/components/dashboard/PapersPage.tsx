import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Plus, Edit2, Trash2, X, Save, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi: string;
  abstract: string;
  keywords: string[];
  status: "published" | "in-review" | "draft";
}

export function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Paper, "id">>({
    title: "",
    authors: "",
    journal: "",
    year: "",
    doi: "",
    abstract: "",
    keywords: [],
    status: "draft"
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [aiGeneratedKeywords, setAiGeneratedKeywords] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      title: "",
      authors: "",
      journal: "",
      year: "",
      doi: "",
      abstract: "",
      keywords: [],
      status: "draft"
    });
  };

  const handleEdit = (paper: Paper) => {
    setEditingId(paper.id);
    setFormData({
      title: paper.title,
      authors: paper.authors,
      journal: paper.journal,
      year: paper.year,
      doi: paper.doi,
      abstract: paper.abstract,
      keywords: paper.keywords,
      status: paper.status
    });
  };

  const handleSave = () => {
    if (editingId) {
      setPapers(prev => prev.map(p => 
        p.id === editingId ? { ...formData, id: editingId } : p
      ));
      setEditingId(null);
    } else {
      setPapers(prev => [...prev, { ...formData, id: Date.now().toString() }]);
      setIsAdding(false);
    }
    setFormData({
      title: "",
      authors: "",
      journal: "",
      year: "",
      doi: "",
      abstract: "",
      keywords: [],
      status: "draft"
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: "",
      authors: "",
      journal: "",
      year: "",
      doi: "",
      abstract: "",
      keywords: [],
      status: "draft"
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this paper?")) {
      setPapers(prev => prev.filter(p => p.id !== id));
    }
  };

  const getStatusColor = (status: Paper["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "in-review":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
    }
  };

  const generateAIKeywords = async () => {
    setIsGeneratingKeywords(true);
    setAiGeneratedKeywords([]);

    // Simulate AI generation with delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate keywords based on title and abstract
    const title = formData.title.toLowerCase();
    const abstract = formData.abstract.toLowerCase();
    const combined = `${title} ${abstract}`;
    
    let generatedKeywords: string[] = [];
    
    // Simple keyword extraction logic (in real app, this would be AI-powered)
    if (combined.includes('machine learning') || combined.includes('ai') || combined.includes('artificial intelligence')) {
      generatedKeywords = ["Machine Learning", "Artificial Intelligence", "Neural Networks", "Deep Learning", "Data Science"];
    } else if (combined.includes('biology') || combined.includes('genetics') || combined.includes('molecular')) {
      generatedKeywords = ["Molecular Biology", "Genetics", "Biotechnology", "Cell Biology", "Genomics"];
    } else if (combined.includes('education') || combined.includes('learning') || combined.includes('teaching')) {
      generatedKeywords = ["Education", "Pedagogy", "Learning", "Curriculum", "Assessment"];
    } else if (combined.includes('business') || combined.includes('management') || combined.includes('organization')) {
      generatedKeywords = ["Business Management", "Strategy", "Organization", "Leadership", "Innovation"];
    } else if (combined.includes('engineering') || combined.includes('design') || combined.includes('systems')) {
      generatedKeywords = ["Engineering", "Systems Design", "Innovation", "Technology", "Applied Research"];
    } else {
      // Default keywords based on common academic terms
      generatedKeywords = ["Research", "Analysis", "Methodology", "Innovation", "Applied Science"];
    }

    setAiGeneratedKeywords(generatedKeywords);
    setIsGeneratingKeywords(false);
  };

  const acceptAIKeywords = () => {
    setFormData(prev => ({ ...prev, keywords: aiGeneratedKeywords }));
    setAiGeneratedKeywords([]);
  };

  const rejectAIKeywords = () => {
    setAiGeneratedKeywords([]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Papers</h1>
          <p className="text-gray-600 mt-1">Manage your research publications</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={handleAdd} className="bg-[#8b0000] hover:bg-[#700000]">
            <Plus className="w-4 h-4 mr-2" />
            Add Paper
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="p-6 border-2 border-[#8b0000]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Paper" : "Add New Paper"}
            </h2>
            <Button onClick={handleCancel} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Paper title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authors">Authors *</Label>
                <Input
                  id="authors"
                  name="authors"
                  value={formData.authors}
                  onChange={handleInputChange}
                  placeholder="Comma-separated list of authors"
                />
              </div>
              <div>
                <Label htmlFor="journal">Journal/Conference *</Label>
                <Input
                  id="journal"
                  name="journal"
                  value={formData.journal}
                  onChange={handleInputChange}
                  placeholder="Publication venue"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="2024"
                />
              </div>
              <div>
                <Label htmlFor="doi">DOI</Label>
                <Input
                  id="doi"
                  name="doi"
                  value={formData.doi}
                  onChange={handleInputChange}
                  placeholder="10.xxxx/xxxxx"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="draft">Draft</option>
                  <option value="in-review">In Review</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                placeholder="Paper abstract"
                className="min-h-[100px]"
              />
            </div>

            {/* AI Keywords Generation Banner */}
            {aiGeneratedKeywords.length > 0 && (
              <Alert className="border-2 border-[#ffd100] bg-yellow-50">
                <Sparkles className="h-4 w-4 text-[#8b0000]" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-semibold text-[#8b0000]">
                      AI-Generated Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aiGeneratedKeywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Button
                  onClick={generateAIKeywords}
                  size="sm"
                  variant="outline"
                  disabled={isGeneratingKeywords || !formData.title || !formData.abstract}
                  className="text-[#8b0000] border-[#8b0000] hover:bg-[#8b0000] hover:text-white"
                  type="button"
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
              </div>
              <div className="flex gap-2 mb-2">
                <Input
                  id="keywords"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                  placeholder="Add keyword and press Enter"
                />
                <Button onClick={handleAddKeyword} size="sm" type="button">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="gap-1">
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Paper
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Papers List */}
      <div className="space-y-4">
        {papers.map((paper) => (
          <Card key={paper.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    {paper.title}
                  </h3>
                  <Badge className={getStatusColor(paper.status)}>
                    {paper.status}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-2">{paper.authors}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                  <span>{paper.journal}</span>
                  <span>•</span>
                  <span>{paper.year}</span>
                  {paper.doi && (
                    <>
                      <span>•</span>
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8b0000] hover:underline flex items-center gap-1"
                      >
                        {paper.doi}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  )}
                </div>

                <p className="text-gray-700 mb-3">{paper.abstract}</p>

                <div className="flex flex-wrap gap-2">
                  {paper.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {!isAdding && !editingId && (
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(paper)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(paper.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}

        {papers.length === 0 && !isAdding && (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No papers added yet. Click "Add Paper" to get started.</p>
          </Card>
        )}
      </div>
    </div>
  );
}