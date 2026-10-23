import { prisma } from "@/lib/db";

export interface BlogPostData {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    keywords?: string | null;
    isPublished: boolean;
    publishedAt: Date;
    author: {
        name: string;
        profileImage?: string | null;
        bio?: string | null;
    };
}

const AUTHOR_COUPONHUB = {
    name: "CouponHub Deal Experts",
    profileImage: "/images/authors/deal-expert.png",
    bio: "Senior shopping analysts tracking real-time coupon codes, price drops, and affiliate deals across Indian e-commerce.",
};

export const FALLBACK_BLOG_POSTS: BlogPostData[] = [
    // -------------------------------------------------------------
    // 1. DIWALI 2026 MEGA GUIDE (Indian Brands Focus)
    // -------------------------------------------------------------
    {
        id: "post-diwali-mega-guide-2026",
        slug: "diwali-sale-2026-top-offers-indian-brands",
        title: "Diwali Sale 2026: Mega Guide to Top Offers, Verified Coupons & Bank Discounts on Indian Brands",
        excerpt: "The definitive Diwali 2026 shopping guide: curated verified coupon codes for Ajio, Tata CLiQ, Amazon, Flipkart, Biba, Shark Ninja, and IGP with a 3-layer stacking strategy for maximum savings.",
        seoTitle: "Diwali Sale 2026: Best Deals, Verified Coupon Codes & Bank Offers | CouponHub",
        seoDescription: "Discover the biggest Diwali 2026 sales across Amazon, Flipkart, Ajio, Tata CLiQ, Myntra & top Indian brands. Working promo codes, bank credit card discounts & cashback.",
        keywords: "diwali sale 2026,diwali offers 2026,diwali coupon codes,amazon great indian festival,flipkart big billion days,diwali bank offers,indian brands diwali discount,festive deals india",
        isPublished: true,
        publishedAt: new Date("2026-10-22T08:00:00.000Z"),
        author: AUTHOR_COUPONHUB,
        content: `<h2>Diwali 2026 Festive Shopping Timetable</h2>
<p>Diwali 2026 shopping begins early October and builds into a massive surge through Dhanteras, Choti Diwali, and Bhai Dooj. The entire Indian e-commerce ecosystem rolls out festive discounts across electronics, ethnic fashion, jewelry, home decor, and gifts.</p>
<ul>
    <li><strong>Amazon Great Indian Festival (GIF):</strong> Kickstarting mid-October with prime-exclusive early access, exchange bonuses, and 10% instant bank discounts.</li>
    <li><strong>Flipkart Big Billion Days (BBD):</strong> Massive flash sales on smartphones, smart TVs, home appliances, and lifestyle brands.</li>
    <li><strong>Ajio All-Stars Diwali Sale:</strong> 50% to 90% OFF on 5,000+ fashion labels with exclusive stacked coupon codes.</li>
    <li><strong>Tata CLiQ Luxury Festive Fest:</strong> 15% to 60% OFF premium luxury apparel, watches, and beauty with bank card EMI offers.</li>
    <li><strong>Indian Gifts Portal (IGP) Diwali Hub:</strong> Handcrafted Diwali hampers, dry fruits, and gourmet gift boxes from ₹445.</li>
</ul>

<h2>The 3-Layer Stacking Formula for Maximum Diwali Savings</h2>
<p>Never checkout with just the upfront website discount. Savvy Indian shoppers combine three discount tiers on every transaction:</p>
<ol>
    <li><strong>Tier 1 — Platform Festive Markdown (20% – 70% Off):</strong> The standard sale price during Great Indian Festival or Big Billion Days.</li>
    <li><strong>Tier 2 — Brand Promo Code (Extra 5% – 20% Off):</strong> Enter verified platform coupon codes at checkout (e.g. <code>ALLSTARSDIWALI400</code> on Ajio or <code>LUXNEW</code> on Tata CLiQ).</li>
    <li><strong>Tier 3 — Instant Bank Credit Card Discount (10% – 15% Off):</strong> Pay with qualifying cards from HDFC, SBI, ICICI, or Axis Bank to instantly slice another 10% off the final cart total.</li>
</ol>
<p><em>Example:</em> On a ₹10,000 festive ethnic wear cart on Ajio, combining the 50% sale price (₹5,000) with coupon code <code>ALLSTARSDIWALI400</code> (-₹400) and an instant 10% HDFC card offer (-₹460) brings your final spend down to ₹4,140—saving you nearly 60%!</p>

<h2>Verified Live Diwali 2026 Coupon Codes</h2>
<p>Below is our editorial team's verified list of active festive coupons and offers ready to use right now:</p>
<table>
    <thead>
        <tr>
            <th>Brand / Store</th>
            <th>Coupon Code</th>
            <th>Discount Details</th>
            <th>Direct Link</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Ajio Fashion</strong></td>
            <td><code>ALLSTARSDIWALI400</code></td>
            <td>Extra ₹400 OFF on orders + Up to 90% Sale</td>
            <td><a href="/stores/ajio">Claim on Ajio →</a></td>
        </tr>
        <tr>
            <td><strong>Ajio Gram</strong></td>
            <td><code>ALLSTARSDIWALI10</code></td>
            <td>Save 10% on Orders of ₹2,290 or higher</td>
            <td><a href="/stores/ajio">Claim on Ajio →</a></td>
        </tr>
        <tr>
            <td><strong>Tata CLiQ Luxury</strong></td>
            <td><code>LUXNEW</code></td>
            <td>Flat 12% OFF for New Customers</td>
            <td><a href="/stores/tata-cliq">Claim on Tata CLiQ →</a></td>
        </tr>
        <tr>
            <td><strong>Tata CLiQ Luxury</strong></td>
            <td><code>TCLICICIEMI</code></td>
            <td>12% Instant Discount with ICICI Bank Credit Card EMI</td>
            <td><a href="/stores/tata-cliq">Claim on Tata CLiQ →</a></td>
        </tr>
        <tr>
            <td><strong>Shark Ninja India</strong></td>
            <td><code>FESTIVERUSH</code></td>
            <td>10% OFF Up to ₹1,000 + Free Ninja Blast</td>
            <td><a href="/stores/shark-ninja">Claim on Shark Ninja →</a></td>
        </tr>
        <tr>
            <td><strong>Linen Club</strong></td>
            <td><code>FESTIVE10</code></td>
            <td>Extra 10% OFF Festive Linen & Ethnic Apparel</td>
            <td><a href="/stores/linen-club">Claim on Linen Club →</a></td>
        </tr>
        <tr>
            <td><strong>Hamara Mall</strong></td>
            <td><code>FESTIVE55</code></td>
            <td>Flat ₹55 OFF on Lal Sweets Kaju Katli (200g)</td>
            <td><a href="/stores/hamara-mall">Claim on Hamara Mall →</a></td>
        </tr>
        <tr>
            <td><strong>Eternz Jewelry</strong></td>
            <td><code>BUY_1_GET_1_PALMONAS</code></td>
            <td>Buy 1 Get 1 FREE on Palmonas Jewels</td>
            <td><a href="/stores/eternz">Claim on Eternz →</a></td>
        </tr>
    </tbody>
</table>

<h2>Top Indian Brands to Watch This Diwali</h2>
<h3>1. Ethnic Fashion: Biba, Ajio, Suvasa & Myntra</h3>
<p>Diwali is India's prime ethnic wear shopping moment. Biba offers up to 50% off on girls' suit sets and festive anarkalis. Suvasa features handcrafted block-print sarees starting from ₹3,800. Stack these with verified promo codes on CouponHub for the lowest prices of the year.</p>

<h3>2. Electronics & Smartphones: Amazon, Flipkart & Vijay Sales</h3>
<p>Whether upgrading to the latest 5G phone or purchasing 4K Smart TVs and kitchen chimneys for Dhanteras, Vijay Sales and Flipkart run the most aggressive pricing in the country. Look out for exchange bonuses that add ₹3,000 to ₹7,000 on top of your old device's trade-in value.</p>

<h3>3. Festive Hampers, Sweets & Dry Fruits: IGP & Hamara Mall</h3>
<p>Avoid last-minute market rush by ordering curated Diwali hampers online. Indian Gifts Portal (IGP) offers pan-India delivery of gourmet dry fruit boxes, diyas, and silver coins starting from ₹445. Use code <code>FESTIVE55</code> on Hamara Mall for fresh Lal Sweets Kaju Katli.</p>

<h2>Frequently Asked Questions (FAQ)</h2>
<h3>When does the Diwali 2026 Sale start?</h3>
<p>Pre-Diwali sales on Amazon and Flipkart kick off in mid-October 2026. Standalone brand sales on Ajio, Myntra, and Tata CLiQ run throughout October until Bhai Dooj.</p>

<h3>How do I apply coupon codes on Ajio and Amazon?</h3>
<p>On Ajio, add your items to the bag, navigate to the checkout page, and click 'Apply Coupon' to enter codes like <code>ALLSTARSDIWALI400</code>. On Amazon, check the 'Apply Coupon' box on product pages or enter promo codes during payment.</p>

<h3>Can I combine bank discounts with promo codes?</h3>
<p>Yes! Bank card offers (like 10% instant off on HDFC, SBI, or ICICI) apply automatically at payment after promo codes have already lowered your cart total.</p>`,
    },

    // -------------------------------------------------------------
    // 2. AJIO DIWALI SALE 2026
    // -------------------------------------------------------------
    {
        id: "post-ajio-diwali-2026",
        slug: "ajio-diwali-sale-coupon-codes",
        title: "Ajio Diwali Sale 2026: Working Coupon Codes (Up to 90% Off + Extra ₹400 Off)",
        excerpt: "Grab verified Ajio Diwali All-Stars coupon codes: ALLSTARSDIWALI400 for ₹400 off, ALLSTARSDIWALI10 for 10% off, and TREAT for Ajio Luxe. Complete ethnic wear guide.",
        seoTitle: "Ajio Diwali Sale 2026: Working Coupon Codes & Bank Offers | CouponHub",
        seoDescription: "Save up to 90% + extra ₹400 on Ajio All-Stars Diwali Sale 2026. Verified working promo codes: ALLSTARSDIWALI400, ALLSTARSDIWALI10, TREAT, and bank discounts.",
        keywords: "ajio diwali sale 2026,ajio diwali coupon code,ajio promo code diwali,ajio allstars sale 2026,ajio luxe coupons,ajio ethnic wear discount",
        isPublished: true,
        publishedAt: new Date("2026-10-22T10:30:00.000Z"),
        author: AUTHOR_COUPONHUB,
        content: `<h2>Ajio All-Stars Diwali Sale 2026 Overview</h2>
<p>The Ajio All-Stars Diwali Sale is one of the most anticipated fashion events of the festive calendar. With over 1.5 million styles from top national and international brands marked down by 50% to 90%, this is the best time to refresh your festive wardrobe.</p>

<h2>Active Ajio Diwali Promo Codes (Tested & Verified)</h2>
<ul>
    <li><strong><code>ALLSTARSDIWALI400</code>:</strong> Up to 90% OFF + Additional ₹400 discount on qualifying festive orders. <a href="/stores/ajio">Apply code on Ajio →</a></li>
    <li><strong><code>ALLSTARSDIWALI10</code>:</strong> Flat 10% OFF on purchases of ₹2,290 or higher. Great for festive kurtas and family bundles.</li>
    <li><strong><code>ALLSTARSDIWALI5</code>:</strong> Extra 5% OFF on top trending fashion brands with no high minimum order barrier.</li>
    <li><strong><code>TREAT</code>:</strong> Exclusive to Ajio Luxe—enjoy 12% OFF up to ₹1,000 on designer and premium apparel.</li>
    <li><strong><code>SALE10</code>:</strong> Extra 10% discount on festive accessories, footwear, and handbags.</li>
</ul>

<h2>Top Festive Ethnic Wear Picks on Ajio</h2>
<p>Ajio houses some of India's favorite ethnic and occasion-wear labels:</p>
<ul>
    <li><strong>AVAASA Mix N Match:</strong> Festive kurtis starting at ₹399 with vibrant foil prints and embroidery.</li>
    <li><strong>Gulmohar Jaipur:</strong> Pure cotton Anarkalis and Sharara sets with up to 65% markdown.</li>
    <li><strong>W for Woman & Aurelia:</strong> Contemporary ethnic dresses, festive palazzos, and shrugs.</li>
    <li><strong>Men's Kurta Pyjama Sets:</strong> Handcrafted linen and silk blends from Netplay and Dennis Lingo starting at ₹799.</li>
</ul>

<h2>How to Maximize Savings on Ajio</h2>
<ol>
    <li><strong>Use Ajio Wallet & Reliance Points:</strong> If you shop at JioMart or Trends, redeem your Reliance One points directly at checkout.</li>
    <li><strong>Check for Bank Offers:</strong> Ajio frequently partners with ICICI, HDFC, and Federal Bank for an additional 10% instant discount on orders above ₹2,999.</li>
    <li><strong>Combine Free Shipping:</strong> Orders above ₹1,199 automatically qualify for free doorstep delivery across India.</li>
</ol>`,
    },

    // -------------------------------------------------------------
    // 3. DIWALI GIFT HAMPERS & SWEETS
    // -------------------------------------------------------------
    {
        id: "post-diwali-gifts-hampers-2026",
        slug: "best-diwali-gifting-hampers-sweets-offers",
        title: "Best Diwali Gifts, Hampers & Sweets Offers 2026: IGP, Sweets & Festive Jewelry Deals",
        excerpt: "Curated Diwali gift hampers from ₹445, verified discount codes for Lal Sweets Kaju Katli, and Buy 1 Get 1 Free on Palmonas jewelry for family and corporate gifting.",
        seoTitle: "Diwali Gift Hampers & Sweets Offers 2026: Verified Coupons & Deals | CouponHub",
        seoDescription: "Best Diwali gift hampers, dry fruit boxes, Kaju Katli sweets & festive jewelry offers for 2026. Verified coupons for IGP, Hamara Mall, Eternz, and more.",
        keywords: "diwali gift hampers 2026,diwali sweets online offers,igp diwali coupon,diwali corporate gifts discount,diwali jewelry offers,kaju katli online diwali discount",
        isPublished: true,
        publishedAt: new Date("2026-10-22T12:00:00.000Z"),
        author: AUTHOR_COUPONHUB,
        content: `<h2>The 2026 Diwali Gifting Guide</h2>
<p>Gifting is at the very heart of Diwali celebrations in India. Whether you are sending appreciation hampers to corporate clients, surprising relatives across different cities, or picking Dhanteras jewelry for loved ones, here are the best verified deals available online.</p>

<h2>1. Gourmet Diwali Hampers on Indian Gifts Portal (IGP)</h2>
<p>IGP is India's premier gifting portal, offering same-day and scheduled delivery across 400+ cities:</p>
<ul>
    <li><strong>Diwali Hampers Starting from ₹445:</strong> Includes brass diyas, organic incense, roasted dry fruits, and artisanal sweets.</li>
    <li><strong>Premium Dry Fruit Boxes:</strong> Vacuum-sealed California almonds, cashews, and Afghan raisins packaged in reusable ethnic tin boxes.</li>
    <li><strong>Bhai Dooj Puja Hampers:</strong> Roli-chawal kits with designer sweets and gifts.</li>
</ul>
<p><a href="/stores/igp">→ Browse all live IGP Diwali Hampers on CouponHub</a></p>

<h2>2. Authentic Sweets: Kaju Katli & Mithai Deals</h2>
<p>Ordering fresh festive mithai online eliminates long sweet-shop queues. On Hamara Mall, use verified code <strong><code>FESTIVE55</code></strong> to get an instant ₹55 discount on 200g of Lal Sweets Kaju Katli, crafted with pure cashew nuts and silver vark.</p>

<h2>3. Festive Jewelry Offers on Eternz</h2>
<p>Dhanteras and Diwali are the most auspicious times of the year to purchase jewelry. Eternz is running two exclusive festive offers:</p>
<ul>
    <li><strong><code>BUY_1_GET_1_PALMONAS</code>:</strong> Buy 1 Get 1 Free on Palmonas demi-fine jewelry—perfect for festive gifting.</li>
    <li><strong><code>BUY_3_AT_999_SALTY</code>:</strong> Choose any 3 trendy festive earrings, necklaces, or bracelets for just ₹999.</li>
</ul>

<h2>Corporate Gifting Tips for Diwali 2026</h2>
<p>For bulk corporate orders (50+ hampers), both IGP and Ferns N Petals provide customized branding, custom greeting cards, and bulk GST invoices. Place corporate orders by early October to ensure guaranteed delivery prior to Dhanteras.</p>`,
    },

    // -------------------------------------------------------------
    // 4. DIWALI BANK OFFERS & CREDIT CARD STACKING
    // -------------------------------------------------------------
    {
        id: "post-diwali-bank-offers-2026",
        slug: "diwali-2026-bank-offers-credit-card-discounts",
        title: "Diwali 2026 Bank Offers: 10% Instant Discounts on HDFC, SBI, ICICI, Axis Cards",
        excerpt: "How to unlock an extra 10% to 15% instant savings on Amazon, Flipkart, Ajio, and Tata CLiQ by stacking credit and debit card offers this Diwali 2026.",
        seoTitle: "Diwali 2026 Bank Offers: 10% Instant Discounts on Credit Cards | CouponHub",
        seoDescription: "Maximize your Diwali 2026 shopping with instant bank card discounts. Learn how to stack HDFC, SBI, ICICI, and Axis cards on Amazon, Flipkart, Tata CLiQ & Ajio.",
        keywords: "diwali bank offers 2026,amazon hdfc offer diwali,flipkart sbi card offer diwali,icici bank diwali discount,credit card festive offers 2026,debit card emi diwali",
        isPublished: true,
        publishedAt: new Date("2026-10-22T14:15:00.000Z"),
        author: AUTHOR_COUPONHUB,
        content: `<h2>Why Bank Offers Are the Key to Deep Festive Discounts</h2>
<p>During the Diwali festive season, Indian banks partner directly with e-commerce platforms to fund massive 10% instant discounts. Unlike reward points that take months to accumulate, instant bank discounts reduce the payable amount directly at the payment gateway.</p>

<h2>Major Bank Partnerships for Diwali 2026</h2>
<table>
    <thead>
        <tr>
            <th>Bank</th>
            <th>Primary Partner Platforms</th>
            <th>Discount Rate</th>
            <th>Minimum Cart Value</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>HDFC Bank</strong></td>
            <td>Amazon India, Nykaa, Tata CLiQ</td>
            <td>10% Instant Discount (Up to ₹1,500 – ₹5,000)</td>
            <td>₹5,000</td>
        </tr>
        <tr>
            <td><strong>SBI Card</strong></td>
            <td>Flipkart Big Billion Days, Myntra</td>
            <td>10% Instant Discount (Up to ₹1,750 per card)</td>
            <td>₹4,999</td>
        </tr>
        <tr>
            <td><strong>ICICI Bank</strong></td>
            <td>Amazon GIF, Tata CLiQ, Croma</td>
            <td>10% Instant + Extra on No Cost EMI</td>
            <td>₹5,000</td>
        </tr>
        <tr>
            <td><strong>Axis Bank</strong></td>
            <td>Flipkart, Swiggy, Ajio</td>
            <td>10% Instant Discount + 5% on Flipkart Axis</td>
            <td>₹3,000</td>
        </tr>
    </tbody>
</table>

<h2>How to Stack Bank Offers with Store Promo Codes</h2>
<p>Many shoppers mistakenly believe you can only use a promo code OR a bank discount. Here is the step-by-step method to stack both:</p>
<ol>
    <li>Apply your store promo code (e.g. <code>ALLSTARSDIWALI400</code> on Ajio or <code>LUXNEW</code> on Tata CLiQ) in your shopping cart.</li>
    <li>Proceed to the payment page.</li>
    <li>Select Credit/Debit Card and enter your qualifying card details.</li>
    <li>The payment gateway detects your card BIN and automatically applies the 10% instant bank rebate on top of the discounted cart total!</li>
</ol>

<h2>Credit Card EMI vs No-Cost EMI</h2>
<p>For large appliance and smartphone purchases, look for <strong>No Cost EMI</strong> options. Brands and banks absorb the interest component, allowing you to split a ₹60,000 purchase into 6 or 9 monthly installments of ₹10,000 or ₹6,666 without paying a single rupee of extra interest.</p>`,
    },

    // -------------------------------------------------------------
    // 5. DIWALI ELECTRONICS & HOME APPLIANCES SALE
    // -------------------------------------------------------------
    {
        id: "post-diwali-electronics-sale-2026",
        slug: "diwali-electronics-appliances-sale-guide",
        title: "Diwali Electronics & Home Appliances Sale 2026: Best Deals on Mobiles, TVs & Laptops",
        excerpt: "The ultimate electronics buyer's guide for Diwali 2026: smartphone price drops, Vijay Sales festive audio deals, Shark Ninja kitchen appliances, and price-tracking tips.",
        seoTitle: "Diwali Electronics Deals 2026: Best Mobile, TV & Appliance Offers | CouponHub",
        seoDescription: "Top electronics price drops for Diwali 2026 across Amazon, Flipkart, Vijay Sales & Realme. Verified coupon codes and price comparison for smart shoppers.",
        keywords: "diwali electronics sale 2026,diwali mobile offers,diwali laptop deals,vijay sales diwali offer,realme diwali sale,shark ninja diwali discount",
        isPublished: true,
        publishedAt: new Date("2026-10-22T16:00:00.000Z"),
        author: AUTHOR_COUPONHUB,
        content: `<h2>Diwali Electronics Shopping Landscape</h2>
<p>Electronics account for over 50% of total Diwali sales volume in India. From flagship smartphones and ultrabooks to smart home appliances and air fryers, manufacturers launch their deepest annual markdowns during this window.</p>

<h2>1. Smartphones: Flagships & Mid-Range Stars</h2>
<ul>
    <li><strong>Apple iPhone 15 & 16:</strong> Up to ₹10,000 combined platform discount and bank rebate on Flipkart and Amazon.</li>
    <li><strong>Realme Diwali Extravaganza:</strong> Up to 45% storewide discount across the Realme GT and Number series smartphones.</li>
    <li><strong>Samsung Galaxy S24 Series:</strong> Massive price drops plus enhanced exchange bonus up to ₹8,000 on old smartphones.</li>
</ul>

<h2>2. Home Audio & Storage Deals on Vijay Sales</h2>
<p>Vijay Sales is running extensive festive discounts across computers and audio peripherals:</p>
<ul>
    <li><strong>High-Speed SSDs:</strong> Up to 20% OFF NVMe and external portable SSDs from Crucial, Kingston, and Samsung.</li>
    <li><strong>Wi-Fi 6 Routers:</strong> Up to 65% OFF TP-Link and D-Link gigabit mesh systems.</li>
    <li><strong>Party Speakers & Soundbars:</strong> Up to 50% OFF Dolby Atmos soundbars from JBL, Sony, and boAt.</li>
</ul>

<h2>3. Kitchen Upgrades: Shark Ninja Festive Deal</h2>
<p>Diwali is the traditional time for home and kitchen Dhanteras purchases. Shark Ninja India has rolled out promo code <strong><code>FESTIVERUSH</code></strong>, granting an instant 10% OFF (up to ₹1,000) on premium blender systems and multi-cookers, plus a complimentary Ninja Blast portable blender!</p>

<h2>3 Rules to Avoid Fake Festive Discounts</h2>
<ol>
    <li><strong>Check Price History:</strong> Some sellers artificially raise MRPs in late September before offering a '50% discount'. Verify the 90-day average price before buying.</li>
    <li><strong>Calculate Total Landing Price:</strong> Factor in delivery charges, extended warranty fees, and credit card processing fees.</li>
    <li><strong>Buy During Flash Hours:</strong> The highest-value coupon codes and limited-stock bundles typically refresh at 12:00 AM midnight and 12:00 PM noon.</li>
</ol>`,
    },

    // -------------------------------------------------------------
    // 6. EXISTING GUIDES (Retained for evergreen SEO)
    // -------------------------------------------------------------
    {
        id: "post-off-duty-guide",
        slug: "off-duty-india-coupon-guide",
        title: "Off-Duty India Coupon Guide 2026: 15% OFF + Free Shipping",
        excerpt: "Save on Off-Duty India streetwear — baggy jeans, cargos, oversized tees — with verified coupon codes, cashback, and stacking strategies.",
        seoTitle: "Off-Duty India Coupon Code: 15% OFF + Free Shipping Guide 2026 | CouponHub",
        seoDescription: "Get 15% OFF on Off-Duty India with verified coupon codes. Use WELCOME10 for 10% off your first order. Free shipping above ₹999.",
        keywords: "off duty coupon code,off duty india promo code,off duty discount,off duty streetwear offer,off duty jeans discount",
        isPublished: true,
        publishedAt: new Date("2026-09-18T10:00:00.000Z"),
        author: AUTHOR_COUPONHUB,
        content: `<h2>What is Off-Duty India?</h2>
<p>Off-Duty is an Indian streetwear brand known for its baggy jeans, cargo pants, oversized tees, and Y2K-inspired fits. The brand sells directly through its website and through Wishlink's affiliate network, making it one of the best opportunities for cashback-stacked savings in Indian fashion.</p>

<h2>Best Off-Duty Coupon Codes</h2>
<ul>
<li><strong>WELCOME10</strong> — 10% OFF on first order (new users)</li>
<li><strong>Wishlink Affiliate Deal</strong> — 15% OFF automatically applied when you click through CouponHub's verified link</li>
<li><strong>Free Shipping</strong> — On all orders above ₹999</li>
</ul>
<p><a href="/stores/off-duty">→ Get all Off-Duty verified codes on CouponHub</a></p>`,
    },
    {
        id: "post-myntra-vs-ajio",
        slug: "myntra-vs-ajio-which-is-better-for-deals",
        title: "Myntra vs AJIO 2026: Which Has Better Deals & Coupon Codes?",
        excerpt: "A data-driven comparison of Myntra and AJIO for Indian fashion shoppers — cashback rates, coupon codes, brand selection, and returns.",
        seoTitle: "Myntra vs AJIO: Which Has Better Deals in 2026? | CouponHub",
        seoDescription: "Compare Myntra and AJIO coupon codes, cashback, brand selection, and return policies. Find out which Indian fashion platform gives you more savings in 2026.",
        keywords: "myntra vs ajio,myntra vs ajio which is better,myntra ajio comparison,best fashion app india,myntra coupon code vs ajio coupon code",
        isPublished: true,
        publishedAt: new Date("2026-09-15T12:00:00.000Z"),
        author: AUTHOR_COUPONHUB,
        content: `<h2>Myntra vs AJIO: The Quick Answer</h2>
<p>Both Myntra and AJIO are top-tier Indian fashion platforms, but they serve different shopping priorities: Choose Myntra for the widest brand selection and 30-day returns. Choose AJIO for Reliance-exclusive brands, higher upfront coupons, and ethnic festive styles.</p>
<p><a href="/stores/ajio">→ See today's Ajio Deals</a> | <a href="/stores/myntra">→ See today's Myntra Deals</a></p>`,
    },
    {
        id: "post-zomato-swiggy-stacking",
        slug: "how-to-stack-zomato-swiggy-discounts",
        title: "How to Stack Discounts on Zomato and Swiggy: Save 30–50% on Every Order",
        excerpt: "The complete guide to stacking Zomato and Swiggy discounts — promo codes, bank card offers, Zomato Gold, Swiggy One, and restaurant-specific deals.",
        seoTitle: "Stack Zomato & Swiggy Discounts: Save 30–50% Per Order | CouponHub",
        seoDescription: "Learn to stack Zomato and Swiggy coupon codes with bank card offers and subscription savings to save 30–50% on every food delivery order in India.",
        keywords: "zomato coupon code,swiggy coupon code,zomato swiggy discount,stack food delivery discount india,zomato gold coupon,swiggy one promo code",
        isPublished: true,
        publishedAt: new Date("2026-09-12T14:00:00.000Z"),
        author: AUTHOR_COUPONHUB,
        content: `<h2>How to Save 30–50% on Food Delivery in India</h2>
<p>Zomato and Swiggy are the two most competitive food apps in India. By stacking a platform promo code with a bank card discount and Zomato Gold or Swiggy One free delivery, you can cut food bills in half.</p>
<p><a href="/stores/zomato">→ Get verified Zomato coupons</a> | <a href="/stores/swiggy">→ Get verified Swiggy coupons</a></p>`,
    },
];

