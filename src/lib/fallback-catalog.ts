import { PublicCoupon, PublicMerchant } from "./repositories/dtos";

export interface FallbackCategory {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    aboutContent: string;
    faqContent: string;
    children: Array<{ id: string; name: string; slug: string }>;
    _count: { coupons: number; storeCategories: number };
}

export const FALLBACK_CATEGORIES: FallbackCategory[] = [
    {
        id: "cat-fashion",
        name: "Fashion",
        slug: "fashion",
        icon: "Shirt",
        description: "Verified fashion coupon codes, seasonal apparel sales, footwear markdowns, and bank card offers across Myntra, AJIO, Tata CLiQ, and Puma.",
        aboutContent: "Save more on clothing, footwear, ethnicwear, and accessories across India's top fashion stores. Combine verified promo codes with HDFC, ICICI, SBI, and Kotak instant card offers during Black Friday, End of Reason Sale, and seasonal clearances.",
        faqContent: JSON.stringify([
            { question: "How do I stack fashion coupons with bank offers in India?", answer: "Apply the store coupon code in your cart first, ensure the discounted subtotal still meets the bank card minimum spend (typically ₹2,500–₹3,000), and then pay with an eligible credit or debit card." },
            { question: "Which Indian fashion stores offer the biggest seasonal markdowns?", answer: "Myntra, AJIO, Tata CLiQ, and Puma run 50%–80% off campaigns during Black Friday, EORS, and festive sales, often paired with extra cart vouchers." },
        ]),
        children: [],
        _count: { coupons: 120, storeCategories: 48 },
    },
    {
        id: "cat-electronics",
        name: "Electronics",
        slug: "electronics",
        icon: "Smartphone",
        description: "Verified electronics deals, smartphone price drops, laptop vouchers, and instant credit card discounts on Amazon India, Flipkart, Croma, Reliance Digital, and boAt.",
        aboutContent: "Compare verified electronics deals and instant bank rebates on smartphones, laptops, televisions, ACs, and audio gear. Always check whether a 10% instant discount cap beats a 5% unlimited cashback card before checking out.",
        faqContent: JSON.stringify([
            { question: "Are electronics promo codes stackable with No-Cost EMI?", answer: "Most Indian retailers allow instant bank discounts on 3- and 6-month EMI plans, though remember that 18% GST applies to the interest component and banks may charge a ₹199–₹299 processing fee." },
            { question: "Which stores have verified electronics offers in India?", answer: "Amazon India, Flipkart, Croma Retail, Reliance Digital, Vijay Sales, boAt, and Mivi regularly feature verified price drops and bank card tie-ups." },
        ]),
        children: [],
        _count: { coupons: 145, storeCategories: 36 },
    },
    {
        id: "cat-health-beauty",
        name: "Health & Beauty",
        slug: "health-beauty",
        icon: "Heart",
        description: "Verified skincare, cosmetics, fragrance, and supplement promo codes across Nykaa Beauty, Wellbeing Nutrition, HealthKart, Plum Goodness, and Bella Vita.",
        aboutContent: "Find working promo codes on skincare combos, BOGO beauty deals, whey protein, and daily wellness supplements. Watch for first-order discount codes and prepaid cart perks that stack on top of sale prices.",
        faqContent: JSON.stringify([
            { question: "How do Nykaa Pink Friday and skincare BOGO codes work?", answer: "Add qualifying items to your bag so the automatic free-item or bundle tier triggers, then apply a new-user or cart-level coupon code at checkout." },
            { question: "Are supplement discounts verified on CouponHub?", answer: "Yes, we track active deals from Wellbeing Nutrition, HealthKart, and official brand stores so shoppers avoid expired codes." },
        ]),
        children: [],
        _count: { coupons: 160, storeCategories: 52 },
    },
    {
        id: "cat-travel",
        name: "Travel",
        slug: "travel",
        icon: "Plane",
        description: "Verified flight promo codes, Indian & international hotel vouchers, and tour activity coupons across Klook, Air India Express, and MakeMyTrip.",
        aboutContent: "Cut flight, hotel, and attraction costs with verified travel promo codes and bank card instant discounts. Check bank-specific weekday flight promos on HDFC, ICICI, SBI, and Mastercard before booking.",
        faqContent: JSON.stringify([
            { question: "Which cards give the best flight and hotel discounts in India?", answer: "HDFC, ICICI, SBI, and Mastercard frequently offer flat ₹600–₹2,000 off domestic and international flights or 10%–20% off curated tours on Klook and MakeMyTrip." },
            { question: "Do travel coupon codes apply to taxes and convenience fees?", answer: "Most flight and hotel promo codes calculate discounts on the base fare or room tariff before convenience fees and GST." },
        ]),
        children: [],
        _count: { coupons: 95, storeCategories: 24 },
    },
    {
        id: "cat-food-dining",
        name: "Food & Dining",
        slug: "food-dining",
        icon: "UtensilsCrossed",
        description: "Verified food delivery coupons, Instamart grocery deals, and restaurant dining discounts on Swiggy and Zomato.",
        aboutContent: "Save on everyday food delivery, quick-commerce groceries, and dining-out bills across Swiggy and Zomato using verified promo codes and co-branded card offers like the Swiggy HDFC Bank card.",
        faqContent: JSON.stringify([
            { question: "Can I stack Swiggy or Zomato bank offers with restaurant coupons?", answer: "Yes, restaurant-funded discounts typically apply at the cart level while payment-method bank offers or co-branded card cashbacks apply on the final payable amount." },
        ]),
        children: [],
        _count: { coupons: 75, storeCategories: 28 },
    },
    {
        id: "cat-home-living",
        name: "Home & Living",
        slug: "home-living",
        icon: "Home",
        description: "Verified home appliances, kitchen essentials, and decor discounts across Amazon India, Flipkart, Croma Retail, and Reliance Digital.",
        aboutContent: "Upgrade home appliances, kitchenware, and furnishings for less with verified seasonal price drops, exchange bonuses, and bank instant discounts.",
        faqContent: JSON.stringify([
            { question: "When are home appliance discounts biggest in India?", answer: "Black Friday, Great Indian Festival, Big Billion Days, and Republic Day sales typically bring the deepest instant bank rebates and exchange bonuses on ACs, refrigerators, and washers." },
        ]),
        children: [],
        _count: { coupons: 88, storeCategories: 35 },
    },
    {
        id: "cat-sports-fitness",
        name: "Sports & Fitness",
        slug: "sports-fitness",
        icon: "Dumbbell",
        description: "Verified sportswear, running shoe, outdoor gear, and fitness nutrition deals from Decathlon, Puma India, Campus Shoes, and HealthKart.",
        aboutContent: "Shop running shoes, activewear, cycling gear, and sports nutrition for less using verified promo codes, seasonal outlet drops, and prepaid cart discounts.",
        faqContent: JSON.stringify([
            { question: "Does Puma India stack extra coupons on outlet items?", answer: "During major seasonal campaigns, Puma frequently offers an extra 10%–15% prepaid or promo-code discount on top of clearance prices." },
        ]),
        children: [],
        _count: { coupons: 62, storeCategories: 22 },
    },
    {
        id: "cat-entertainment",
        name: "Entertainment",
        slug: "entertainment",
        icon: "Film",
        description: "Verified deals on attractions, theme parks, audio streaming accessories, and weekend experiences across Klook, Amazon India, and boAt.",
        aboutContent: "Save on theme park tickets, weekend activities, headphones, and home theater soundbars with verified codes and instant card discounts.",
        faqContent: JSON.stringify([
            { question: "How do I get discounts on theme parks and experiences?", answer: "Use verified Klook promo codes like UNPACKINDIA or SBI card vouchers to save up to 20% on attractions and weekend activities." },
        ]),
        children: [],
        _count: { coupons: 44, storeCategories: 18 },
    },
];

