import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body; // username olaraq Admin modelindəki 'name' sahəsini yoxlayacağıq

    if (!username || !password) {
      return NextResponse.json({ error: "İstifadəçi adı və şifrə mütləqdir" }, { status: 400 });
    }

    // Artıq email yoxdur, birbaşa Admin modelində name və password yoxlanılır
    const adminUser = await prisma.admin.findUnique({
      where: { 
        name: username 
      },
    });

    // İstifadəçi tapılmasa və ya şifrə düz gəlməsə
    if (!adminUser || adminUser.password !== password) {
      return NextResponse.json({ error: "İstifadəçi adı və ya şifrə yanlışdır" }, { status: 401 });
    }

    // JWT Token yaradılması
    const token = jwt.sign(
      { 
        id: adminUser.id, 
        role: "admin", 
        name: adminUser.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      success: true,
      role: "admin",
      name: adminUser.name
    });

    // Cookie tənzimləməsi
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 gün
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return NextResponse.json({ error: "Server daxili xətası" }, { status: 500 });
  }
}