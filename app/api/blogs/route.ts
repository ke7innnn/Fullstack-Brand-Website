import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

// GET: Fetch all blogs
export async function GET() {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(blogs);
    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}

// POST: Add new blog (with image upload)
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('image') as File | null;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const externalLink = formData.get('externalLink') as string;

        let imageUrl = "";

        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "lxry-clothing-journal" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            imageUrl = uploadResult.secure_url;
        }

        const newBlog = await prisma.blog.create({
            data: {
                title,
                description,
                externalLink: externalLink || '',
                image: imageUrl,
                date: new Date().toISOString().split('T')[0]
            }
        });

        return NextResponse.json(newBlog, { status: 201 });
    } catch (error) {
        console.error("Failed to create blog", error);
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}

// DELETE: Remove blog
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.blog.delete({
            where: { id: id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete blog", error);
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}
