import { NextResponse } from "next/server";
import { cariPesanan, perbaruiPesanan } from "@/lib/store";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_SAH: OrderStatus[] = ["baru", "dikonfirmasi", "selesai", "dibatalkan"];
const PEMBAYARAN_SAH: PaymentStatus[] = ["belum_bayar", "sudah_bayar"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kode: string }> },
) {
  const { kode } = await params;
  const pesanan = await cariPesanan(kode);
  if (!pesanan) {
    return NextResponse.json({ pesan: "Pesanan tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ pesanan });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ kode: string }> },
) {
  const { kode } = await params;
  const badan = await request.json().catch(() => ({}));

  const perubahan: { status?: OrderStatus; pembayaran?: PaymentStatus } = {};
  if (badan?.status !== undefined) {
    if (!STATUS_SAH.includes(badan.status)) {
      return NextResponse.json({ pesan: "Status pesanan tidak dikenal." }, { status: 400 });
    }
    perubahan.status = badan.status;
  }
  if (badan?.pembayaran !== undefined) {
    if (!PEMBAYARAN_SAH.includes(badan.pembayaran)) {
      return NextResponse.json({ pesan: "Status pembayaran tidak dikenal." }, { status: 400 });
    }
    perubahan.pembayaran = badan.pembayaran;
  }
  if (!perubahan.status && !perubahan.pembayaran) {
    return NextResponse.json({ pesan: "Tidak ada perubahan dikirim." }, { status: 400 });
  }

  const pesanan = await perbaruiPesanan(kode, perubahan);
  if (!pesanan) {
    return NextResponse.json({ pesan: "Pesanan tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ pesanan });
}
