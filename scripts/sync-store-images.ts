import { prisma } from '../src/lib/db';
import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'stores');

// Ensure directory exists
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
    return new Promise((resolve) => {
        // Handle protocol-relative URLs
        if (url.startsWith('//')) {
            url = 'https:' + url;
        }

        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.error(`Failed to download ${url}: HTTP ${res.statusCode}`);
                resolve(false);
                return;
            }

            const fileStream = fs.createWriteStream(destPath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve(true);
            });
            fileStream.on('error', (err) => {
                console.error(`Error saving ${destPath}: ${err.message}`);
                resolve(false);
            });
        }).on('error', (err) => {
            console.error(`Error requesting ${url}: ${err.message}`);
            resolve(false);
        });
    });
}

async function main() {
    console.log('Starting store image sync...');
    const stores = await prisma.store.findMany({
        where: { 
            logo: { not: null, startsWith: 'http' },
            isActive: true
        }
    });

    console.log(`Found ${stores.length} stores with external logos.`);
    let successCount = 0;
    let failCount = 0;

    for (const store of stores) {
        if (!store.logo) continue;

        // Skip if it's already a local path
        if (store.logo.startsWith('/')) continue;

        const filename = `${store.slug}.jpg`;
        const destPath = path.join(IMAGES_DIR, filename);
        const localUrl = `/images/stores/${filename}`;

        process.stdout.write(`Downloading logo for ${store.slug}... `);
        
        try {
            const success = await downloadImage(store.logo, destPath);
            
            if (success) {
                await prisma.store.update({
                    where: { id: store.id },
                    data: { logo: localUrl }
                });
                console.log('OK');
                successCount++;
            } else {
                console.log('FAILED');
                failCount++;
            }
        } catch (err) {
            console.log(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
            failCount++;
        }
        
        // Slight delay to prevent rate limiting
        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\nSync complete! Success: ${successCount}, Failed: ${failCount}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