export interface FallbackStoreSummary {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    website: string;
    cashbackRate: string | null;
    offerCount: number;
    description: string;
    primaryCategory: string;
    categorySlug: string;
    isFeatured: boolean;
    shippingPolicy?: string;
    returnsPolicy?: string;
    studentPolicy?: string;
}

export const FALLBACK_STORES: FallbackStoreSummary[] = [
    {
        id: "fb-amazon",
        name: "Amazon India",
        slug: "amazon",
        logo: "/images/stores/amazon.png",
        website: "https://www.amazon.in/",
        cashbackRate: "Up to 5%",
        offerCount: 45,
        description: "Verified Amazon India promo codes, Black Friday tech deals, and HDFC, ICICI, and SBI instant bank discounts.",
        primaryCategory: "Electronics",
        categorySlug: "electronics",
        isFeatured: true,
        shippingPolicy: "Free delivery on eligible orders above ₹499 or free same-day/one-day delivery with Amazon Prime across India.",
        returnsPolicy: "7 to 10-day replacement or refund policy depending on product category, with doorstep pickup.",
        studentPolicy: "Youth Offer gives 50% cashback on Amazon Prime membership for shoppers aged 18–24.",
    },
    {
        id: "fb-flipkart",
        name: "Flipkart",
        slug: "flipkart",
        logo: "/images/stores/flipkart.png",
        website: "https://www.flipkart.com/",
        cashbackRate: "Up to 5%",
        offerCount: 38,
        description: "Flipkart verified offers on smartphones, laptops, home appliances, and Axis/HDFC bank card discounts.",
        primaryCategory: "Electronics",
        categorySlug: "electronics",
        isFeatured: true,
        shippingPolicy: "Free standard delivery on Flipkart Assured orders above ₹500 and complimentary express shipping for Flipkart Plus members.",
        returnsPolicy: "7-day service center replacement for most electronics and 10-day easy returns on fashion and lifestyle items.",
        studentPolicy: "Occasional back-to-college laptop discounts with instant card offers and exchange bonuses.",
    },
    {
        id: "fb-klook",
        name: "Klook",
        slug: "klook",
        logo: "/images/stores/klook.jpg",
        website: "https://www.klook.com/en-IN/",
        cashbackRate: "Up to 5%",
        offerCount: 80,
        description: "Klook verified promo codes for Indian hotels, international tours, rail passes, and SBI card discounts.",
        primaryCategory: "Travel",
        categorySlug: "travel",
        isFeatured: true,
        shippingPolicy: "Instant e-voucher delivery to your email and Klook app for tours, airport transfers, and hotel stays.",
        returnsPolicy: "Free cancellation up to 24 hours before most activities; check individual voucher terms before booking.",
        studentPolicy: "First-time app users and SBI/HDFC cardholders can apply verified promo codes at checkout.",
    },
    {
        id: "fb-croma-retail",
        name: "Croma Retail",
        slug: "croma-retail",
        logo: "/images/stores/croma-retail.jpg",
        website: "https://www.croma.com/",
        cashbackRate: "Up to 3%",
        offerCount: 75,
        description: "Croma Black Friday deals on ACs, iPads, TVs, and laptops with HDFC, ICICI, and Tata Neu card offers.",
        primaryCategory: "Electronics",
        categorySlug: "electronics",
        isFeatured: true,
        shippingPolicy: "Express 3-hour delivery in major metros plus free store pickup across 500+ Croma outlets.",
        returnsPolicy: "7-day replacement for defective or damaged electronics backed by ZipCare extended warranty options.",
        studentPolicy: "Seasonal student offers on MacBooks, iPads, and Windows laptops with valid college ID verification.",
    },
    {
        id: "fb-tata-cliq",
        name: "Tata Cliq",
        slug: "tata-cliq",
        logo: "/images/stores/tata-cliq.jpg",
        website: "https://www.tatacliq.com/",
        cashbackRate: "Up to 9%",
        offerCount: 44,
        description: "Tata CLiQ & Tata CLiQ Luxury promo codes, NeuCard flat ₹500 discounts, and seasonal apparel markdowns.",
        primaryCategory: "Fashion",
        categorySlug: "fashion",
        isFeatured: true,
        shippingPolicy: "Free shipping on qualifying orders above ₹1,499 and complimentary white-glove delivery on Luxury items.",
        returnsPolicy: "7 to 15-day hassle-free returns and exchanges on unworn apparel and accessories with original tags.",
        studentPolicy: "Stack Tata NeuCoins and first-order codes like LUXNEW for additional cart savings.",
    },
    {
        id: "fb-ajio",
        name: "AJIO",
        slug: "ajio",
        logo: "/images/stores/ajio.png",
        website: "https://www.ajio.com/",
        cashbackRate: "Up to 8%",
        offerCount: 39,
        description: "AJIO Black Friday and seasonal fashion coupons on footwear, ethnicwear, handbags, and international labels.",
        primaryCategory: "Fashion",
        categorySlug: "fashion",
        isFeatured: true,
        shippingPolicy: "Free delivery on first orders and standard orders above ₹1,199; convenience fees apply on low-value carts.",
        returnsPolicy: "10-day easy doorstep return or size exchange on most apparel and footwear categories.",
        studentPolicy: "Seasonal campus sales and bank card instant discounts offer extra savings on trendy streetwear.",
    },
    {
        id: "fb-myntra",
        name: "Myntra",
        slug: "myntra",
        logo: "/images/stores/myntra.png",
        website: "https://www.myntra.com/",
        cashbackRate: "Up to 6%",
        offerCount: 32,
        description: "Myntra verified coupons, End of Reason Sale previews, Insider savings, and bank card checkout offers.",
        primaryCategory: "Fashion",
        categorySlug: "fashion",
        isFeatured: true,
        shippingPolicy: "Free shipping on orders above ₹1,199 and complimentary delivery for Myntra Insider Select/Icon members.",
        returnsPolicy: "7 to 14-day return and exchange window with instant refund to Myntra Credit or original payment mode.",
        studentPolicy: "Myntra Studio and Campus collections feature youth discounts and app-only voucher drops.",
    },
    {
        id: "fb-nykaa-beauty",
        name: "Nykaa Beauty",
        slug: "nykaa-beauty",
        logo: "/images/stores/nykaa-beauty.jpg",
        website: "https://www.nykaa.com/",
        cashbackRate: "Up to 7%",
        offerCount: 23,
        description: "Nykaa Pink Friday 2026 verified coupon codes, BOGO skincare combos, and first-order beauty discounts.",
        primaryCategory: "Health & Beauty",
        categorySlug: "health-beauty",
        isFeatured: true,
        shippingPolicy: "Free shipping on orders above ₹299 across India, with priority dispatch for Nykaa Prive members.",
        returnsPolicy: "15-day return window for unopened, damaged, or wrong beauty products with authenticity guarantee.",
        studentPolicy: "First-time buyers can use verified welcome codes like NYKAA20 on eligible skincare and makeup.",
    },
    {
        id: "fb-reliance-digital",
        name: "Reliance Digital",
        slug: "reliance-digital",
        logo: "/images/stores/reliance-digital.jpg",
        website: "https://www.reliancedigital.in/",
        cashbackRate: null,
        offerCount: 54,
        description: "Reliance Digital smartphone, TV, and home appliance offers with instant credit card discounts and exchange bonuses.",
        primaryCategory: "Electronics",
        categorySlug: "electronics",
        isFeatured: true,
        shippingPolicy: "Free delivery on large appliances and same-day express pickup from nearby Reliance Digital stores.",
        returnsPolicy: "7-day replacement for manufacturing defects backed by resQ nationwide installation and repair support.",
        studentPolicy: "Back-to-campus laptop bundles include discounted accessories and No-Cost EMI bank plans.",
    },
    {
        id: "fb-vijay-sales",
        name: "Vijay Sales",
        slug: "vijay-sales",
        logo: "/images/stores/vijay-sales.jpg",
        website: "https://www.vijaysales.com/",
        cashbackRate: null,
        offerCount: 42,
        description: "Vijay Sales electronics discounts on Apple devices, washing machines, and refrigerators with bank card tie-ups.",
        primaryCategory: "Electronics",
        categorySlug: "electronics",
        isFeatured: false,
        shippingPolicy: "Free home delivery across serviceable Indian pin codes plus quick pickup at regional stores.",
        returnsPolicy: "Replacement eligible within 7 days for unopened or DOA electronics per brand service guidelines.",
        studentPolicy: "Special Apple Days and student laptop offers with instant HDFC/ICICI cashback.",
    },
    {
        id: "fb-wellbeing-nutrition",
        name: "Wellbeing Nutrition",
        slug: "wellbeing-nutrition",
        logo: "/images/stores/wellbeing-nutrition.jpg",
        website: "https://wellbeingnutrition.com/",
        cashbackRate: "Up to 15%",
        offerCount: 39,
        description: "Wellbeing Nutrition verified discount codes on plant protein, daily melts, collagen, and detox supplements.",
        primaryCategory: "Health & Beauty",
        categorySlug: "health-beauty",
        isFeatured: true,
        shippingPolicy: "Free pan-India delivery on prepaid orders above ₹499, typically delivered in 3–5 business days.",
        returnsPolicy: "7-day return or replacement for damaged, leaked, or expired supplement packs.",
        studentPolicy: "Extra prepaid cart savings and subscription bundle discounts up to 25% off.",
    },
    {
        id: "fb-healthkart",
        name: "HealthKart",
        slug: "healthkart",
        logo: "/images/stores/healthkart.jpg",
        website: "https://www.healthkart.com/",
        cashbackRate: "Up to 8%",
        offerCount: 26,
        description: "HealthKart verified coupons on whey protein, MuscleBlaze stacks, multivitamins, and prepaid bonus offers.",
        primaryCategory: "Health & Beauty",
        categorySlug: "health-beauty",
        isFeatured: false,
        shippingPolicy: "Free shipping on orders above ₹499 and faster dispatch for HK Premium loyalty members.",
        returnsPolicy: "14-day return policy on unopened, factory-sealed nutrition products with scratch-code verification.",
        studentPolicy: "HK Cash rewards and combo stack deals reduce per-serving supplement costs.",
    },
    {
        id: "fb-swiggy",
        name: "Swiggy",
        slug: "swiggy",
        logo: "/images/stores/swiggy.png",
        website: "https://www.swiggy.com/",
        cashbackRate: null,
        offerCount: 25,
        description: "Swiggy food delivery, Instamart grocery deals, Swiggy One perks, and HDFC/RuPay card discounts.",
        primaryCategory: "Food & Dining",
        categorySlug: "food-dining",
        isFeatured: false,
        shippingPolicy: "Free delivery on restaurants above ₹199 and Instamart orders above ₹199 with Swiggy One.",
        returnsPolicy: "Instant in-app support refunds for missing, spilled, or incorrect food and grocery items.",
        studentPolicy: "Swiggy One Lite and student campus packs offer discounted delivery bundles.",
    },
    {
        id: "fb-zomato",
        name: "Zomato",
        slug: "zomato",
        logo: null,
        website: "https://www.zomato.com/",
        cashbackRate: null,
        offerCount: 20,
        description: "Zomato restaurant promo codes, Gold free delivery offers, and dining bank card discounts.",
        primaryCategory: "Food & Dining",
        categorySlug: "food-dining",
        isFeatured: false,
        shippingPolicy: "Free delivery on orders above ₹199 within 7 km for Zomato Gold members.",
        returnsPolicy: "Automated in-app claim review and wallet/source refunds for damaged or missing orders.",
        studentPolicy: "Frequent Zomato Gold 3-month introductory offers and weekday dining card discounts.",
    },
    {
        id: "fb-boat",
        name: "boAt",
        slug: "boat",
        logo: "/images/stores/boat.jpg",
        website: "https://www.boat-lifestyle.com/",
        cashbackRate: "Up to 6%",
        offerCount: 18,
        description: "boAt verified coupons on Airdopes TWS earbuds, Nirvana headphones, soundbars, and smartwatches.",
        primaryCategory: "Electronics",
        categorySlug: "electronics",
        isFeatured: false,
        shippingPolicy: "Free standard shipping across India on prepaid website orders.",
        returnsPolicy: "7-day replacement for manufacturing defects plus 1-year brand warranty registration.",
        studentPolicy: "Extra ₹100–₹300 off prepaid UPI payments and seasonal flash sale drops.",
    },
    {
        id: "fb-air-india-express",
        name: "Air India Express",
        slug: "air-india-express",
        logo: "/images/stores/air-india-express.jpg",
        website: "https://www.airindiaexpress.com/",
        cashbackRate: null,
        offerCount: 12,
        description: "Air India Express verified flight promo codes, Mastercard instant discounts, and seasonal fare drops.",
        primaryCategory: "Travel",
        categorySlug: "travel",
        isFeatured: false,
        shippingPolicy: "Instant e-ticket issuance with zero convenience fee offers on select direct app bookings.",
        returnsPolicy: "Flexible date change and cancellation waivers available on Xpress Flex fares.",
        studentPolicy: "Student special fares include discounted base fares and extra check-in baggage allowance.",
    },
    {
        id: "fb-makemytrip-hotels",
        name: "MakeMyTrip",
        slug: "makemytrip-hotels",
        logo: "/images/stores/makemytrip-hotels.jpg",
        website: "https://www.makemytrip.com/",
        cashbackRate: "Up to 6%",
        offerCount: 28,
        description: "MakeMyTrip verified hotel and domestic flight coupon codes with HDFC, ICICI, and SBI instant card discounts.",
        primaryCategory: "Travel",
        categorySlug: "travel",
        isFeatured: false,
        shippingPolicy: "Instant booking confirmation via email, SMS, and the MakeMyTrip mobile app.",
        returnsPolicy: "Zero-cancellation protection and instant hotel refund options available on select bookings.",
        studentPolicy: "Student flight discounts and extra baggage allowances on participating domestic carriers.",
    },
    {
        id: "fb-decathlon",
        name: "Decathlon",
        slug: "decathlon",
        logo: "/images/stores/decathlon.jpg",
        website: "https://www.decathlon.in/",
        cashbackRate: null,
        offerCount: 19,
        description: "Decathlon India deals on running shoes, trekking backpacks, cycles, and home fitness equipment.",
        primaryCategory: "Sports & Fitness",
        categorySlug: "sports-fitness",
        isFeatured: false,
        shippingPolicy: "Free Click & Collect at Decathlon stores nationwide and free doorstep shipping above ₹999.",
        returnsPolicy: "Generous 90-day return or exchange policy for unused sports gear with receipt or member ID.",
        studentPolicy: "Value-tier Quechua, Kalenji, and Domyos gear offers everyday low pricing without markups.",
    },
    {
        id: "fb-puma",
        name: "Puma India",
        slug: "puma",
        logo: "/images/stores/puma-sg.jpg",
        website: "https://in.puma.com/",
        cashbackRate: "Up to 7%",
        offerCount: 24,
        description: "Puma India verified coupon codes on sneakers, Nitro running shoes, sportswear, and outlet clearances.",
        primaryCategory: "Sports & Fitness",
        categorySlug: "sports-fitness",
        isFeatured: false,
        shippingPolicy: "Free shipping across India on prepaid orders and express metro delivery options.",
        returnsPolicy: "14-day free return and size exchange window on unworn footwear and apparel.",
        studentPolicy: "UNiDAYS and extra 5% prepaid checkout offers frequently stack on Puma outlet sales.",
    },
    {
        id: "fb-mivi",
        name: "Mivi",
        slug: "mivi",
        logo: "/images/stores/mivi.jpg",
        website: "https://www.mivi.in/",
        cashbackRate: "Up to 5%",
        offerCount: 14,
        description: "Mivi verified discounts on Made-in-India DuoPods TWS earbuds, Fort soundbars, and Bluetooth speakers.",
        primaryCategory: "Electronics",
        categorySlug: "electronics",
        isFeatured: false,
        shippingPolicy: "Free shipping on prepaid orders across India with 3–5 day standard dispatch.",
        returnsPolicy: "7-day replacement for transit damage or defects plus 1-year domestic warranty.",
        studentPolicy: "Prepaid UPI coupons and combo bundle offers save an extra 10% at checkout.",
    },
    {
        id: "fb-campus-shoes",
        name: "Campus Shoes",
        slug: "campus-shoes",
        logo: "/images/stores/campus-shoes.jpg",
        website: "https://www.campusshoes.com/",
        cashbackRate: "Up to 6%",
        offerCount: 16,
        description: "Campus Shoes verified promo codes on running shoes, chunky sneakers, clogs, and everyday footwear.",
        primaryCategory: "Fashion",
        categorySlug: "fashion",
        isFeatured: false,
        shippingPolicy: "Free shipping on prepaid orders across India; nominal fee applies to COD orders.",
        returnsPolicy: "15-day return or size exchange on unworn shoes in original box packaging.",
        studentPolicy: "Prepaid checkout discounts and combo offers bring everyday sneakers under ₹1,500.",
    },
    {
        id: "fb-neemans",
        name: "Neeman's",
        slug: "neemans",
        logo: "/images/stores/neemans.jpg",
        website: "https://neemans.com/",
        cashbackRate: "Up to 8%",
        offerCount: 15,
        description: "Neeman's verified coupon codes on recycled knit sneakers, wool loafers, slip-ons, and comfort slides.",
        primaryCategory: "Fashion",
        categorySlug: "fashion",
        isFeatured: false,
        shippingPolicy: "Free pan-India shipping on prepaid orders with rapid metro dispatch.",
        returnsPolicy: "7-day free size exchange and easy refund options for unused footwear.",
        studentPolicy: "Multi-pair bundles and prepaid discounts save up to 20% on eco-friendly sneakers.",
    },
    {
        id: "fb-jockey",
        name: "Jockey",
        slug: "jockey",
        logo: null,
        website: "https://www.jockey.in/",
        cashbackRate: null,
        offerCount: 14,
        description: "Jockey India deals on innerwear, athleisure joggers, thermals, and multi-pack essentials.",
        primaryCategory: "Fashion",
        categorySlug: "fashion",
        isFeatured: false,
        shippingPolicy: "Free delivery on official Jockey.in orders above ₹999 across India.",
        returnsPolicy: "15-day return policy on outerwear and athleisure (innerwear hygiene exclusions apply).",
        studentPolicy: "Value multi-packs and seasonal bank wallet offers provide reliable savings.",
    },
    {
        id: "fb-the-man-company",
        name: "The Man Company",
        slug: "the-man-company",
        logo: "/images/stores/the-man-company.jpg",
        website: "https://www.themancompany.com/",
        cashbackRate: "Up to 10%",
        offerCount: 22,
        description: "The Man Company verified promo codes on Eau de Parfum gift sets, beard care, and men's grooming kits.",
        primaryCategory: "Health & Beauty",
        categorySlug: "health-beauty",
        isFeatured: false,
        shippingPolicy: "Free shipping on prepaid orders above ₹499 across India.",
        returnsPolicy: "7-day return/replacement for damaged, leaking, or incorrect grooming shipments.",
        studentPolicy: "Build-your-own-box bundles and BOGO perfume promos offer up to 40% off MRP.",
    },
    {
        id: "fb-bella-vita",
        name: "Bella Vita",
        slug: "bella-vita",
        logo: "/images/stores/bella-vita.jpg",
        website: "https://bellavitaorganic.com/",
        cashbackRate: "Up to 10%",
        offerCount: 21,
        description: "Bella Vita Luxury verified coupons on perfume gift sets, Oud & CEO Man EDPs, and bath & body combos.",
        primaryCategory: "Health & Beauty",
        categorySlug: "health-beauty",
        isFeatured: false,
        shippingPolicy: "Free shipping on prepaid orders above ₹499 across India.",
        returnsPolicy: "7-day replacement for transit breakage or wrong items with unboxing proof.",
        studentPolicy: "Luxury perfume trial sets and Buy 2 Get 1 combos keep gifting under ₹799.",
    },
    {
        id: "fb-plum-goodness",
        name: "Plum Goodness",
        slug: "plum-goodness",
        logo: "/images/stores/plum-goodness.jpg",
        website: "https://plumgoodness.com/",
        cashbackRate: "Up to 10%",
        offerCount: 24,
        description: "Plum Goodness verified coupon codes on niacinamide serums, green tea skincare, and vegan body mists.",
        primaryCategory: "Health & Beauty",
        categorySlug: "health-beauty",
        isFeatured: false,
        shippingPolicy: "Free delivery on orders above ₹399 plus free mini gifts on higher cart tiers.",
        returnsPolicy: "7-day return or replacement on damaged, expired, or mismatched orders.",
        studentPolicy: "Frequent BOGO skincare sales and extra 10% prepaid promo codes.",
    },
];

