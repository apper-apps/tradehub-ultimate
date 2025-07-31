import { useState } from "react";
import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path.includes("/events")) return "Events Management";
    if (path.includes("/blog")) return "Blog Management";
    if (path.includes("/news")) return "News Management";
    if (path.includes("/updates")) return "Updates Management";
    if (path.includes("/files")) return "File Management";
    return "TradeHub Pro";
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);
    
    if (segments.length === 0) return ["Dashboard"];
    
    const breadcrumbs = ["Dashboard"];
    segments.forEach((segment, index) => {
      const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (segment === "new") {
        breadcrumbs.push("Create New");
      } else if (segment === "edit") {
        breadcrumbs.push("Edit");
      } else {
        breadcrumbs.push(formattedSegment);
      }
    });
    
    return breadcrumbs;
  };

  return (
    <header className="glass-card border-b border-slate-600 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>

          {/* Page Title & Breadcrumbs */}
          <div>
            <h1 className="text-xl font-semibold text-white">{getPageTitle()}</h1>
            <nav className="flex items-center space-x-2 text-sm text-gray-400">
              {getBreadcrumbs().map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <ApperIcon name="ChevronRight" className="h-3 w-3 mx-2" />
                  )}
                  <span className={index === getBreadcrumbs().length - 1 ? "text-primary-400" : ""}>
                    {crumb}
                  </span>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <ApperIcon name="Search" className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-500 rounded-full"></div>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" className="h-4 w-4" />
          </Button>

          {/* Profile */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
              <span className="hidden md:block text-sm">Admin</span>
              <ApperIcon name="ChevronDown" className="h-3 w-3" />
            </Button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-lg shadow-xl border border-slate-600 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-600">
                  <p className="text-sm font-medium text-white">Administrator</p>
                  <p className="text-xs text-gray-400">admin@tradehub.com</p>
                </div>
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-750/50 text-left flex items-center gap-2">
                    <ApperIcon name="User" className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-750/50 text-left flex items-center gap-2">
                    <ApperIcon name="Settings" className="h-4 w-4" />
                    Settings
                  </button>
                  <hr className="my-1 border-slate-600" />
                  <button className="w-full px-4 py-2 text-sm text-error hover:bg-error/10 text-left flex items-center gap-2">
                    <ApperIcon name="LogOut" className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;