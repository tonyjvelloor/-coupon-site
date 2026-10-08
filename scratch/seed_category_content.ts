import 'dotenv/config';
import { prisma } from '../src/lib/db';

const categoryContent: Record<string, { aboutContent: string; faqContent: string }> = {
  "food-dining": {
    aboutContent: `<h2>How to Save on Food & Dining in India</h2>
<p>Food delivery and dining discounts in India are some of the most frequently updated coupons — Swiggy, Zomato, and restaurant aggregators push new offers multiple times a week. Here's the smartest way to save:</p>
<ul>
<li><strong>Stack app offers with bank cashback:</strong> Both Swiggy and Zomato accept HDFC, ICICI, Kotak, and SBI credit card offers. Combine the in-app promo code with a bank EMI offer for 15–30% total savings.</li>
<li><strong>Subscribe to Swiggy One / Zomato Gold:</strong> If you order more than 3x per week, a subscription pays for itself in 2–3 orders. Always check CouponHub for free trial codes first.</li>
<li><strong>Lunchtime vs dinner pricing:</strong> Restaurants on delivery platforms often list lower prices during off-peak hours (11am–1pm). Pair with promo codes for maximum discount.</li>
<li><strong>New user codes:</strong> WELCOME10, FIRST100, NEWUSER50 — these rotate. Check the offers section above for the latest working code.</li>
</ul>`,
    faqContent: JSON.stringify([
      { question: "Which food delivery app has the best deals in India?", answer: "Swiggy and Zomato both run aggressive discount programs. Swiggy One membership gives flat delivery discounts while Zomato Gold provides 1+1 or 20–40% off at partner restaurants. Use CouponHub to compare live codes for both before ordering." },
      { question: "Does Zomato have a coupon code today?", answer: "Yes — Zomato updates promo codes multiple times a week. The most reliable are bank card offers (HDFC, SBI, ICICI) which give 10–20% instant discount. Check the verified Zomato deals above for today's working codes." },
      { question: "Can I use multiple discount codes on Swiggy?", answer: "Swiggy allows stacking only in specific cases — you can typically use one promo code plus an eligible bank card offer simultaneously. Swiggy One subscribers get additional free delivery on top of these." },
      { question: "What is the best Swiggy coupon code for first order?", answer: "New Swiggy users get the highest discounts — typically 50–60% off or flat ₹100–150 off first order. The exact code changes frequently; check the Swiggy coupon section above for the latest verified code." }
    ])
  },
  "travel": {
    aboutContent: `<h2>How to Save on Travel Booking in India</h2>
<p>Travel coupons in India offer some of the largest absolute savings — a single promo code on a flight or hotel booking can save ₹500–5,000. Here's how to maximize savings:</p>
<ul>
<li><strong>MakeMyTrip vs Yatra vs Ixigo:</strong> Always compare prices across platforms. The same flight can vary by ₹300–800. Then apply a coupon code on the cheaper platform.</li>
<li><strong>Bank card offers for flights:</strong> HDFC, SBI, ICICI and Axis Bank run co-branded offers with airlines and OTAs. A 10% bank discount on a ₹8,000 ticket saves ₹800 instantly.</li>
<li><strong>Book 45–60 days in advance:</strong> Indian airlines release cheapest fares 6–8 weeks before departure. Combine early booking with a coupon for the best deal.</li>
<li><strong>Holiday packages vs standalone booking:</strong> Package deals on MakeMyTrip are often 15–25% cheaper than booking flights and hotels separately — especially for popular routes.</li>
</ul>`,
    faqContent: JSON.stringify([
      { question: "What is the best travel booking site in India?", answer: "MakeMyTrip has the largest inventory and most frequent bank card offers. Yatra often has exclusive flight deals. Ixigo is best for last-minute train bookings. Always check CouponHub for platform-specific promo codes before booking." },
      { question: "Does MakeMyTrip have coupon codes today?", answer: "Yes — MakeMyTrip runs ongoing bank card offers (HDFC, ICICI, Axis) plus seasonal promo codes. Check the MakeMyTrip coupon section on CouponHub for today's verified codes. Codes change frequently during festive seasons." },
      { question: "How do I get cheap flight tickets in India?", answer: "Set price alerts on Google Flights, book 45–60 days in advance, travel on Tuesday/Wednesday (cheapest days), and apply an MakeMyTrip or Yatra coupon code with a bank card offer for stacked savings." },
      { question: "Are Klook deals available in India?", answer: "Yes — Klook covers activities, airport transfers, and experiences across Indian cities including Mumbai, Delhi, Goa, and Rajasthan. Use a Klook coupon code from CouponHub for 5–10% off your booking." }
    ])
  },
  "health-beauty": {
    aboutContent: `<h2>How to Save on Health & Beauty in India</h2>
<p>Health and beauty is one of the fastest-growing eCommerce categories in India, with brands like The Derma Co, Nykaa, Plum Goodness, Mamaearth, and Sugar Cosmetics running near-constant discount campaigns. Here's how to get the best deals:</p>
<ul>
<li><strong>D2C brands offer highest cashback:</strong> Brands like The Derma Co (20%), Plum Goodness (15%), and Wellbeing Nutrition (19.5%) offer far higher cashback through CouponHub than Nykaa or Amazon. Buy direct from the brand's website through our affiliate link.</li>
<li><strong>Nykaa Pink Friday / Beauty Bonanza:</strong> Nykaa runs 2–3 massive sale events per year where 500+ brands discount 20–50%. Stack a coupon code with a bank card offer for compounded savings.</li>
<li><strong>Subscription boxes:</strong> MyGlamm, Vanity Cask, and similar boxes offer 30–40% off for first-time subscribers. Use CouponHub's new user codes for maximum savings.</li>
<li><strong>Combo packs vs individual products:</strong> D2C skincare brands often sell combo kits at 20–30% below individual product pricing — look for "starter kits" and pair with a promo code.</li>
</ul>`,
    faqContent: JSON.stringify([
      { question: "Which is the best skincare brand in India with discounts?", answer: "The Derma Co, Plum Goodness, Minimalist, and Dot & Key are top Indian skincare brands that frequently offer 20–30% off. CouponHub tracks their verified coupon codes updated daily." },
      { question: "Does Nykaa have a coupon code today?", answer: "Nykaa runs ongoing bank card offers (HDFC, SBI, Axis) plus category-specific promo codes for skincare, hair care, and makeup. Check the Nykaa coupon section on CouponHub for today's verified codes." },
      { question: "How do I get the best deal on Wellbeing Nutrition?", answer: "Wellbeing Nutrition offers up to 19.5% cashback through CouponHub's affiliate program, plus store-specific discount codes. Click through from the Wellbeing Nutrition page on CouponHub to earn cashback automatically." },
      { question: "What is the best ayurvedic brand with discount codes in India?", answer: "Khadi Natural, Himalayan Drug Company, and Forest Essentials run regular discount campaigns. Khadi Natural offers 13.5% cashback through CouponHub. Use their promo codes on the official website for the best price." }
    ])
  },
  "home-living": {
    aboutContent: `<h2>How to Save on Home & Living in India</h2>
<p>Home decor, furniture, and kitchen appliances offer some of the largest absolute discount amounts in Indian eCommerce — with high-ticket items, even a 5% coupon saves ₹500–2,000. Here's how to shop smart:</p>
<ul>
<li><strong>Flipkart vs Amazon for furniture:</strong> For large furniture (sofas, beds, wardrobes), Flipkart's Big Billion Days and Amazon's Great Indian Festival offer 30–50% off from brands like Nilkamal, Godrej Interio, and Durian.</li>
<li><strong>Pepperfry and Urban Ladder:</strong> These furniture-first platforms run their own sale events and accept bank card offers. Apply a coupon code on top of sale pricing for maximum discount.</li>
<li><strong>Godrej Interio direct store:</strong> Buying from Godrej's official website through CouponHub earns 3% cashback plus promo code savings — often better than buying through Amazon.</li>
<li><strong>Kitchen appliances timing:</strong> Best deals on mixers, pressure cookers, and air fryers appear during Republic Day (January), Independence Day (August), and Big Billion Days (October) sales.</li>
</ul>`,
    faqContent: JSON.stringify([
      { question: "Which is the best home decor site in India?", answer: "Pepperfry, Urban Ladder, and IKEA are top home decor platforms. For budget options, Flipkart and Amazon have the widest selection. CouponHub tracks coupon codes and bank card offers for all major home and living stores." },
      { question: "Does Godrej Interio have discount codes?", answer: "Yes — Godrej Interio offers 3% cashback through CouponHub plus periodic promo codes. Check the Godrej Interio page for today's verified deals. Their Diwali and New Year sales offer 15–30% off furniture." },
      { question: "Where can I get the best kitchen appliance deals in India?", answer: "Amazon and Flipkart have the widest selection. Wonderchef (10.5% cashback via CouponHub) specialises in premium cookware. Croma and Reliance Digital have exclusive brand deals on Prestige, Bajaj, and Phillips." },
      { question: "How do I get a Vaaree coupon code?", answer: "Vaaree offers 7.5% cashback through CouponHub's affiliate program. Visit the Vaaree store page on CouponHub, click through to shop, and cashback is automatically tracked. Promo codes for additional discounts are listed when available." }
    ])
  },
  "entertainment": {
    aboutContent: `<h2>How to Save on Entertainment & Subscriptions in India</h2>
<p>Entertainment in India — streaming platforms, OTT subscriptions, gaming, and event tickets — offers smart savings opportunities especially on annual subscriptions. Here's the strategy:</p>
<ul>
<li><strong>Annual vs monthly OTT subscriptions:</strong> Netflix, Prime Video, Disney+ Hotstar and JioCinema annual plans cost 30–40% less than monthly billing. Buy annual during festive season sales for maximum savings.</li>
<li><strong>Bank card offers for OTT:</strong> HDFC and ICICI frequently offer 3–12 months of free Netflix, Hotstar, or Amazon Prime with premium credit cards. Check your card's offers section before subscribing.</li>
<li><strong>BookMyShow promo codes:</strong> Use CouponHub's BookMyShow coupons for movies, concerts, and sports events. New users get higher discounts; book on Tuesday/Wednesday (less demand).</li>
<li><strong>AppSumo lifetime deals:</strong> AppSumo offers lifetime access to SaaS tools at 80–95% off. At 52.5% cashback through CouponHub, AppSumo purchases earn significant returns.</li>
</ul>`,
    faqContent: JSON.stringify([
      { question: "How can I get Netflix cheap in India?", answer: "Netflix India offers a Mobile Plan at ₹149/month as the cheapest option. For HD/4K, the Basic plan is ₹199/month. Annual subscriptions save 15–20%. Bank card offers (HDFC, ICICI premium cards) can include free Netflix for 3–12 months." },
      { question: "Does Disney+ Hotstar have coupon codes?", answer: "Hotstar runs promo codes especially during IPL season and during Amazon/Flipkart sale events. Annual Super plan subscribers get the best value. Check CouponHub's entertainment section for the latest Hotstar discount codes." },
      { question: "What is AppSumo and is it worth it?", answer: "AppSumo is a marketplace for lifetime software deals — you pay once and get access forever, instead of monthly subscriptions. At 52.5% cashback through CouponHub, it's one of the highest-earning affiliate purchases. Ideal for freelancers and small businesses." },
      { question: "How to get cheap movie tickets on BookMyShow in India?", answer: "BookMyShow coupon codes are especially active on Tuesdays (Movie Day deals). Some banks (Kotak, HDFC) offer 50% off movie tickets on Fridays. CouponHub lists all verified BookMyShow promo codes updated daily." }
    ])
  },
  "sports-fitness": {
    aboutContent: `<h2>How to Save on Sports & Fitness in India</h2>
<p>Fitness equipment, sportswear, and gym supplements are a fast-growing category in India. Here's the smart shopping approach:</p>
<ul>
<li><strong>D2C supplement brands offer highest cashback:</strong> Wellbeing Nutrition (19.5%), Hkvitals (13.5%), Nutrabay (6.75%), and HealthKart (4.73%) all offer cashback through CouponHub — plus promo codes for additional savings.</li>
<li><strong>Decathlon beats Nike and Adidas on price:</strong> Decathlon's in-house brands offer 60–70% of the quality at 30–40% of the price. Use Decathlon coupon codes for additional savings on already affordable gear.</li>
<li><strong>New Year fitness rush (January):</strong> The best deals on gym equipment, yoga mats, and fitness trackers appear in January when brands capitalise on New Year resolutions. Plan purchases for January sales.</li>
<li><strong>Cult.fit membership codes:</strong> Cult.fit frequently offers 20–40% off new memberships. Check CouponHub for the latest promo codes before buying any fitness subscription.</li>
</ul>`,
    faqContent: JSON.stringify([
      { question: "Which is the best protein supplement brand in India with discounts?", answer: "Wellbeing Nutrition, Nutrabay, MuscleBlaze, and HealthKart are the top Indian protein supplement brands. Wellbeing Nutrition offers up to 19.5% cashback through CouponHub plus promo codes for stacked savings." },
      { question: "Does Decathlon have coupon codes in India?", answer: "Decathlon runs periodic sale events and bank card offers (3–5% instant discount). CouponHub tracks verified Decathlon promo codes. Decathlon's own brands like Domyos, Quechua, and Kipsta are already low-priced without needing codes." },
      { question: "How do I get the best deal on gym equipment online in India?", answer: "Compare Amazon, Flipkart, and direct brand sites. January sales (New Year fitness rush) and festive season sales offer 20–40% off equipment. Use a coupon code on top of sale pricing for maximum savings." },
      { question: "What is the best sportswear brand in India with discounts?", answer: "Puma, Nike Asia, Adidas, and Decathlon are the top sportswear brands. Campus Shoes offers 11.25% cashback via CouponHub for affordable Indian sportswear. OGL Move (11.25% cashback) is a rising Indian athleisure brand worth checking." }
    ])
  },
};

async function main() {
  console.log(`Seeding aboutContent and faqContent for ${Object.keys(categoryContent).length} categories...\n`);
  for (const [slug, content] of Object.entries(categoryContent)) {
    const result = await prisma.category.updateMany({
      where: { slug },
      data: { aboutContent: content.aboutContent, faqContent: content.faqContent }
    });
    if (result.count > 0) {
      console.log(`✅ ${slug}`);
    } else {
      console.log(`⚠️  Not found: ${slug}`);
    }
  }
  console.log('\n✅ Done! All category content updated.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
