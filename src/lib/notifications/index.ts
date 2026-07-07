import { prisma } from "@/lib/db";

export type NotificationLevel = "INFO" | "WARNING" | "ERROR" | "SUCCESS";

export interface NotificationPayload {
  title: string;
  message: string;
  level?: NotificationLevel;
  source?: string;
  link?: string;
}

export interface NotificationService {
  notify(payload: NotificationPayload): Promise<void>;
}

export class InAppNotifier implements NotificationService {
  async notify(payload: NotificationPayload): Promise<void> {
    try {
      await prisma.adminNotification.create({
        data: {
          title: payload.title,
          message: payload.message,
          level: payload.level || "INFO",
          source: payload.source || "system",
          link: payload.link,
        }
      });
    } catch (e) {
      console.error("Failed to create in-app notification:", e);
    }
  }
}

export class SlackNotifier implements NotificationService {
  async notify(payload: NotificationPayload): Promise<void> {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) return;

    try {
      const emoji = this.getEmoji(payload.level);
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `${emoji} *${payload.title}*\n${payload.message}${payload.link ? `\n<${payload.link}|View details>` : ''}`
        })
      });
    } catch (e) {
      console.error("Failed to send Slack notification:", e);
    }
  }

  private getEmoji(level?: NotificationLevel): string {
    switch (level) {
      case "ERROR": return "🚨";
      case "WARNING": return "⚠️";
      case "SUCCESS": return "✅";
      default: return "ℹ️";
    }
  }
}

/**
 * Composite notifier that sends to multiple destinations
 */
export class NotificationEngine implements NotificationService {
  private notifiers: NotificationService[] = [];

  constructor() {
    this.notifiers.push(new InAppNotifier());
    if (process.env.SLACK_WEBHOOK_URL) {
      this.notifiers.push(new SlackNotifier());
    }
  }

  async notify(payload: NotificationPayload): Promise<void> {
    await Promise.allSettled(this.notifiers.map(n => n.notify(payload)));
  }
}

export const notificationEngine = new NotificationEngine();
