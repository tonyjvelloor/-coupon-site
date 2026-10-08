document.addEventListener('DOMContentLoaded', () => {
  // Find out what tab we're on
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const url = tabs[0].url;
    
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      
      const supportedMerchants = {
        "amazon.in": { name: "Amazon", coupons: 5, cashback: "Up to 5%", deals: ["Flat 5% Cashback on Amazon Pay ICICI", "10% off on Fashion"] },
        "flipkart.com": { name: "Flipkart", coupons: 3, cashback: "Flat 2%", deals: ["5% Cashback on Axis Bank Card", "₹500 off on Mobiles"] },
        "myntra.com": { name: "Myntra", coupons: 8, cashback: "Up to 8%", deals: ["₹400 off for New Users", "Flat 70% off on EORS"] }
      };

      const content = document.getElementById('main-content');
      
      if (supportedMerchants[domain]) {
        const m = supportedMerchants[domain];
        
        let html = `
          <div class="merchant-info">
            <h2 class="merchant-name">${m.name}</h2>
            <div class="merchant-cashback">${m.cashback} Cashback Available</div>
          </div>
          <div style="font-size:12px; font-weight:700; color:#6b7280; margin-bottom:8px; text-transform:uppercase;">Top Deals</div>
        `;
        
        m.deals.forEach(deal => {
          html += `
            <div class="deal-card">
              <div class="deal-title">${deal}</div>
              <button class="deal-btn">Apply</button>
            </div>
          `;
        });
        
        content.innerHTML = html;
        
        // Add click handlers
        document.querySelectorAll('.deal-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.target.innerHTML = "Applied ✓";
            e.target.style.background = "#10b981";
          });
        });
        
      } else {
        content.innerHTML = `
          <div class="no-deals">
            <div style="font-size:32px; margin-bottom:12px;">🛍️</div>
            <div style="font-weight:600; margin-bottom:4px;">No deals on this site.</div>
            <div style="font-size:13px;">But we have thousands more on CouponHub!</div>
          </div>
        `;
      }
    } catch (e) {
      document.getElementById('main-content').innerHTML = "Invalid URL";
    }
  });
});
