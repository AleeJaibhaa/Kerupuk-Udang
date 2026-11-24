import { NextResponse } from "next/server";
import { buatPesanan, daftarPesanan, KesalahanPesanan } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const pesanan = await daftarPesanan();
  return NextResponse.json({ pesanan });
}

export async function POST(request: Request) {
  try {
    const badan = await request.json();
    const pesanan = await buatPesanan({
      nama: String(badan?.nama ?? ""),
      whatsapp: String(badan?.whatsapp ?? ""),
      alamat: String(badan?.alamat ?? ""),
      catatan: String(badan?.catatan ?? ""),
      items: Array.isArray(badan?.items) ? badan.items : [],
    });
    return NextResponse.json({ pesanan }, { status: 201 });
  } catch (error) {
    if (error instanceof KesalahanPesanan) {
      return NextResponse.json({ pesan: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { pesan: "Pesanan gagal dibuat. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
