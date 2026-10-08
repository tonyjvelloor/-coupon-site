// background.js - Service Worker
const API_BASE = "http://localhost:3000/api/extension"; // Change to production URL later

// Keep track of active tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if the current URL matches a supported merchant
    checkMerchantSupport(tab.url, tabId);
  }
});

async function checkMerchantSupport(url, tabId) {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    
    // In a real scenario, you'd fetch this from your API
    // const response = await fetch(`${API_BASE}/check-domain?domain=${domain}`);
    // const data = await response.json();
    
    // Mock database of supported merchants for the prototype
    const supportedMerchants = {
      "amazon.in": { name: "Amazon", coupons: 5, cashback: "Up to 5%" },
      "flipkart.com": { name: "Flipkart", coupons: 3, cashback: "Flat 2%" },
      "myntra.com": { name: "Myntra", coupons: 8, cashback: "Up to 8%" },
      "ajio.com": { name: "AJIO", coupons: 12, cashback: "Up to 10%" },
      "nykaa.com": { name: "Nykaa", coupons: 4, cashback: "Flat 3%" },
      "swiggy.com": { name: "Swiggy", coupons: 6, cashback: "Up to ₹50" }
    };

    if (supportedMerchants[domain]) {
      // Send a message to the content script to show the UI
      chrome.tabs.sendMessage(tabId, {
        action: "MERCHANT_FOUND",
        merchant: supportedMerchants[domain],
        domain: domain
      });
      
      // Update badge
      chrome.action.setBadgeText({ text: String(supportedMerchants[domain].coupons), tabId });
      chrome.action.setBadgeBackgroundColor({ color: "#10b981", tabId }); // verified-emerald
    } else {
      chrome.action.setBadgeText({ text: "", tabId });
    }
  } catch (err) {
    console.error("CouponHub BG Error:", err);
  }
}