/**
 * Fetch all published blog posts. Tries Prisma first, falls back to static registry.
 */
export async function getAllBlogPosts(): Promise<BlogPostData[]> {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            orderBy: { publishedAt: "desc" },
            include: {
                author: { select: { name: true, profileImage: true, bio: true } },
            },
        });

        if (posts && posts.length > 0) {
            return posts.map(p => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt || "",
                content: p.content,
                coverImage: p.coverImage,
                seoTitle: p.seoTitle,
                seoDescription: p.seoDescription,
                keywords: p.keywords,
                isPublished: p.isPublished,
                publishedAt: p.publishedAt || p.createdAt,
                author: {
                    name: p.author?.name || "CouponHub Deal Experts",
                    profileImage: p.author?.profileImage || null,
                    bio: p.author?.bio || null,
                }
            }));
        }
    } catch (e) {
        console.warn("[blog-data] Database unavailable, falling back to static registry:", (e as any)?.message || e);
    }

    return FALLBACK_BLOG_POSTS;
}

/**
 * Fetch a single blog post by slug. Tries Prisma first, falls back to static registry.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostData | null> {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug },
            include: {
                author: { select: { name: true, profileImage: true, bio: true } },
            },
        });

        if (post && post.isPublished) {
            return {
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt || "",
                content: post.content,
                coverImage: post.coverImage,
                seoTitle: post.seoTitle,
                seoDescription: post.seoDescription,
                keywords: post.keywords,
                isPublished: post.isPublished,
                publishedAt: post.publishedAt || post.createdAt,
                author: {
                    name: post.author?.name || "CouponHub Deal Experts",
                    profileImage: post.author?.profileImage || null,
                    bio: post.author?.bio || null,
                }
            };
        }
    } catch (e) {
        console.warn(`[blog-data] Database lookup failed for slug "${slug}", checking static fallback`);
    }

    const fallback = FALLBACK_BLOG_POSTS.find(p => p.slug === slug);
    return fallback || null;
}

/**
 * Return all slugs for static site generation.
 */
export async function getAllBlogSlugs(): Promise<string[]> {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            select: { slug: true }
        });
        if (posts && posts.length > 0) {
            return posts.map(p => p.slug);
        }
    } catch (e) {
        // Silently fall back to static list
    }
    return FALLBACK_BLOG_POSTS.map(p => p.slug);
}
