export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  category: "Team" | "Billing" | "Security" | "System";
}

class NotificationService {
  private notifications: Notification[] = [
    {
      id: 1,
      title: "New team member joined",
      description: "Sarah Jenkins has joined the Design team as a Senior Researcher.",
      time: "2 minutes ago",
      unread: true,
      category: "Team"
    },
    {
      id: 2,
      title: "Payment successful",
      description: "Your subscription for the Pro plan has been renewed successfully.",
      time: "1 hour ago",
      unread: true,
      category: "Billing"
    },
    {
      id: 3,
      title: "Security password changed",
      description: "Your account password was updated from a new device in San Francisco.",
      time: "3 hours ago",
      unread: false,
      category: "Security"
    },
    {
      id: 4,
      title: "System Maintenance",
      description: "Scheduled maintenance will occur this Sunday between 2:00 AM and 4:00 AM UTC.",
      time: "5 hours ago",
      unread: false,
      category: "System"
    }
  ];

  async getNotifications(): Promise<Notification[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.notifications]), 300);
    });
  }

  async markAsRead(id: number): Promise<void> {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    );
  }

  async markAllAsRead(): Promise<void> {
    this.notifications = this.notifications.map(n => ({ ...n, unread: false }));
  }

  async deleteNotification(id: number): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => n.unread).length;
  }
}

export const notificationService = new NotificationService();
