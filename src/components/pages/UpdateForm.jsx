import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import updatesService from "@/services/api/updatesService";

const UpdateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general",
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      loadUpdate();
    }
  }, [id, isEditing]);

  const loadUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const update = await updatesService.getById(parseInt(id));
      setFormData({
        title: update.title,
        message: update.message,
        type: update.type,
        attachments: update.attachments || []
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
      newErrors.title = "Update title is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Update message is required";
    }

    if (!formData.type) {
      newErrors.type = "Update type is required";
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

      const updateData = {
        ...formData,
        createdAt: isEditing ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        await updatesService.update(parseInt(id), updateData);
        toast.success("Update updated successfully");
      } else {
        await updatesService.create(updateData);
        toast.success("Update created successfully");
      }

      navigate("/updates");
    } catch (err) {
      toast.error(isEditing ? "Failed to update item" : "Failed to create update");
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
      attachments: [...prev.attachments, ...fileData]
    }));
    
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
    return <Error message={error} onRetry={loadUpdate} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/updates")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          Back to Updates
        </Button>
        <div>
          <h1 className="text-2xl font-bold gradient-text">
            {isEditing ? "Edit Update" : "Create Update"}
          </h1>
          <p className="text-gray-400 mt-1">
            {isEditing ? "Update your organization announcement" : "Share important updates and announcements with your members"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Update Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <FormField
                label="Update Title"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter update title"
                error={errors.title}
              />
            </div>

            <FormField
              label="Update Type"
              type="select"
              required
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              error={errors.type}
            >
              <option value="">Select type</option>
              <option value="general">General Update</option>
              <option value="announcement">Announcement</option>
              <option value="alert">Alert</option>
              <option value="reminder">Reminder</option>
            </FormField>

            <div className="lg:col-span-2">
              <FormField
                label="Update Message"
                type="textarea"
                required
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Write your update message here..."
                error={errors.message}
                className="min-h-[120px]"
              />
            </div>
          </div>
        </div>

        {/* File Attachments */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">File Attachments</h2>
          
          <div className="space-y-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              multiple
              accept="*"
            />

            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-200">Attached Files ({formData.attachments.length})</h3>
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
              onClick={() => navigate("/updates")}
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
                  {isEditing ? "Update Item" : "Create Update"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateForm;