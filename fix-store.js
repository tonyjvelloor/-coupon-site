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

const files = walk('./src/app');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace include: { store: true } -> include: { merchantIdentity: { include: { store: true } } }
    content = content.replace(/include:\s*\{\s*store:\s*true\s*\}/g, 'include: { merchantIdentity: { include: { store: true } } }');
    
    // Same for include: { ..., store: true, ... } - only replacing the exact token
    content = content.replace(/store:\s*true/g, 'merchantIdentity: { include: { store: true } }');
    
    // Fix coupon creation route
    content = content.replace(/storeId: data\.storeId/g, 'merchantIdentityId: data.storeId');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
