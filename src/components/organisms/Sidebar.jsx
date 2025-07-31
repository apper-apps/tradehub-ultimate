import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/events", label: "Events", icon: "Calendar" },
    { path: "/blog", label: "Blog", icon: "FileText" },
    { path: "/news", label: "News", icon: "Newspaper" },
    { path: "/updates", label: "Updates", icon: "Bell" },
    { path: "/files", label: "Files", icon: "FolderOpen" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={cn(
      "hidden lg:flex h-full flex-col glass-card border-r border-slate-600 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-slate-600">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold gradient-text">TradeHub Pro</h1>
              <p className="text-sm text-gray-400">Content Management</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-750 transition-colors"
          >
            <ApperIcon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              className="h-4 w-4 text-gray-400" 
            />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
              isActive(item.path)
                ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-300 border border-primary-500/30"
                : "text-gray-400 hover:text-white hover:bg-slate-750/50"
            )}
          >
            <ApperIcon name={item.icon} className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
            {isActive(item.path) && !isCollapsed && (
              <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full animate-glow"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-600">
          <div className="text-xs text-gray-500 text-center">
            © 2024 TradeHub Pro
          </div>
        </div>
      )}
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "lg:hidden fixed left-0 top-0 h-full w-64 glass-card border-r border-slate-600 z-50 transition-transform duration-300",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold gradient-text">TradeHub Pro</h1>
              <p className="text-sm text-gray-400">Content Management</p>
            </div>
            <button
              onClick={onMobileClose}
              className="p-2 rounded-lg hover:bg-slate-750 transition-colors"
            >
              <ApperIcon name="X" className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive(item.path)
                  ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-300 border border-primary-500/30"
                  : "text-gray-400 hover:text-white hover:bg-slate-750/50"
              )}
            >
              <ApperIcon name={item.icon} className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && (
                <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full animate-glow"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-600">
          <div className="text-xs text-gray-500 text-center">
            © 2024 TradeHub Pro
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;