export const FALLBACK_COUPONS: PublicCoupon[] = [
    {
        id: "fb-cpn-klook-unpack",
        title: "Extra ₹2,000 Off on Indian Hotels & Curated Experiences",
        description: "Apply promo code at Klook checkout on qualifying hotel & attraction bookings.",
        code: "UNPACKINDIA",
        type: "coupon",
        discountType: "fixed",
        discountValue: "₹2,000 OFF",
        affiliateUrl: "https://www.klook.com/en-IN/",
        expiresAt: null,
        isVerified: true,
        isExclusive: true,
        merchantName: "Klook",
        merchantSlug: "klook",
        merchantLogo: "/images/stores/klook.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-tatacliq-neu",
        title: "Flat ₹500 Instant Discount Using Tata Neu Credit Cards",
        description: "Apply promo code on qualifying Tata CLiQ cart orders.",
        code: "NEUCARD",
        type: "coupon",
        discountType: "fixed",
        discountValue: "₹500 OFF",
        affiliateUrl: "https://www.tatacliq.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Tata Cliq",
        merchantSlug: "tata-cliq",
        merchantLogo: "/images/stores/tata-cliq.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-nykaa-20",
        title: "Flat 20% Off on First Beauty & Skincare Purchase + Pink Friday Combos",
        description: "Valid on eligible cosmetics and skincare products for new shoppers on Nykaa.",
        code: "NYKAA20",
        type: "coupon",
        discountType: "percentage",
        discountValue: "20% OFF",
        affiliateUrl: "https://www.nykaa.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Nykaa Beauty",
        merchantSlug: "nykaa-beauty",
        merchantLogo: "/images/stores/nykaa-beauty.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-airindia-mc",
        title: "Up to ₹600 Off Flight Bookings with Mastercard",
        description: "Applicable on eligible domestic and select international flights.",
        code: "FLYMASTER",
        type: "coupon",
        discountType: "fixed",
        discountValue: "₹600 OFF",
        affiliateUrl: "https://www.airindiaexpress.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Air India Express",
        merchantSlug: "air-india-express",
        merchantLogo: "/images/stores/air-india-express.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-klook-sbi",
        title: "20% Off International Activities & Tours with SBI Cards",
        description: "Apply at checkout on Singapore, Vietnam, Japan, and Europe attractions.",
        code: "SBICKLOOK20",
        type: "coupon",
        discountType: "percentage",
        discountValue: "20% OFF",
        affiliateUrl: "https://www.klook.com/en-IN/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Klook",
        merchantSlug: "klook",
        merchantLogo: "/images/stores/klook.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-tatacliq-lux",
        title: "Tata CLiQ Luxury: Flat 12% Off for New Shoppers",
        description: "Apply code on select luxury apparel, watches, and handbags.",
        code: "LUXNEW",
        type: "coupon",
        discountType: "percentage",
        discountValue: "12% OFF",
        affiliateUrl: "https://www.tatacliq.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Tata Cliq",
        merchantSlug: "tata-cliq",
        merchantLogo: "/images/stores/tata-cliq.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-amazon-bf",
        title: "Black Friday Electronics & Appliances: Up to 60% Off + 10% Bank Instant Discount",
        description: "Stack eligible HDFC, ICICI, or SBI card offers at Amazon India checkout with Free Prime Shipping.",
        code: null,
        type: "deal",
        discountType: "percentage",
        discountValue: "60% OFF",
        affiliateUrl: "https://www.amazon.in/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Amazon India",
        merchantSlug: "amazon",
        merchantLogo: "/images/stores/amazon.png",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-flipkart-bf",
        title: "Flipkart Black Friday Sale: Up to 80% Off + Extra Axis/HDFC Bank Offer",
        description: "Verified price drops across smartphones, laptops, home appliances, and fashion.",
        code: null,
        type: "deal",
        discountType: "percentage",
        discountValue: "80% OFF",
        affiliateUrl: "https://www.flipkart.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Flipkart",
        merchantSlug: "flipkart",
        merchantLogo: "/images/stores/flipkart.png",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-ajio-bf",
        title: "AJIO Black Friday Fashion Sale: Up to 70% Off Top Footwear & Apparel + Free Delivery on First Order",
        description: "Automatic sale markdowns plus eligible SBI/HDFC bank card offers on select orders.",
        code: null,
        type: "deal",
        discountType: "percentage",
        discountValue: "70% OFF",
        affiliateUrl: "https://www.ajio.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "AJIO",
        merchantSlug: "ajio",
        merchantLogo: "/images/stores/ajio.png",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-myntra-eors",
        title: "Myntra Fashion & Winterwear Deals: 50%–80% Off Top Brands",
        description: "Save across sneakers, jackets, ethnicwear, and beauty bundles with Kotak & ICICI card offers.",
        code: null,
        type: "deal",
        discountType: "percentage",
        discountValue: "80% OFF",
        affiliateUrl: "https://www.myntra.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Myntra",
        merchantSlug: "myntra",
        merchantLogo: "/images/stores/myntra.png",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-croma-tech",
        title: "Croma Black Friday Tech Deals: Up to 50% Off Appliances, Laptops & iPads",
        description: "Combine store markdowns with eligible HDFC/ICICI instant card offers and No-Cost EMI.",
        code: null,
        type: "deal",
        discountType: "percentage",
        discountValue: "50% OFF",
        affiliateUrl: "https://www.croma.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Croma Retail",
        merchantSlug: "croma-retail",
        merchantLogo: "/images/stores/croma-retail.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-wellbeing",
        title: "Wellbeing Nutrition Bundles: Up to 25% Off Plant Protein & Daily Melts + Free Shipping",
        description: "Extra prepaid cart savings on wellness & nutrition combos above ₹499.",
        code: null,
        type: "deal",
        discountType: "percentage",
        discountValue: "25% OFF",
        affiliateUrl: "https://wellbeingnutrition.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Wellbeing Nutrition",
        merchantSlug: "wellbeing-nutrition",
        merchantLogo: "/images/stores/wellbeing-nutrition.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-swiggy-axis",
        title: "Swiggy Food Delivery: 15% Off up to ₹100 with Axis Bank Cards",
        description: "Applicable on qualifying restaurant food orders above ₹400.",
        code: "AXIS150",
        type: "coupon",
        discountType: "percentage",
        discountValue: "15% OFF",
        affiliateUrl: "https://www.swiggy.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Swiggy",
        merchantSlug: "swiggy",
        merchantLogo: "/images/stores/swiggy.png",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-mmt-hdfc",
        title: "MakeMyTrip Domestic Flights & Hotels: Flat 12% Off with HDFC Bank Cards",
        description: "Use promo code with HDFC Bank Credit Cards on minimum booking of ₹4,000.",
        code: "HDFCDOM",
        type: "coupon",
        discountType: "percentage",
        discountValue: "12% OFF",
        affiliateUrl: "https://www.makemytrip.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "MakeMyTrip",
        merchantSlug: "makemytrip-hotels",
        merchantLogo: "/images/stores/makemytrip-hotels.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-puma-outlet",
        title: "Puma India Footwear & Sportswear: Up to 50% Off + Extra 5% Prepaid Savings",
        description: "Free shipping on prepaid sneakers, Nitro running shoes, and apparel.",
        code: null,
        type: "deal",
        discountType: "percentage",
        discountValue: "50% OFF",
        affiliateUrl: "https://in.puma.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Puma India",
        merchantSlug: "puma",
        merchantLogo: "/images/stores/puma-sg.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-plum-bogo",
        title: "Plum Goodness Skincare BOGO & Free Full-Size Gifts on Orders Above ₹999",
        description: "Buy 2 Get 2 / Buy 1 Get 1 skincare deals plus free shipping above ₹399.",
        code: null,
        type: "deal",
        discountType: "percentage",
        discountValue: "BOGO",
        affiliateUrl: "https://plumgoodness.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Plum Goodness",
        merchantSlug: "plum-goodness",
        merchantLogo: "/images/stores/plum-goodness.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-bellavita-bogo",
        title: "Bella Vita Luxury Perfumes: Buy 2 Get 1 Free & Gift Combos Up to 45% Off",
        description: "Save on CEO Man, Oud, and luxury fragrance discovery sets with free prepaid shipping.",
        code: null,
        type: "deal",
        discountType: "percentage",
        discountValue: "45% OFF",
        affiliateUrl: "https://bellavitaorganic.com/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Bella Vita",
        merchantSlug: "bella-vita",
        merchantLogo: "/images/stores/bella-vita.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
    {
        id: "fb-cpn-reliance-digital",
        title: "Reliance Digital Appliances & Smartphones: Up to 45% Off + Instant Card Discounts",
        description: "Save on LED TVs, refrigerators, and smartphones with No-Cost EMI and exchange perks.",
        code: null,
        type: "deal",
        discountType: "percentage",
        discountValue: "45% OFF",
        affiliateUrl: "https://www.reliancedigital.in/",
        expiresAt: null,
        isVerified: true,
        isExclusive: false,
        merchantName: "Reliance Digital",
        merchantSlug: "reliance-digital",
        merchantLogo: "/images/stores/reliance-digital.jpg",
        createdAt: new Date("2026-11-20T00:00:00Z"),
    },
];

export interface FallbackBankOffer {
    id: string;
    bankSlug: string;
    storeSlug: string;
    discountDetails: string;
    terms: string;
}

export interface FallbackBank {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    description: string;
    seoTitle: string;
    isActive: boolean;
    _count: { bankOffers: number };
}

export const FALLBACK_BANK_OFFERS: FallbackBankOffer[] = [
    { id: "fb-bo-1", bankSlug: "icici", storeSlug: "amazon", discountDetails: "5% Unlimited Cashback on Amazon Pay ICICI Card", terms: "Directly credited to Amazon Pay balance every month. 5% for Prime, 3% for non-Prime members." },
    { id: "fb-bo-2", bankSlug: "hdfc", storeSlug: "amazon", discountDetails: "10% Instant Discount up to ₹1,500 on HDFC Credit Cards", terms: "Valid on min order value ₹5,000 across electronics, home appliances, and fashion." },
    { id: "fb-bo-3", bankSlug: "sbi", storeSlug: "amazon", discountDetails: "10% Instant Savings on SBI Credit Cards", terms: "Applicable on smartphones and electronics during festive sales with min cart ₹4,999." },
    { id: "fb-bo-4", bankSlug: "axis", storeSlug: "flipkart", discountDetails: "5% Unlimited Cashback with Flipkart Axis Bank Card", terms: "No minimum purchase required. Direct credit to monthly card statement." },
    { id: "fb-bo-5", bankSlug: "icici", storeSlug: "flipkart", discountDetails: "10% Instant Discount on ICICI Bank Cards", terms: "On minimum order value of ₹4,999 across appliances and tech accessories." },
    { id: "fb-bo-6", bankSlug: "kotak", storeSlug: "flipkart", discountDetails: "10% Instant Savings on Kotak Mahindra Bank Cards", terms: "Valid on fashion and beauty orders above ₹2,000." },
    { id: "fb-bo-7", bankSlug: "kotak", storeSlug: "myntra", discountDetails: "10% Instant Discount up to ₹1,000 on Kotak Cards", terms: "Valid on minimum spend of ₹2,500 on top fashion brands." },
    { id: "fb-bo-8", bankSlug: "icici", storeSlug: "myntra", discountDetails: "Flat 10% Off with ICICI Bank Credit & Debit Cards", terms: "Applicable on apparel and footwear with minimum order value of ₹2,999." },
    { id: "fb-bo-9", bankSlug: "hdfc", storeSlug: "myntra", discountDetails: "10% Instant Off on HDFC Bank Cards", terms: "On min order value of ₹3,000. Stackable with select product-level coupons." },
    { id: "fb-bo-10", bankSlug: "hdfc", storeSlug: "swiggy", discountDetails: "10% Cashback on Swiggy HDFC Bank Credit Card", terms: "Max cashback ₹1,500 per billing cycle, credited directly as Swiggy Money." },
    { id: "fb-bo-11", bankSlug: "axis", storeSlug: "swiggy", discountDetails: "15% Off up to ₹100 using Axis Bank Cards", terms: "Use coupon AXIS150 during checkout. Minimum order value ₹400." },
    { id: "fb-bo-12", bankSlug: "icici", storeSlug: "swiggy", discountDetails: "20% Off up to ₹120 on ICICI Bank Net Banking", terms: "Valid on food delivery orders above ₹499 on select weekdays." },
    { id: "fb-bo-13", bankSlug: "icici", storeSlug: "zomato", discountDetails: "Flat ₹50 Off on orders above ₹299 with ICICI Bank", terms: "Valid once per week per customer across all restaurants on Zomato." },
    { id: "fb-bo-14", bankSlug: "hdfc", storeSlug: "zomato", discountDetails: "15% Off up to ₹150 on Zomato Dining", terms: "Pay dining bills with HDFC Bank Credit or Debit Cards." },
    { id: "fb-bo-15", bankSlug: "sbi", storeSlug: "zomato", discountDetails: "10% Instant Discount on SBI Credit Cards", terms: "Applicable on weekend dining bills and food delivery." },
    { id: "fb-bo-16", bankSlug: "hdfc", storeSlug: "croma-retail", discountDetails: "Up to ₹3,000 Instant Discount + No-Cost EMI on HDFC Cards", terms: "Valid on refrigerators, ACs, LED TVs, and laptops above ₹15,000." },
    { id: "fb-bo-17", bankSlug: "icici", storeSlug: "croma-retail", discountDetails: "10% Instant Off up to ₹2,500 with ICICI Bank Cards", terms: "On minimum purchase of ₹12,000 in-store and online at croma.com." },
    { id: "fb-bo-18", bankSlug: "sbi", storeSlug: "ajio", discountDetails: "10% Instant Off on SBI Credit Cards", terms: "On minimum cart value of ₹2,999 during festive fashion sales." },
    { id: "fb-bo-19", bankSlug: "hdfc", storeSlug: "ajio", discountDetails: "Flat 10% Instant Discount up to ₹1,000 on HDFC Cards", terms: "Valid on premium footwear and apparel collections." },
    { id: "fb-bo-20", bankSlug: "au-bank", storeSlug: "nykaa-beauty", discountDetails: "10% Instant Discount up to ₹500 on AU Bank Cards", terms: "Valid on cosmetics and skincare on minimum order of ₹1,500." },
    { id: "fb-bo-21", bankSlug: "icici", storeSlug: "nykaa-beauty", discountDetails: "10% Off with ICICI Bank Debit & Credit Cards", terms: "On luxury beauty and fragrance brands during seasonal sales." },
    { id: "fb-bo-22", bankSlug: "hdfc", storeSlug: "makemytrip-hotels", discountDetails: "Flat 12% Off on Domestic Flights & Hotel Bookings", terms: "Use coupon HDFCDOM with HDFC Bank Credit Cards on minimum booking ₹4,000." },
    { id: "fb-bo-23", bankSlug: "icici", storeSlug: "makemytrip-hotels", discountDetails: "Up to ₹2,000 Instant Discount on ICICI Bank Cards", terms: "Applicable on Monday domestic flight bookings." },
    { id: "fb-bo-24", bankSlug: "sbi", storeSlug: "klook", discountDetails: "20% Off International Activities & Tours with SBI Cards", terms: "Use code SBICKLOOK20 at Klook checkout on qualifying bookings." },
];

export const FALLBACK_BANKS: FallbackBank[] = [
    {
        id: "bank-hdfc",
        name: "HDFC Bank",
        slug: "hdfc",
        logo: null,
        description: "Verified HDFC Bank credit and debit card offers, Millennia and Regalia card discounts, and no-cost EMI deals across India's top retailers.",
        seoTitle: "HDFC Bank Credit & Debit Card Offers, Coupons & Instant Discounts",
        isActive: true,
        _count: { bankOffers: FALLBACK_BANK_OFFERS.filter((o) => o.bankSlug === "hdfc").length },
    },
    {
        id: "bank-icici",
        name: "ICICI Bank",
        slug: "icici",
        logo: null,
        description: "Exclusive ICICI Bank credit card discounts, Amazon Pay ICICI card 5% cashback, net banking promotions, and instant checkout vouchers.",
        seoTitle: "ICICI Bank Credit Card Offers, Instant Discounts & Coupons",
        isActive: true,
        _count: { bankOffers: FALLBACK_BANK_OFFERS.filter((o) => o.bankSlug === "icici").length },
    },
    {
        id: "bank-sbi",
        name: "SBI Card",
        slug: "sbi",
        logo: null,
        description: "State Bank of India (SBI) credit card deals, SimplyCLICK and Cashback card offers, festive shopping savings, and electronics discounts.",
        seoTitle: "SBI Credit Card Offers, Coupons & Instant Discounts",
        isActive: true,
        _count: { bankOffers: FALLBACK_BANK_OFFERS.filter((o) => o.bankSlug === "sbi").length },
    },
    {
        id: "bank-axis",
        name: "Axis Bank",
        slug: "axis",
        logo: null,
        description: "Axis Bank credit and debit card instant discounts, Flipkart Axis Bank 5% unlimited cashback, dining delights, and flight booking vouchers.",
        seoTitle: "Axis Bank Card Offers, Coupons & Cashback Deals",
        isActive: true,
        _count: { bankOffers: FALLBACK_BANK_OFFERS.filter((o) => o.bankSlug === "axis").length },
    },
    {
        id: "bank-kotak",
        name: "Kotak Mahindra Bank",
        slug: "kotak",
        logo: null,
        description: "Kotak Mahindra Bank credit card discounts, 811 account deals, and seasonal sale promotions across fashion, electronics, and dining.",
        seoTitle: "Kotak Bank Credit Card Offers, Coupons & Instant Discounts",
        isActive: true,
        _count: { bankOffers: FALLBACK_BANK_OFFERS.filter((o) => o.bankSlug === "kotak").length },
    },
    {
        id: "bank-au-bank",
        name: "AU Small Finance Bank",
        slug: "au-bank",
        logo: null,
        description: "AU Small Finance Bank credit and debit card offers, monthly dining cashbacks, and instant percentage discounts on top Indian shopping apps.",
        seoTitle: "AU Bank Card Offers, Coupons & Promo Codes",
        isActive: true,
        _count: { bankOffers: FALLBACK_BANK_OFFERS.filter((o) => o.bankSlug === "au-bank").length },
    },
];

export interface FallbackCollection {
    id: string;
    name: string;
    slug: string;
    type: string;
    seoTitle: string;
    seoDescription: string;
    content: string;
    faqContent: string;
    isIndexable: boolean;
    priority: number;
    couponIds: string[];
}

export const FALLBACK_COLLECTIONS: FallbackCollection[] = [
    {
        id: "col-new-user-coupons",
        name: "New User Coupons & First Order Promo Codes",
        slug: "new-user-coupons",
        type: "CURATED",
        seoTitle: "New User Coupons & First Order Promo Codes India",
        seoDescription: "Verified first-order coupon codes and welcome discounts for new shoppers across Nykaa, Tata CLiQ Luxury, AJIO, and Klook.",
        content: "Save extra on your very first order across India's top shopping apps with verified new-user promo codes, welcome discounts, and free first-order delivery.",
        faqContent: JSON.stringify([
            { question: "How do new-user coupon codes work?", answer: "New-user promo codes apply to accounts placing their first order on a retailer's website or app, typically offering 12%–20% off or flat ₹200–₹500 savings." },
            { question: "Can I stack a welcome code with a bank card offer?", answer: "Yes, on most platforms like Nykaa, AJIO, and Tata CLiQ, first-order promo codes can be combined with instant bank discounts if the post-coupon total meets the bank's minimum spend." },
        ]),
        isIndexable: true,
        priority: 100,
        couponIds: ["fb-cpn-nykaa-20", "fb-cpn-tatacliq-lux", "fb-cpn-klook-unpack", "fb-cpn-ajio-bf", "fb-cpn-wellbeing"],
    },
    {
        id: "col-free-shipping-codes",
        name: "Free Shipping Promo Codes & Zero Delivery Fee Deals",
        slug: "free-shipping-codes",
        type: "CURATED",
        seoTitle: "Free Shipping Promo Codes & Zero Delivery Deals India",
        seoDescription: "Shop with zero delivery charges across Amazon India, AJIO, Puma, Wellbeing Nutrition, Plum Goodness, and Bella Vita.",
        content: "Skip shipping charges with verified free-delivery offers, prepaid shipping perks, and first-order zero-delivery deals across top Indian online stores.",
        faqContent: JSON.stringify([
            { question: "How can I avoid delivery charges when shopping online in India?", answer: "Choose prepaid UPI/card checkout where many D2C brands waive shipping fees, meet the free-shipping cart threshold (₹299–₹499), or use Prime/Plus/Insider memberships." },
        ]),
        isIndexable: true,
        priority: 90,
        couponIds: ["fb-cpn-amazon-bf", "fb-cpn-ajio-bf", "fb-cpn-wellbeing", "fb-cpn-puma-outlet", "fb-cpn-plum-bogo", "fb-cpn-bellavita-bogo"],
    },
    {
        id: "col-bogo-deals",
        name: "Buy 1 Get 1 Free (BOGO) Deals & Bundle Offers",
        slug: "bogo-deals",
        type: "CURATED",
        seoTitle: "Buy 1 Get 1 Free (BOGO) Deals & Skincare/Perfume Bundles India",
        seoDescription: "Verified Buy 1 Get 1 Free and Buy 2 Get 1 combos on skincare, perfumes, fashion, and beauty at Nykaa, Plum Goodness, and Bella Vita.",
        content: "Double your cart value with verified BOGO promotions, multi-pack combos, and free-gift tiers across beauty, fragrance, and wellness stores in India.",
        faqContent: JSON.stringify([
            { question: "How do Buy 1 Get 1 (BOGO) offers apply at checkout?", answer: "Add two qualifying items to your cart — the lower-priced item automatically drops to ₹0 or applies proportionally across both products at checkout." },
        ]),
        isIndexable: true,
        priority: 85,
        couponIds: ["fb-cpn-plum-bogo", "fb-cpn-bellavita-bogo", "fb-cpn-nykaa-20", "fb-cpn-wellbeing"],
    },
    {
        id: "col-flight-coupons",
        name: "Flight Coupons & Travel Booking Promo Codes",
        slug: "flight-coupons",
        type: "TRAVEL",
        seoTitle: "Flight Coupons & Domestic/International Travel Promo Codes India",
        seoDescription: "Save on domestic & international flights, hotels, and tours with verified promo codes on Air India Express, MakeMyTrip, and Klook.",
        content: "Book domestic and international flights, Indian hotels, and sightseeing tours for less using hand-verified travel coupon codes and bank card instant rebates.",
        faqContent: JSON.stringify([
            { question: "What is the best promo code for flight bookings in India right now?", answer: "Use verified Mastercard and HDFC/ICICI bank codes like FLYMASTER on Air India Express or HDFCDOM on MakeMyTrip to save ₹600–₹2,000 per booking." },
        ]),
        isIndexable: true,
        priority: 95,
        couponIds: ["fb-cpn-airindia-mc", "fb-cpn-mmt-hdfc", "fb-cpn-klook-unpack", "fb-cpn-klook-sbi"],
    },
];

export function getFallbackMerchantBySlug(slug: string): PublicMerchant | null {
    const found = FALLBACK_STORES.find((s) => s.slug === slug);
    if (!found) return null;
    const contents = [
        found.shippingPolicy ? { id: `${found.id}-ship`, type: "SHIPPING", content: found.shippingPolicy, updatedAt: new Date("2026-11-20T00:00:00Z") } : null,
        found.returnsPolicy ? { id: `${found.id}-ret`, type: "RETURNS", content: found.returnsPolicy, updatedAt: new Date("2026-11-20T00:00:00Z") } : null,
        found.studentPolicy ? { id: `${found.id}-stu`, type: "STUDENT", content: found.studentPolicy, updatedAt: new Date("2026-11-20T00:00:00Z") } : null,
    ].filter(Boolean) as Array<{ id: string; type: string; content: string; updatedAt: Date }>;

    return {
        id: found.id,
        name: found.name,
        slug: found.slug,
        description: found.description,
        seoTitle: `${found.name} Coupon Code (Nov 2026): ${found.offerCount} Verified Deals`,
        seoDescription: found.description,
        logo: found.logo,
        website: found.website,
        cashbackRate: found.cashbackRate,
        cashbackType: found.cashbackRate ? "percentage" : null,
        offerCount: found.offerCount,
        activeOfferCount: found.offerCount,
        isFeatured: found.isFeatured,
        contents,
        histories: [],
        categories: [
            {
                id: `cat-${found.categorySlug}`,
                name: found.primaryCategory,
                slug: found.categorySlug,
            },
        ],
    };
}

export function getFallbackCouponsByStoreSlug(slug: string): PublicCoupon[] {
    const direct = FALLBACK_COUPONS.filter((c) => c.merchantSlug === slug);
    if (direct.length > 0) return direct;
    const store = FALLBACK_STORES.find((s) => s.slug === slug);
    if (!store) return [];
    return [
        {
            id: `fb-cpn-gen-${store.slug}`,
            title: `${store.name} Verified Deals & Seasonal Offers`,
            description: store.description,
            code: null,
            type: "deal",
            discountType: "percentage",
            discountValue: store.cashbackRate || "Best Deal",
            affiliateUrl: store.website,
            expiresAt: null,
            isVerified: true,
            isExclusive: false,
            merchantName: store.name,
            merchantSlug: store.slug,
            merchantLogo: store.logo,
            createdAt: new Date("2026-11-20T00:00:00Z"),
        },
    ];
}

export function getFallbackCompetitors(excludeStoreId: string, categoryIds: string[], limit: number = 6) {
    const normalizedSlugs = new Set(
        categoryIds.map((id) => id.replace(/^cat-/, "").toLowerCase())
    );
    const sameCategory = FALLBACK_STORES.filter(
        (s) => s.id !== excludeStoreId && s.slug !== excludeStoreId && (normalizedSlugs.size === 0 || normalizedSlugs.has(s.categorySlug))
    );
    const pool = sameCategory.length >= limit
        ? sameCategory
        : [...sameCategory, ...FALLBACK_STORES.filter((s) => s.id !== excludeStoreId && !sameCategory.some((x) => x.id === s.id))];

    return pool.slice(0, limit).map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        logo: c.logo,
        savings: c.cashbackRate ? `${c.cashbackRate} Cashback` : `${c.offerCount} Offers`,
        isBetter: false,
    }));
}

