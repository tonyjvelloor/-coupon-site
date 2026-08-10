const fs = require('fs');
const path = require('path');

const files = [
"src/app/llms.txt/route.ts",
"src/app/feed.xml/route.ts",
"src/app/admin/(dashboard)/campaign-links/new/page.tsx",
"src/app/admin/(dashboard)/campaign-links/page.tsx",
"src/app/(public)/offers/[slug]/page.tsx",
"src/app/(public)/calendar/page.tsx",
"src/app/(public)/category/[slug]/page.tsx",
"src/app/(public)/stores/[slug]/faq/page.tsx",
"src/app/(public)/stores/[slug]/student-discount/page.tsx",
"src/app/(public)/stores/[slug]/shipping/page.tsx",
"src/app/(public)/stores/[slug]/returns/page.tsx",
"src/app/(public)/stores/[slug]/page.tsx",
"src/app/(public)/stores/[slug]/buying-guide/page.tsx",
"src/app/(public)/blog/page.tsx",
"src/app/(public)/blog/[slug]/page.tsx",
"src/app/(public)/news/[slug]/page.tsx",
"src/app/(public)/page.tsx"
];

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/"https:\/\/couponhub\.store"/g, '"https://www.couponhub.store"');
    content = content.replace(/'https:\/\/couponhub\.store'/g, '"https://www.couponhub.store"');
    content = content.replace(/`https:\/\/couponhub\.store/g, '`https://www.couponhub.store');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
