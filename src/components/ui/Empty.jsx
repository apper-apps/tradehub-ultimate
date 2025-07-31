import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Empty = ({ 
  className,
  title = "No items found",
  description = "Get started by creating your first item.",
  icon = "Inbox",
  action,
  actionLabel = "Create New"
}) => {
  return (
    <div className={cn("glass-card rounded-xl p-12 text-center", className)}>
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
          <ApperIcon name={icon} className="h-10 w-10 text-primary-400" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold gradient-text">{title}</h3>
          <p className="text-gray-400 max-w-md">{description}</p>
        </div>
        {action && (
          <Button onClick={action} className="mt-4">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;