export function getFallbackBankOffersForStore(storeIdOrSlug: string) {
    const store = FALLBACK_STORES.find((s) => s.id === storeIdOrSlug || s.slug === storeIdOrSlug);
    if (!store) return [];
    return FALLBACK_BANK_OFFERS.filter((o) => o.storeSlug === store.slug).map((o) => {
        const bank = FALLBACK_BANKS.find((b) => b.slug === o.bankSlug);
        return {
            id: o.id,
            bankId: bank?.id || `bank-${o.bankSlug}`,
            storeId: store.id,
            discountDetails: o.discountDetails,
            discountValue: o.discountDetails,
            terms: o.terms,
            isActive: true,
            createdAt: new Date("2026-11-20T00:00:00Z"),
            bank: bank || { id: `bank-${o.bankSlug}`, name: o.bankSlug.toUpperCase(), slug: o.bankSlug, logo: null },
        };
    });
}

export function getFallbackBankBySlug(slug: string) {
    const bank = FALLBACK_BANKS.find((b) => b.slug === slug);
    if (!bank) return null;
    const bankOffers = FALLBACK_BANK_OFFERS.filter((o) => o.bankSlug === slug).map((o) => {
        const store = FALLBACK_STORES.find((s) => s.slug === o.storeSlug) || null;
        return {
            id: o.id,
            bankId: bank.id,
            storeId: store?.id || null,
            discountDetails: o.discountDetails,
            terms: o.terms,
            isActive: true,
            createdAt: new Date("2026-11-20T00:00:00Z"),
            store: store
                ? {
                      id: store.id,
                      name: store.name,
                      slug: store.slug,
                      logo: store.logo,
                      description: store.description,
                      cashbackRate: store.cashbackRate,
                  }
                : null,
        };
    });
    return {
        ...bank,
        bankOffers,
    };
}

