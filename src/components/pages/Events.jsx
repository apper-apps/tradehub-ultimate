import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/molecules/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import eventsService from "@/services/api/eventsService";
import { format } from "date-fns";

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = await eventsService.getAll();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleEdit = (event) => {
    navigate(`/events/edit/${event.Id}`);
  };

  const handleDelete = async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await eventsService.delete(event.Id);
        await loadEvents();
        toast.success("Event deleted successfully");
      } catch (err) {
        toast.error("Failed to delete event");
      }
    }
  };

  const columns = [
    {
      key: "title",
      label: "Event Title",
      sortable: true,
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      type: "date",
      render: (value) => format(new Date(value), "MMM d, yyyy")
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
    },
    {
      key: "files",
      label: "Attachments",
      render: (files) => (
        <div className="flex items-center gap-1">
          <ApperIcon name="Paperclip" className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{files?.length || 0}</span>
        </div>
      )
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      type: "date",
      render: (value) => format(new Date(value), "MMM d")
    }
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadEvents} />;
  }

  if (events.length === 0) {
    return (
      <Empty
        title="No events found"
        description="Start by creating your first event to engage your trade organization members."
        icon="Calendar"
        action={() => navigate("/events/new")}
        actionLabel="Create Event"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Events Management</h1>
          <p className="text-gray-400 mt-1">Manage and organize trade organization events</p>
        </div>
        <Button onClick={() => navigate("/events/new")}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search events by title or location..."
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

      {/* Events Table */}
      {filteredEvents.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <ApperIcon name="Search" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No matching events</h3>
          <p className="text-gray-400">Try adjusting your search criteria or create a new event.</p>
        </div>
      ) : (
        <DataTable
          data={filteredEvents}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Events;