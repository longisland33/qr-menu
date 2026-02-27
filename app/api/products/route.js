import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
// GET: Herkese açık (Müşteri menüsü için)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Məhsullar gətirilmədi" }, { status: 500 });
  }
}

// POST: Koruma altında (Middleware sayesinde buraya sadece Admin girebilir)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const price = formData.get("price");
    const categoryId = formData.get("categoryId");
    const description = formData.get("description") || "";
    const imageFile = formData.get("image");

    if (!name || !price || !categoryId || !imageFile) {
      return NextResponse.json({ error: "Məlumatlar tam deyil" }, { status: 400 });
    }

    // 1. Faylı Buffer-ə çeviririk (Cloudinary-yə göndərmək üçün)
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Cloudinary-yə yükləyirik
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "restaurant_menu" }, // Cloudinary-də qovluq adı
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 3. Məhsulu Prisma vasitəsilə DB-ya yazırıq (Şəkil URL-i ilə)
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        categoryId,
        image: uploadResponse.secure_url, // Cloudinary-dən gələn URL
        description,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Cloudinary Error:", error);
    return NextResponse.json({ error: "Yükləmə xətası baş verdi" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID tapılmadı" }, { status: 400 });

    // 1. Məhsulu bazadan tapırıq ki, şəkil URL-ni götürək
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Məhsul yoxdur" }, { status: 404 });

    // 2. Cloudinary-dən şəkli silirik (əgər şəkil varsa)
    if (product.image && product.image.includes("cloudinary")) {
      const parts = product.image.split('/');
      const fileName = parts[parts.length - 1].split('.')[0]; // şəklin adını götürür
      const folderName = "restaurant_menu"; // Yüklədiyin qovluq adı
      const publicId = `${folderName}/${fileName}`;
      
      await cloudinary.uploader.destroy(publicId);
    }

    // 3. Bazadan silirik
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Məhsul silindi" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Silinmə xətası" }, { status: 500 });
  }
}