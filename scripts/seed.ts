
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env and .env.local
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

const prisma = new PrismaClient();

// Configure Cloudinary explicitly if needed, or rely on env vars
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface LegacyProduct {
    id: number | string;
    name: string;
    price: string;
    image: string;
    description: string;
    sale: boolean;
    discount: number;
}

async function migrateProducts() {
    console.log("Starting Product Migration...");

    try {
        const jsonPath = path.join(process.cwd(), "data", "products.json");
        const fileContent = await fs.readFile(jsonPath, "utf-8");
        const products: LegacyProduct[] = JSON.parse(fileContent);

        console.log(`Found ${products.length} products to migrate.`);

        for (const p of products) {
            console.log(`Processing Product: ${p.name} (ID: ${p.id})`);

            const existing = await prisma.product.findUnique({
                where: { id: p.id.toString() }
            });

            if (existing) {
                console.log(`  - Skipped (Already exists)`);
                continue;
            }

            let finalImage = p.image;

            if (p.image.startsWith("/")) {
                try {
                    const localImagePath = path.join(process.cwd(), "public", p.image);
                    await fs.access(localImagePath);

                    console.log(`  - Uploading ${localImagePath} to Cloudinary...`);

                    const uploadResult = await cloudinary.uploader.upload(localImagePath, {
                        folder: "lxry-clothing-migration",
                        public_id: `migrated_${p.id}`
                    });

                    finalImage = uploadResult.secure_url;
                    console.log(`  - Uploaded: ${finalImage}`);
                } catch (imgError) {
                    console.error(`  - Failed to upload image:`, imgError);
                }
            }

            await prisma.product.create({
                data: {
                    id: p.id.toString(),
                    name: p.name,
                    price: p.price,
                    image: finalImage,
                    description: p.description,
                    sale: p.sale,
                    discount: p.discount
                }
            });
            console.log(`  - Created in DB`);
        }
    } catch (error) {
        console.error("Product Migration failed:", error);
    }
}

async function migrateBlogs() {
    console.log("Starting Blog Migration...");
    try {
        const jsonPath = path.join(process.cwd(), "data", "blogs.json");
        try {
            await fs.access(jsonPath);
        } catch {
            console.log("No blogs.json found, skipping blog migration.");
            return;
        }

        const fileContent = await fs.readFile(jsonPath, "utf-8");
        const blogs: any[] = JSON.parse(fileContent);

        console.log(`Found ${blogs.length} blogs to migrate.`);

        for (const b of blogs) {
            console.log(`Processing Blog: ${b.title} (ID: ${b.id})`);

            const existing = await prisma.blog.findUnique({
                where: { id: b.id.toString() }
            });

            if (existing) {
                console.log(`  - Skipped (Already exists)`);
                continue;
            }

            let finalImage = b.image;

            if (b.image && b.image.startsWith("/")) {
                try {
                    const localImagePath = path.join(process.cwd(), "public", b.image);
                    await fs.access(localImagePath);

                    console.log(`  - Uploading ${localImagePath} to Cloudinary...`);

                    const uploadResult = await cloudinary.uploader.upload(localImagePath, {
                        folder: "lxry-clothing-journal-migration",
                        public_id: `migrated_blog_${b.id}`
                    });

                    finalImage = uploadResult.secure_url;
                    console.log(`  - Uploaded: ${finalImage}`);
                } catch (imgError) {
                    console.error(`  - Failed to upload image:`, imgError);
                }
            }

            await prisma.blog.create({
                data: {
                    id: b.id.toString(),
                    title: b.title,
                    description: b.description,
                    externalLink: b.externalLink,
                    image: finalImage,
                    date: b.date
                }
            });
            console.log(`  - Created in DB`);
        }
    } catch (error) {
        console.error("Blog Migration failed:", error);
    }
}

async function main() {
    await migrateProducts();
    await migrateBlogs();
    await prisma.$disconnect();
}

main();
