import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import blogService from "@/services/api/blogService";

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    published: false,
    files: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      loadPost();
    }
  }, [id, isEditing]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const post = await blogService.getById(parseInt(id));
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags.join(", "),
        published: post.published,
        files: post.files || []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Blog title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Blog content is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      setSaving(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      const postData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
        createdAt: isEditing ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        await blogService.update(parseInt(id), postData);
        toast.success("Blog post updated successfully");
      } else {
        await blogService.create(postData);
        toast.success("Blog post created successfully");
      }

      navigate("/blog");
    } catch (err) {
      toast.error(isEditing ? "Failed to update blog post" : "Failed to create blog post");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    const fileData = fileArray.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...fileData]
    }));
    
    toast.success(`${fileArray.length} file(s) attached`);
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPost} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          Back to Blog
        </Button>
        <div>
          <h1 className="text-2xl font-bold gradient-text">
            {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <p className="text-gray-400 mt-1">
            {isEditing ? "Update your blog post content and settings" : "Share insights and updates with your trade organization"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Post Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <FormField
                label="Blog Title"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter blog post title"
                error={errors.title}
              />
            </div>

            <FormField
              label="Category"
              required
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="Enter category"
              error={errors.category}
            />

            <FormField
              label="Tags"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="Enter tags separated by commas"
            />

            <div className="lg:col-span-2">
              <FormField
                label="Content"
                type="textarea"
                required
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write your blog post content here..."
                error={errors.content}
                className="min-h-[200px]"
              />
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => handleInputChange("published", e.target.checked)}
                  className="w-4 h-4 text-primary-500 bg-slate-750 border-slate-600 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-200">
                  Publish immediately
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Uncheck to save as draft
              </p>
            </div>
          </div>
        </div>

        {/* File Attachments */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Media & Attachments</h2>
          
          <div className="space-y-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              multiple
              accept="image/*,application/pdf,.doc,.docx"
            />

            {formData.files.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-200">Attached Files ({formData.files.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-750/50 rounded-lg">
                      <ApperIcon name="File" className="h-4 w-4 text-primary-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-error hover:text-error hover:bg-error/10 flex-shrink-0"
                      >
                        <ApperIcon name="X" className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/blog")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="min-w-[140px]"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <>
                  <ApperIcon name={isEditing ? "Save" : "Plus"} className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Post" : "Create Post"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;