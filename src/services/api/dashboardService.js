import statsData from "@/services/mockData/stats.json";
import activityData from "@/services/mockData/activity.json";

const dashboardService = {
  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...statsData];
  },

  async getRecentActivity() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...activityData];
  }
};

export default dashboardService;