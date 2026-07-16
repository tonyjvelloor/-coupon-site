import { CJConnector } from "../src/lib/import-engine/connectors/cj/index";

async function run() {
  process.env.CJ_API_TOKEN = process.env.CJ_API_TOKEN || "oBah5aUk7nQmabv_JaL0fkxl1w";
  process.env.CJ_WEBSITE_ID = process.env.CJ_WEBSITE_ID || "123";
  
  const connector = new CJConnector();
  
  try {
    await connector.authenticate();
    console.log("Authentication step passed (mocked check).");
    
    // For dry run we'll try to fetch 1 page
    const iter = connector.fetch("1"); // pass cursor "1"
    
    let count = 0;
    for await (const record of iter) {
      count++;
      console.log(`Fetched record ${count}:`, record["link-name"]);
      const normalized = await connector.normalize(record);
      console.log("Normalized:", normalized.title, normalized.discountType);
      
      const validation = connector.validate(normalized);
      console.log("Validation errors:", validation.errors.length);
      
      if (count >= 2) {
        break; // stop early for dry run
      }
    }
    
    const health = await connector.health();
    console.log("Health Stats:", health);
    
  } catch (err: any) {
    console.error("Dry run error:", err.message);
  }
}

run();
