const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.tsx');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('text-merchant-900')) {
    fs.writeFileSync(file, content.replace(/text-merchant-900/g, 'text-slate-900 text-gray-900'));
  }
}
