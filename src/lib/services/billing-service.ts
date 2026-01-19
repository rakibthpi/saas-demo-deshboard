export interface Plan {
  id: string;
  name: string;
  description: string;
  price: { monthly: number; yearly: number };
  features: string[];
  popular?: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
}

class BillingService {
  async getPlans(): Promise<Plan[]> {
    return [
      {
        id: "free",
        name: "Free",
        description: "Perfect for exploring our platform.",
        price: { monthly: 0, yearly: 0 },
        features: ["Up to 3 projects", "Basic analytics", "Community support", "1GB storage"],
      },
      {
        id: "pro",
        name: "Pro",
        description: "Best for growing startups and teams.",
        price: { monthly: 19, yearly: 190 },
        features: ["Unlimited projects", "Advanced analytics", "Priority support", "10GB storage", "Custom domains"],
        popular: true
      },
      {
        id: "enterprise",
        name: "Enterprise",
        description: "Advanced features for large organizations.",
        price: { monthly: 49, yearly: 490 },
        features: ["Custom contracts", "SLA guarantees", "Dedicated account manager", "Unlimited storage", "Single Sign-On (SSO)"],
      }
    ];
  }

  async getInvoices(): Promise<Invoice[]> {
    return [
      { id: "INV001", date: "Jan 1, 2026", amount: "$19.00", status: "Paid" },
      { id: "INV002", date: "Dec 1, 2025", amount: "$19.00", status: "Paid" },
      { id: "INV003", date: "Nov 1, 2025", amount: "$19.00", status: "Paid" },
    ];
  }

  async getPaymentMethod() {
    return {
      type: "Visa",
      last4: "4242",
      expiry: "12/28"
    };
  }
}

export const billingService = new BillingService();
