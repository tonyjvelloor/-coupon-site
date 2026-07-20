import { CJCommissionClient } from "../src/lib/import-engine/connectors/cj/commission-client";

async function run() {
  process.env.CJ_API_TOKEN = process.env.CJ_API_TOKEN || "XKNZfRSdQkrt1bS8H3Hqy89UCQ";
  process.env.CJ_COMPANY_ID = process.env.CJ_COMPANY_ID || "8015859";

  const client = new CJCommissionClient();

  try {
    // Let's test the last 7 days
    const now = new Date();
    const beforePostingDate = now.toISOString();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sincePostingDate = sevenDaysAgo.toISOString();

    console.log(`Fetching commissions from ${sincePostingDate} to ${beforePostingDate}...`);
    
    const result = await client.fetchCommissions(sincePostingDate, beforePostingDate);
    
    console.log("Success! Extracted response:");
    console.log(JSON.stringify(result, null, 2));

  } catch (err: any) {
    console.error("Dry run error:", err.message);
  }
}

run();
