import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FileUpload from "@/components/molecules/FileUpload";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import filesService from "@/services/api/filesService";
import { format } from "date-fns";

const Files = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = await filesService.getAll();
      setFiles(data);
      setFilteredFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = files.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFiles(filtered);
  };

  const handleFileUpload = async (uploadedFiles) => {
    try {
      setUploading(true);
      
      const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      for (const file of fileArray) {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          category: getFileCategory(file.type),
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString()
        };
        
        await filesService.create(fileData);
      }
      
      await loadFiles();
      toast.success(`${fileArray.length} file(s) uploaded successfully`);
    } catch (err) {
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (file) => {
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      try {
        await filesService.delete(file.Id);
        await loadFiles();
        toast.success("File deleted successfully");
      } catch (err) {
        toast.error("Failed to delete file");
      }
    }
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${file.name}`);
  };

  const getFileCategory = (mimeType) => {
    if (mimeType.startsWith("image/")) return "Image";
    if (mimeType.startsWith("video/")) return "Video";
    if (mimeType.startsWith("audio/")) return "Audio";
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("word") || mimeType.includes("document")) return "Document";
    if (mimeType.includes("sheet") || mimeType.includes("excel")) return "Spreadsheet";
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "Presentation";
    return "Other";
  };

  const getFileIcon = (category) => {
    switch (category) {
      case "Image": return "Image";
      case "Video": return "Video";
      case "Audio": return "Music";
      case "PDF": return "FileText";
      case "Document": return "FileText";
      case "Spreadsheet": return "Table";
      case "Presentation": return "Presentation";
      default: return "File";
    }
  };

  const getCategoryBadgeVariant = (category) => {
    switch (category) {
      case "Image": return "success";
      case "Video": return "info";
      case "Audio": return "warning";
      case "PDF": return "error";
      case "Document": return "primary";
      default: return "default";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadFiles} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">File Management</h1>
          <p className="text-gray-400 mt-1">Upload and manage files for your trade organization</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            <ApperIcon name={viewMode === "grid" ? "List" : "Grid3X3"} className="h-4 w-4 mr-2" />
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Upload Files</h2>
        <FileUpload
          onFileSelect={handleFileUpload}
          multiple
          accept="*"
        />
        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-primary-400">
            <div className="w-4 h-4 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin"></div>
            <span className="text-sm">Uploading files...</span>
          </div>
        )}
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search files by name or category..."
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </div>
        </div>
      </div>

      {/* Files Display */}
      {files.length === 0 ? (
        <Empty
          title="No files uploaded"
          description="Start by uploading files to share with your trade organization members."
          icon="FolderOpen"
          action={() => document.getElementById("file-upload")?.click()}
          actionLabel="Upload Files"
        />
      ) : filteredFiles.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <ApperIcon name="Search" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No matching files</h3>
          <p className="text-gray-400">Try adjusting your search criteria.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div key={file.Id} className="glass-card rounded-xl p-4 hover:scale-[1.02] transition-all duration-200">
              <div className="flex flex-col gap-3">
                {/* File Icon & Category */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                    <ApperIcon name={getFileIcon(file.category)} className="h-5 w-5 text-primary-400" />
                  </div>
                  <Badge variant={getCategoryBadgeVariant(file.category)} className="text-xs">
                    {file.category}
                  </Badge>
                </div>

                {/* File Details */}
                <div className="flex-1">
                  <h3 className="font-medium text-white truncate" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(file.uploadedAt), "MMM d, yyyy")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                    className="flex-1"
                  >
                    <ApperIcon name="Download" className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-750/50 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Size</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Uploaded</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {filteredFiles.map((file) => (
                  <tr key={file.Id} className="hover:bg-slate-750/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center flex-shrink-0">
                          <ApperIcon name={getFileIcon(file.category)} className="h-4 w-4 text-primary-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{file.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getCategoryBadgeVariant(file.category)}>
                        {file.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {format(new Date(file.uploadedAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(file)}
                        >
                          <ApperIcon name="Download" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(file)}
                          className="text-error hover:text-error hover:bg-error/10"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;