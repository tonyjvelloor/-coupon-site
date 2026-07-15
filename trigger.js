fetch("http://localhost:3000/api/cron/run-imports").then(r => r.json()).then(console.log).catch(console.error);
