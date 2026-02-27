import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

// GET: Herkese açık (Müşteri menüde görecek)
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        products: true, // BU SATIR ÖNEMLİ: Kategorinin içindeki ürünleri de getirir
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Kategoriler getirilemedi" }, { status: 500 });
  }
}

// POST: Sadece Admin (Middleware tarafından korunuyor)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Kategori adı gerekli" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Kategori oluşturulamadı" }, { status: 500 });
  }
}