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
import newsService from "@/services/api/newsService";
import { format } from "date-fns";

const News = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = await newsService.getAll();
      setNews(data);
      setFilteredNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = news.filter(item =>
      item.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNews(filtered);
  };

  const handleEdit = (newsItem) => {
    navigate(`/news/edit/${newsItem.Id}`);
  };

  const handleDelete = async (newsItem) => {
    if (window.confirm(`Are you sure you want to delete "${newsItem.headline}"?`)) {
      try {
        await newsService.delete(newsItem.Id);
        await loadNews();
        toast.success("News item deleted successfully");
      } catch (err) {
        toast.error("Failed to delete news item");
      }
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const columns = [
    {
      key: "headline",
      label: "Headline",
      sortable: true,
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (priority) => (
        <Badge variant={getPriorityBadgeVariant(priority)}>
          {priority}
        </Badge>
      )
    },
    {
      key: "attachments",
      label: "Media",
      render: (attachments) => (
        <div className="flex items-center gap-1">
          <ApperIcon name="Image" className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{attachments?.length || 0}</span>
        </div>
      )
    },
    {
      key: "createdAt",
      label: "Published",
      sortable: true,
      type: "date",
      render: (value) => format(new Date(value), "MMM d, h:mm a")
    }
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadNews} />;
  }

  if (news.length === 0) {
    return (
      <Empty
        title="No news items found"
        description="Start sharing important news and announcements with your trade organization members."
        icon="Newspaper"
        action={() => navigate("/news/new")}
        actionLabel="Create News Item"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">News Management</h1>
          <p className="text-gray-400 mt-1">Share important news and announcements with your members</p>
        </div>
        <Button onClick={() => navigate("/news/new")}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create News
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search news by headline or content..."
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

      {/* News Table */}
      {filteredNews.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <ApperIcon name="Search" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No matching news</h3>
          <p className="text-gray-400">Try adjusting your search criteria or create a new news item.</p>
        </div>
      ) : (
        <DataTable
          data={filteredNews}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default News;