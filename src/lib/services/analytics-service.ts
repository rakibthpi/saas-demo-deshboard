export interface StatData {
  title: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
  icon: string;
}

export interface ChartData {
  name: string;
  total: number;
  active: number;
}

export interface SaleData {
  name: string;
  email: string;
  amount: string;
  initial: string;
}

class AnalyticsService {
  async getDashboardStats(): Promise<StatData[]> {
    return [
      { 
        title: "Total Revenue", 
        value: "$45,231.89", 
        trend: "+20.1% from last month", 
        trendType: "up",
        icon: "dollar"
      },
      { 
        title: "Subscriptions", 
        value: "+2,350", 
        trend: "+180.1% from last month", 
        trendType: "up",
        icon: "users"
      },
      { 
        title: "Sales", 
        value: "+12,234", 
        trend: "+19% from last month", 
        trendType: "up",
        icon: "credit-card"
      },
      { 
        title: "Active Now", 
        value: "+573", 
        trend: "+201 since last hour", 
        trendType: "up",
        icon: "activity"
      },
    ];
  }

  async getAnalyticsData(): Promise<ChartData[]> {
    return [
      { name: "Jan", total: 1200, active: 800 },
      { name: "Feb", total: 2100, active: 1200 },
      { name: "Mar", total: 1800, active: 1400 },
      { name: "Apr", total: 2400, active: 1800 },
      { name: "May", total: 3200, active: 2200 },
      { name: "Jun", total: 2800, active: 2400 },
      { name: "Jul", total: 3400, active: 2800 },
    ];
  }

  async getRecentSales(): Promise<SaleData[]> {
    return [
      { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", initial: "OM" },
      { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", initial: "JL" },
      { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", initial: "IN" },
      { name: "William Kim", email: "will@email.com", amount: "+$99.00", initial: "WK" },
      { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", initial: "SD" },
    ];
  }
}

export const analyticsService = new AnalyticsService();
