const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files with next/image
const filesStr = execSync('grep -rlI "next/image" src').toString();
const files = filesStr.split('\n').filter(Boolean);

let changed = 0;
for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // A naive replacement for <Image that doesn't have unoptimized already
  // We match <Image followed by space or newline, and we look ahead to ensure unoptimized isn't before the closing >
  const newContent = content.replace(/<Image\s+(?![^>]*\bunoptimized\b)([^>]+)>/g, '<Image unoptimized $1>');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${file}`);
    changed++;
  }
}
console.log(`Changed ${changed} files.`);
