// content.js - Injected into merchant pages

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "MERCHANT_FOUND") {
    // Only show if we haven't already injected the widget
    if (!document.getElementById("couponhub-extension-root")) {
      injectWidget(request.merchant, request.domain);
    }
  }
});

function injectWidget(merchant, domain) {
  const root = document.createElement("div");
  root.id = "couponhub-extension-root";

  // Create the widget HTML
  root.innerHTML = `
    <div class="ch-widget" id="ch-widget">
      <div class="ch-header">
        <h3 class="ch-header-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          CouponHub
        </h3>
        <button class="ch-close-btn" id="ch-close-btn">&times;</button>
      </div>
      <div class="ch-body">
        <div class="ch-cashback-badge">✓ Active: ${merchant.cashback}</div>
        <div class="ch-highlight">${merchant.coupons} Coupons Found!</div>
        <div class="ch-text">We found ${merchant.coupons} working codes for ${merchant.name}. Do you want us to test them automatically?</div>
        <button class="ch-btn" id="ch-apply-btn">Apply Coupons</button>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  // Trigger animation after a short delay
  setTimeout(() => {
    document.getElementById("ch-widget").classList.add("ch-visible");
  }, 500);

  // Add event listeners
  document.getElementById("ch-close-btn").addEventListener("click", () => {
    document.getElementById("ch-widget").classList.remove("ch-visible");
    setTimeout(() => {
      root.remove();
    }, 300);
  });

  document.getElementById("ch-apply-btn").addEventListener("click", () => {
    const btn = document.getElementById("ch-apply-btn");
    btn.innerHTML = "Testing Codes...";
    btn.style.background = "#4f46e5";
    
    // Simulate testing codes
    let count = merchant.coupons;
    const interval = setInterval(() => {
      count--;
      btn.innerHTML = `Testing ${count} codes...`;
      if (count <= 0) {
        clearInterval(interval);
        btn.innerHTML = "Code Applied! Saved ₹450";
        btn.style.background = "#10b981";
        
        // In a real extension, this is where we'd either:
        // 1. Actually inject the coupon into the page's promo code input
        // 2. Or set the affiliate cookie if it wasn't set yet.
      }
    }, 800);
  });
}
