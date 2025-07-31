import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/molecules/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import updatesService from "@/services/api/updatesService";
import { format } from "date-fns";

const Updates = () => {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = await updatesService.getAll();
      setUpdates(data);
      setFilteredUpdates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpdates();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = updates.filter(update =>
      update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUpdates(filtered);
  };

  const handleEdit = (update) => {
    navigate(`/updates/edit/${update.Id}`);
  };

  const handleDelete = async (update) => {
    if (window.confirm(`Are you sure you want to delete "${update.title}"?`)) {
      try {
        await updatesService.delete(update.Id);
        await loadUpdates();
        toast.success("Update deleted successfully");
      } catch (err) {
        toast.error("Failed to delete update");
      }
    }
  };

  const getTypeBadgeVariant = (type) => {
    switch (type.toLowerCase()) {
      case "announcement": return "info";
      case "alert": return "error";
      case "reminder": return "warning";
      case "general": return "success";
      default: return "default";
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (type) => (
        <Badge variant={getTypeBadgeVariant(type)}>
          {type}
        </Badge>
      )
    },
    {
      key: "message",
      label: "Message",
      render: (message) => (
        <p className="text-sm text-gray-300 truncate max-w-xs">
          {message.substring(0, 50)}...
        </p>
      )
    },
    {
      key: "attachments",
      label: "Files",
      render: (attachments) => (
        <div className="flex items-center gap-1">
          <ApperIcon name="Paperclip" className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{attachments?.length || 0}</span>
        </div>
      )
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      type: "date",
      render: (value) => format(new Date(value), "MMM d, h:mm a")
    }
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadUpdates} />;
  }

  if (updates.length === 0) {
    return (
      <Empty
        title="No updates found"
        description="Keep your trade organization members informed with regular updates and announcements."
        icon="Bell"
        action={() => navigate("/updates/new")}
        actionLabel="Create Update"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Updates Management</h1>
          <p className="text-gray-400 mt-1">Keep members informed with updates and announcements</p>
        </div>
        <Button onClick={() => navigate("/updates/new")}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Update
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search updates by title, message, or type..."
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Updates Table */}
      {filteredUpdates.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <ApperIcon name="Search" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No matching updates</h3>
          <p className="text-gray-400">Try adjusting your search criteria or create a new update.</p>
        </div>
      ) : (
        <DataTable
          data={filteredUpdates}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Updates;