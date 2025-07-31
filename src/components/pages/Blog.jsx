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
import blogService from "@/services/api/blogService";
import { format } from "date-fns";

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = await blogService.getAll();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPosts(filtered);
  };

  const handleEdit = (post) => {
    navigate(`/blog/edit/${post.Id}`);
  };

  const handleDelete = async (post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await blogService.delete(post.Id);
        await loadPosts();
        toast.success("Blog post deleted successfully");
      } catch (err) {
        toast.error("Failed to delete blog post");
      }
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (value) => (
        <Badge variant="primary">{value}</Badge>
      )
    },
    {
      key: "published",
      label: "Status",
      sortable: true,
      type: "badge",
      render: (published) => (
        <Badge variant={published ? "success" : "warning"}>
          {published ? "Published" : "Draft"}
        </Badge>
      )
    },
    {
      key: "tags",
      label: "Tags",
      render: (tags) => (
        <div className="flex gap-1 flex-wrap">
          {tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="default" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="default" className="text-xs">
              +{tags.length - 2}
            </Badge>
          )}
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
    return <Error message={error} onRetry={loadPosts} />;
  }

  if (posts.length === 0) {
    return (
      <Empty
        title="No blog posts found"
        description="Start creating engaging blog content to share insights with your trade organization members."
        icon="FileText"
        action={() => navigate("/blog/new")}
        actionLabel="Create Blog Post"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Blog Management</h1>
          <p className="text-gray-400 mt-1">Create and manage blog posts for your trade organization</p>
        </div>
        <Button onClick={() => navigate("/blog/new")}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search posts by title, category, or tags..."
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

      {/* Blog Posts Table */}
      {filteredPosts.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <ApperIcon name="Search" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No matching posts</h3>
          <p className="text-gray-400">Try adjusting your search criteria or create a new blog post.</p>
        </div>
      ) : (
        <DataTable
          data={filteredPosts}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Blog;