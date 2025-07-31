import { cn } from "@/utils/cn";

const Loading = ({ className, type = "page" }) => {
  if (type === "card") {
    return (
      <div className={cn("glass-card rounded-xl overflow-hidden animate-pulse", className)}>
        <div className="p-6 space-y-4">
          <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded"></div>
            <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={cn("glass-card rounded-xl overflow-hidden", className)}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4">
                  <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-700 animate-spin border-t-primary-500"></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-secondary-500 animate-spin animate-glow"></div>
      </div>
    </div>
  );
};

export default Loading;