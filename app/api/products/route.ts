import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

// Force dynamic rendering to prevent build-time DB connection issues
// Force dynamic rendering to prevent build-time DB connection issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    try {
        let products;
        if (query) {
            products = await prisma.product.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ]
                },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            products = await prisma.product.findMany({
                orderBy: { createdAt: 'desc' }
            });
        }

        // Convert Decimal/Int to formats compatible if needed (Prisma returns objects)
        // Adjusting ID to number if client expects number, though Schema uses Int (which is number).
        // Our client expects 'id' as number.

        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File | null;
        const name = formData.get('name') as string;
        const price = formData.get('price') as string;
        const description = formData.get('description') as string;
        const sale = formData.get('sale') === 'true';
        const discount = Number(formData.get('discount') || 0);

        let imageUrl = "";

        // Cloudinary Upload Logic
        if (file && file.size > 0) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload via Promise wrapper
            const uploadResult: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "lxry-clothing" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            imageUrl = uploadResult.secure_url;
        } else {
            const imageString = formData.get('image');
            if (typeof imageString === 'string') {
                imageUrl = imageString;
            }
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                price,
                image: imageUrl,
                description,
                sale,
                discount
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: data
        });

        return NextResponse.json(updatedProduct);
    } catch (e) {
        console.error("Update error:", e);
        return NextResponse.json({ error: 'Update failed' }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    try {
        await prisma.product.delete({
            where: { id: id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
