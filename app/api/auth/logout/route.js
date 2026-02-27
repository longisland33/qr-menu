import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Çıxış edildi" });
  
  // Cookie-ni silmək üçün maxAge-i 0 edirik
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  
  return response;
}