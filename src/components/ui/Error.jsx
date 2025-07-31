import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Error = ({ 
  className, 
  message = "Something went wrong", 
  onRetry,
  type = "page" 
}) => {
  if (type === "inline") {
    return (
      <div className={cn("p-4 rounded-lg border border-error/20 bg-error/10", className)}>
        <div className="flex items-center gap-3">
          <ApperIcon name="AlertCircle" className="h-5 w-5 text-error flex-shrink-0" />
          <p className="text-sm text-gray-300">{message}</p>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="ml-auto text-error hover:text-error hover:bg-error/10"
            >
              <ApperIcon name="RefreshCw" className="h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("glass-card rounded-xl p-8 text-center", className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-error" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Error Occurred</h3>
          <p className="text-gray-400 max-w-md">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-2">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;