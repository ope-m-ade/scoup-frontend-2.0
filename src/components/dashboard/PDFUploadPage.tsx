import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Progress } from "../ui/progress";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  category: "paper" | "patent" | "project";
  status: "processing" | "completed" | "failed";
}

export function PDFUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<"paper" | "patent" | "project">("paper");

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    
    // Check if it's a PDF
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert("Please upload a PDF file");
      return;
    }

    // Simulate upload process
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // Add to uploaded files
          const newFile: UploadedFile = {
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            uploadDate: new Date().toISOString().split('T')[0],
            category: selectedCategory,
            status: "processing"
          };
          
          setUploadedFiles(prev => [newFile, ...prev]);
          
          // Simulate processing completion
          setTimeout(() => {
            setUploadedFiles(prev => prev.map(f => 
              f.id === newFile.id ? { ...f, status: "completed" as const } : f
            ));
          }, 2000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      setUploadedFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const getStatusColor = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "processing":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
    }
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4" />;
      case "processing":
        return <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload PDF</h1>
        <p className="text-gray-600 mt-1">Upload research papers, patent documents, or project files</p>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Upload PDF files of your publications, patents, or project documentation. The system will automatically extract metadata and index the content for search.
        </AlertDescription>
      </Alert>

      {/* Upload Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upload New File</h2>
        
        <div className="mb-4">
          <Label htmlFor="category">Document Category</Label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="paper">Research Paper</option>
            <option value="patent">Patent Document</option>
            <option value="project">Project Documentation</option>
          </select>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? "border-[#8b0000] bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileInput}
            disabled={uploading}
          />
          
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          
          {!uploading ? (
            <>
              <p className="text-lg mb-2">
                <label
                  htmlFor="file-upload"
                  className="text-[#8b0000] hover:text-[#700000] cursor-pointer font-semibold"
                >
                  Click to upload
                </label>
                {" "}or drag and drop
              </p>
              <p className="text-sm text-gray-500">PDF files only (max 50MB)</p>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-lg font-semibold">Uploading...</p>
              <Progress value={uploadProgress} className="w-full max-w-md mx-auto" />
              <p className="text-sm text-gray-500">{uploadProgress}%</p>
            </div>
          )}
        </div>
      </Card>

      {/* Uploaded Files */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
        
        {uploadedFiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No files uploaded yet
          </div>
        ) : (
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-white p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-[#8b0000]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{file.category}</span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 ${getStatusColor(file.status)}`}>
                    {getStatusIcon(file.status)}
                    <span className="text-sm font-semibold capitalize">{file.status}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleDelete(file.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Upload Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Upload PDF files only (maximum size: 50MB)</li>
          <li>Select the appropriate category for automatic categorization</li>
          <li>The system will extract metadata such as title, authors, and abstract</li>
          <li>Files will be indexed for search within SCOUP platform</li>
          <li>Uploaded content will be visible to external stakeholders based on your privacy settings</li>
        </ul>
      </Card>
    </div>
  );
}