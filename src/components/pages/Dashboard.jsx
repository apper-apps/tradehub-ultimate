import { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";
import dashboardService from "@/services/api/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const [statsData, activityData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivity()
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Loading key={i} type="card" />
          ))}
        </div>
        <Loading type="table" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "event": return "Calendar";
      case "blog": return "FileText";
      case "news": return "Newspaper";
      case "update": return "Bell";
      case "file": return "FolderOpen";
      default: return "Activity";
    }
  };

  const getActivityBadgeVariant = (type) => {
    switch (type) {
      case "event": return "info";
      case "blog": return "success";
      case "news": return "warning";
      case "update": return "primary";
      case "file": return "default";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Welcome back, Administrator!</h1>
            <p className="text-gray-400 mt-1">Here&apos;s what&apos;s happening with your trade organization today.</p>
          </div>
          <div className="flex gap-3">
            <Button>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Quick Create
            </Button>
            <Button variant="outline">
              <ApperIcon name="BarChart3" className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.Id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.Id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-750/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center flex-shrink-0">
                  <ApperIcon name={getActivityIcon(activity.type)} className="h-4 w-4 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                    <Badge variant={getActivityBadgeVariant(activity.type)} className="flex-shrink-0">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="p-4 h-auto flex-col gap-3 hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                <ApperIcon name="Calendar" className="h-5 w-5 text-primary-400" />
              </div>
              <div className="text-center">
                <p className="font-medium text-white">New Event</p>
                <p className="text-xs text-gray-400">Create event</p>
              </div>
            </Button>

            <Button variant="outline" className="p-4 h-auto flex-col gap-3 hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success/20 to-emerald-500/20 flex items-center justify-center">
                <ApperIcon name="FileText" className="h-5 w-5 text-success" />
              </div>
              <div className="text-center">
                <p className="font-medium text-white">New Blog</p>
                <p className="text-xs text-gray-400">Write post</p>
              </div>
            </Button>

            <Button variant="outline" className="p-4 h-auto flex-col gap-3 hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning/20 to-orange-500/20 flex items-center justify-center">
                <ApperIcon name="Newspaper" className="h-5 w-5 text-warning" />
              </div>
              <div className="text-center">
                <p className="font-medium text-white">News Item</p>
                <p className="text-xs text-gray-400">Share news</p>
              </div>
            </Button>

            <Button variant="outline" className="p-4 h-auto flex-col gap-3 hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-info/20 to-blue-500/20 flex items-center justify-center">
                <ApperIcon name="Bell" className="h-5 w-5 text-info" />
              </div>
              <div className="text-center">
                <p className="font-medium text-white">Update</p>
                <p className="text-xs text-gray-400">Post update</p>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Content Summary */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Content Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg bg-slate-750/30">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center mb-3">
              <ApperIcon name="TrendingUp" className="h-6 w-6 text-primary-400" />
            </div>
            <p className="text-xl font-bold gradient-text">94%</p>
            <p className="text-sm text-gray-400">Content Engagement</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-750/30">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-success/20 to-emerald-500/20 flex items-center justify-center mb-3">
              <ApperIcon name="Users" className="h-6 w-6 text-success" />
            </div>
            <p className="text-xl font-bold text-success">1,247</p>
            <p className="text-sm text-gray-400">Active Members</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-slate-750/30">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-warning/20 to-orange-500/20 flex items-center justify-center mb-3">
              <ApperIcon name="Clock" className="h-6 w-6 text-warning" />
            </div>
            <p className="text-xl font-bold text-warning">3.2 mins</p>
            <p className="text-sm text-gray-400">Avg. Read Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;