export function getFallbackBankCoupons(bankName: string, storeSlug?: string) {
    const kw = bankName.replace(/Bank|Card|Mahindra|Small Finance/gi, "").trim().toLowerCase();
    return FALLBACK_COUPONS.filter((c) => {
        if (storeSlug && c.merchantSlug !== storeSlug) return false;
        const text = `${c.title} ${c.description || ""} ${c.code || ""}`.toLowerCase();
        return kw.length > 0 && text.includes(kw);
    }).map((c) => ({
        ...c,
        merchantIdentity: {
            store: {
                id: `fb-${c.merchantSlug}`,
                name: c.merchantName,
                slug: c.merchantSlug,
                logo: c.merchantLogo,
            },
        },
    }));
}

export function getFallbackCategoryBySlug(dbSlug: string) {
    const cat = FALLBACK_CATEGORIES.find((c) => c.slug === dbSlug);
    if (!cat) return null;

    const matchingStores = FALLBACK_STORES.filter((s) => s.categorySlug === cat.slug);
    const stores = matchingStores.length > 0 ? matchingStores : FALLBACK_STORES.slice(0, 8);
    const storeSlugs = new Set(stores.map((s) => s.slug));

    const matchingCoupons = FALLBACK_COUPONS.filter((c) => storeSlugs.has(c.merchantSlug));
    const coupons = (matchingCoupons.length > 0 ? matchingCoupons : FALLBACK_COUPONS.slice(0, 6)).map((c) => ({
        ...c,
        merchantIdentity: {
            store: {
                id: `fb-${c.merchantSlug}`,
                name: c.merchantName,
                slug: c.merchantSlug,
                logo: c.merchantLogo,
            },
        },
    }));

    return {
        category: cat,
        stores,
        coupons,
    };
}

