import { prisma } from "@/lib/db";
import { notificationEngine } from "@/lib/notifications";
import { logger } from "@/lib/logger";
import { startOfDay, subDays } from "date-fns";

export class AnomalyDetector {
  async runDailyChecks() {
    logger.info("Starting Daily Anomaly Detection");
    
    await this.checkAutomationRate();
    await this.checkQueueBackups();
    await this.checkResolverAccuracy();
    
    logger.info("Completed Daily Anomaly Detection");
  }

  private async checkAutomationRate() {
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);
    
    const recentJobs = await prisma.importJob.findMany({
      where: { startedAt: { gte: yesterday } },
      select: { totalRows: true, validRows: true }
    });

    let total = 0;
    let valid = 0;
    recentJobs.forEach(job => {
      total += job.totalRows;
      valid += job.validRows;
    });

    if (total > 0) {
      const rate = valid / total;
      logger.info({ rate, total }, "Daily Automation Rate");
      
      if (rate < 0.6) { // If less than 60% of imported rows are passing validation
        await notificationEngine.notify({
          title: "Anomaly Detected: Low Automation Rate",
          message: `The import automation rate dropped to ${(rate * 100).toFixed(1)}% yesterday. Check the validation rules.`,
          level: "ERROR",
          source: "anomaly-detector",
          link: "/admin/import-jobs"
        });
      }
    }
  }

  private async checkQueueBackups() {
    // Check if tasks are stuck in PENDING for more than 24 hours
    const yesterday = subDays(new Date(), 1);
    
    const stuckTasks = await prisma.intelligenceTask.count({
      where: {
        status: "PENDING",
        startedAt: { lte: yesterday }
      }
    });

    if (stuckTasks > 50) {
      await notificationEngine.notify({
        title: "Anomaly Detected: Intelligence Queue Backup",
        message: `There are ${stuckTasks} Intelligence Tasks that have been pending for > 24 hours. Are the workers running?`,
        level: "ERROR",
        source: "anomaly-detector",
        link: "/admin/intelligence"
      });
    }
  }

  private async checkResolverAccuracy() {
    // Check if auto-learning is creating too many generic aliases
    // For now, just logging
    logger.info("Checked Resolver Accuracy");
  }
}
