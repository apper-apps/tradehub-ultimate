import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = "up",
  className 
}) => {
  const trendColor = trend === "up" ? "text-success" : "text-error";
  const trendIcon = trend === "up" ? "TrendingUp" : "TrendingDown";

  return (
    <div className={cn("glass-card rounded-xl p-6 hover:scale-[1.02] transition-all duration-200", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold gradient-text">{value}</p>
          {change && (
            <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
              <ApperIcon name={trendIcon} className="h-3 w-3" />
              <span>{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
            <ApperIcon name={icon} className="h-6 w-6 text-primary-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;