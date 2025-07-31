import { useState, useCallback } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FileUpload = ({ onFileSelect, accept = "*", multiple = false, className }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFileSelect?.(multiple ? files : files[0]);
  }, [onFileSelect, multiple]);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    onFileSelect?.(multiple ? files : files[0]);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
          isDragOver
            ? "border-primary-500 bg-primary-500/10"
            : "border-slate-600 hover:border-slate-500"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-750 flex items-center justify-center">
            <ApperIcon name="Upload" className="h-6 w-6 text-primary-400" />
          </div>
          <div className="space-y-2">
            <p className="text-white font-medium">Drop files here or click to upload</p>
            <p className="text-sm text-gray-400">
              {multiple ? "Upload multiple files" : "Upload a file"}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <ApperIcon name="FolderOpen" className="h-4 w-4 mr-2" />
            Browse Files
          </Button>
        </div>
      </div>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="hidden">
        Upload File
      </label>
    </div>
  );
};

export default FileUpload;