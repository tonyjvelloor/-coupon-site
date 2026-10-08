import 'dotenv/config';

const KEY = "6d4c97b00f904f008ab1f87f8990aadc";
const SITE_URL = "https://www.couponhub.store";

const urlsToPing = [
  `${SITE_URL}/`,
  `${SITE_URL}/blog`,
  `${SITE_URL}/blog/off-duty-india-coupon-guide`,
  `${SITE_URL}/blog/diwali-2026-coupon-codes-shopping-guide`,
  `${SITE_URL}/blog/wellbeing-nutrition-coupon-guide`,
  `${SITE_URL}/blog/myntra-vs-ajio-which-is-better-for-deals`,
  `${SITE_URL}/blog/how-to-stack-zomato-swiggy-discounts`,
  `${SITE_URL}/stores/off-duty`,
  `${SITE_URL}/stores/wellbeing-nutrition`,
  `${SITE_URL}/stores/the-derma-co`,
  `${SITE_URL}/stores/plum-goodness`,
  `${SITE_URL}/stores/jockey`,
  `${SITE_URL}/stores/shopsy`,
  `${SITE_URL}/events/diwali-sale-2026`,
  `${SITE_URL}/events/great-indian-festival-2026`,
  `${SITE_URL}/events/big-billion-days-2026`,
  `${SITE_URL}/events/end-of-reason-sale-2026`,
  `${SITE_URL}/events/christmas-sale-india-2026`,
  `${SITE_URL}/compare/amazon-vs-flipkart`,
  `${SITE_URL}/compare/myntra-vs-ajio`,
  `${SITE_URL}/compare/zomato-vs-swiggy`,
  `${SITE_URL}/compare/healthkart-vs-wellbeing-nutrition`,
];

async function submitIndexNow() {
  const payload = {
    host: "www.couponhub.store",
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList: urlsToPing,
  };

  console.log(`Submitting ${urlsToPing.length} URLs to IndexNow...`);
  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      console.log(`${endpoint} -> HTTP ${res.status} (${res.statusText})`);
    } catch (e: any) {
      console.error(`Error pinging ${endpoint}:`, e.message);
    }
  }
}

submitIndexNow();
