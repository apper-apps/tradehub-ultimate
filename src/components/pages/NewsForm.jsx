import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import newsService from "@/services/api/newsService";

const NewsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    headline: "",
    content: "",
    priority: "medium",
    featuredImage: "",
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      loadNewsItem();
    }
  }, [id, isEditing]);

  const loadNewsItem = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newsItem = await newsService.getById(parseInt(id));
      setFormData({
        headline: newsItem.headline,
        content: newsItem.content,
        priority: newsItem.priority,
        featuredImage: newsItem.featuredImage || "",
        attachments: newsItem.attachments || []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.headline.trim()) {
      newErrors.headline = "News headline is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "News content is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority level is required";
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

      const newsData = {
        ...formData,
        createdAt: isEditing ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        await newsService.update(parseInt(id), newsData);
        toast.success("News item updated successfully");
      } else {
        await newsService.create(newsData);
        toast.success("News item created successfully");
      }

      navigate("/news");
    } catch (err) {
      toast.error(isEditing ? "Failed to update news item" : "Failed to create news item");
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
    
    // First file becomes featured image if it's an image
    if (fileArray[0] && fileArray[0].type.startsWith("image/") && !formData.featuredImage) {
      setFormData(prev => ({
        ...prev,
        featuredImage: fileData[0].url,
        attachments: [...prev.attachments, ...fileData]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileData]
      }));
    }
    
    toast.success(`${fileArray.length} file(s) attached`);
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadNewsItem} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/news")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          Back to News
        </Button>
        <div>
          <h1 className="text-2xl font-bold gradient-text">
            {isEditing ? "Edit News Item" : "Create News Item"}
          </h1>
          <p className="text-gray-400 mt-1">
            {isEditing ? "Update news content and priority settings" : "Share important news and announcements with your members"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">News Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <FormField
                label="News Headline"
                required
                value={formData.headline}
                onChange={(e) => handleInputChange("headline", e.target.value)}
                placeholder="Enter news headline"
                error={errors.headline}
              />
            </div>

            <FormField
              label="Priority Level"
              type="select"
              required
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              error={errors.priority}
            >
              <option value="">Select priority</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </FormField>

            <div className="lg:col-span-2">
              <FormField
                label="News Content"
                type="textarea"
                required
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write your news content here..."
                error={errors.content}
                className="min-h-[150px]"
              />
            </div>
          </div>
        </div>

        {/* Media & Attachments */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Media & Attachments</h2>
          
          <div className="space-y-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              multiple
              accept="image/*,application/pdf,.doc,.docx"
            />

            {formData.featuredImage && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-200">Featured Image</h3>
                <div className="flex items-center gap-3 p-3 bg-slate-750/50 rounded-lg">
                  <ApperIcon name="Image" className="h-4 w-4 text-primary-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Featured image set</p>
                    <p className="text-xs text-gray-400">This will be displayed prominently with the news item</p>
                  </div>
                </div>
              </div>
            )}

            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-200">Attachments ({formData.attachments.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {formData.attachments.map((file, index) => (
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
                        onClick={() => removeAttachment(index)}
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
              onClick={() => navigate("/news")}
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
                  {isEditing ? "Update News" : "Create News"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;