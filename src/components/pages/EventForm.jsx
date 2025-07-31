import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import eventsService from "@/services/api/eventsService";
import { format } from "date-fns";

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    files: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      loadEvent();
    }
  }, [id, isEditing]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const event = await eventsService.getById(parseInt(id));
      setFormData({
        title: event.title,
        description: event.description,
        date: format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"),
        location: event.location,
        files: event.files || []
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
      newErrors.title = "Event title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Event description is required";
    }

    if (!formData.date) {
      newErrors.date = "Event date is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Event location is required";
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

      const eventData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        await eventsService.update(parseInt(id), eventData);
        toast.success("Event updated successfully");
      } else {
        await eventsService.create(eventData);
        toast.success("Event created successfully");
      }

      navigate("/events");
    } catch (err) {
      toast.error(isEditing ? "Failed to update event" : "Failed to create event");
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
    return <Error message={error} onRetry={loadEvent} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/events")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          Back to Events
        </Button>
        <div>
          <h1 className="text-2xl font-bold gradient-text">
            {isEditing ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="text-gray-400 mt-1">
            {isEditing ? "Update event details and attachments" : "Add a new event for your trade organization"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Event Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              label="Event Title"
              required
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter event title"
              error={errors.title}
            />

            <FormField
              label="Event Date & Time"
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              error={errors.date}
            />

            <div className="lg:col-span-2">
              <FormField
                label="Location"
                required
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter event location"
                error={errors.location}
              />
            </div>

            <div className="lg:col-span-2">
              <FormField
                label="Description"
                type="textarea"
                required
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Provide event details and description"
                error={errors.description}
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
              onClick={() => navigate("/events")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="min-w-[120px]"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <>
                  <ApperIcon name={isEditing ? "Save" : "Plus"} className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Event" : "Create Event"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;