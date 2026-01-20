const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Seed Products
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    if (fs.existsSync(productsPath)) {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        console.log(`Found ${products.length} products.`);

        for (const p of products) {
            await prisma.product.create({
                data: {
                    name: p.name,
                    price: p.price,
                    image: p.image, // Note: This will need to be updated to Cloudinary URL eventually if re-uploading
                    description: p.description,
                    sale: p.sale,
                    discount: p.discount
                }
            });
        }
        console.log('Products seeded.');
    }

    // Seed Blogs
    const blogsPath = path.join(process.cwd(), 'data', 'blogs.json');
    if (fs.existsSync(blogsPath)) {
        const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
        console.log(`Found ${blogs.length} blogs.`);

        for (const b of blogs) {
            await prisma.blog.create({
                data: {
                    title: b.title,
                    image: b.image,
                    description: b.description,
                    date: b.date,
                    externalLink: b.externalLink || null
                }
            });
        }
        console.log('Blogs seeded.');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
