# CouponHub Chrome Extension

This is the prototype for the CouponHub browser extension. It automatically detects when a user is shopping on supported merchants (Amazon, Flipkart, Myntra) and displays a floating widget to apply active deals and track cashback.

## How to Install in Chrome

1. Open Google Chrome.
2. Type `chrome://extensions/` in the address bar and press Enter.
3. Turn on **Developer mode** (toggle switch in the top right corner).
4. Click the **Load unpacked** button in the top left.
5. Select this folder: `/Users/tonyvelloor/Documents/antigravity/coupon-site/extension`
6. The extension is now installed! Pin it to your toolbar.

## How to Test
1. Visit [amazon.in](https://www.amazon.in) or [flipkart.com](https://www.flipkart.com).
2. Within a second, you should see the CouponHub widget slide in from the top right!
3. Click the extension icon in your Chrome toolbar to see the popup UI.

## Next Steps for Production
- Add real API endpoints to `background.js` to fetch live coupons from the main CouponHub Next.js database.
- Add logic to drop the affiliate cookie (using `chrome.cookies.set`) or trigger an invisible `/out` redirect when the user clicks "Apply Coupons".
- Add the `icons/` folder with proper brand assets.
