import { NextResponse } from "next/server";
import { getPengaturan, simpanPengaturan } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const pengaturan = await getPengaturan();
  return NextResponse.json({ pengaturan });
}

export async function PUT(request: Request) {
  const badan = await request.json().catch(() => null);
  if (!badan || typeof badan !== "object") {
    return NextResponse.json({ pesan: "Data pengaturan tidak valid." }, { status: 400 });
  }

  const pengaturan = await simpanPengaturan({
    namaToko: typeof badan.namaToko === "string" ? badan.namaToko : undefined,
    nomorWhatsApp:
      typeof badan.nomorWhatsApp === "string" ? badan.nomorWhatsApp : undefined,
    pesanPembuka:
      typeof badan.pesanPembuka === "string" ? badan.pesanPembuka : undefined,
    alamat: typeof badan.alamat === "string" ? badan.alamat : undefined,
    jamOperasional:
      typeof badan.jamOperasional === "string" ? badan.jamOperasional : undefined,
    email: typeof badan.email === "string" ? badan.email : undefined,
  });

  return NextResponse.json({ pengaturan });
}
