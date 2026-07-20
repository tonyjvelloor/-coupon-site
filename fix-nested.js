const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace heavily nested merchantIdentities
    while (content.includes('merchantIdentity: { include: { merchantIdentity: { include: {')) {
        content = content.replace(/merchantIdentity:\s*\{\s*include:\s*\{\s*merchantIdentity:\s*\{\s*include:\s*\{\s*store:\s*true\s*\}\s*\}\s*\}\s*\}/g, 'merchantIdentity: { include: { store: true } }');
    }
    
    // Fix string like:
    // merchantIdentity: { include: { merchantIdentity: { include: { merchantIdentity: { include: { store: true } } } } } }
    let regex = /(merchantIdentity:\s*\{\s*include:\s*\{\s*)+store:\s*true(\s*\}\s*\})+/g;
    content = content.replace(regex, 'merchantIdentity: { include: { store: true } }');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