export function getFallbackCollectionBySlug(slug: string) {
    const col = FALLBACK_COLLECTIONS.find((c) => c.slug === slug);
    if (!col) return null;

    const coupons = col.couponIds
        .map((id) => FALLBACK_COUPONS.find((c) => c.id === id))
        .filter((c): c is PublicCoupon => Boolean(c))
        .map((c) => ({
            ...c,
            merchantIdentity: {
                store: {
                    id: `fb-${c.merchantSlug}`,
                    name: c.merchantName,
                    slug: c.merchantSlug,
                    logo: c.merchantLogo,
                },
            },
        }));

    return {
        ...col,
        coupons,
    };
}

export function getFallbackCompareStore(slug: string) {
    const merchant = getFallbackMerchantBySlug(slug);
    if (!merchant) return null;
    const coupons = getFallbackCouponsByStoreSlug(slug).slice(0, 3);
    return {
        id: merchant.id,
        name: merchant.name,
        slug: merchant.slug,
        logo: merchant.logo,
        website: merchant.website,
        cashbackRate: merchant.cashbackRate,
        cashbackType: merchant.cashbackType,
        offerCount: merchant.offerCount,
        activeOfferCount: merchant.activeOfferCount,
        knowledgeDensity: 0.75,
        storeContents: merchant.contents,
        merchantIdentity: {
            coupons,
        },
    };
}
