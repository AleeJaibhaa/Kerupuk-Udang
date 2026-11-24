import { rupiah } from "./format";
import type { Order, Product, StoreSettings } from "./types";

export const PESAN_PEMBUKA_DEFAULT =
  "Halo Admin UdangKriuk, saya ingin bertanya mengenai produk yang dijual.";

/**
 * Mengubah nomor menjadi format internasional tanpa tanda +, spasi, atau
 * karakter khusus. Nomor lokal yang diawali 0 atau 8 diubah ke kode negara 62.
 */
export function normalisasiNomor(input?: string | null): string {
  const digit = (input ?? "").replace(/\D/g, "");
  if (!digit) return "";
  if (digit.startsWith("0")) return `62${digit.slice(1)}`;
  if (digit.startsWith("8")) return `62${digit}`;
  return digit;
}

/** Format nomor untuk ditampilkan, mis. +62 812-3456-7890. */
export function tampilkanNomor(input?: string | null): string {
  const nomor = normalisasiNomor(input);
  if (!nomor) return "";
  const kodeNegara = nomor.startsWith("62") ? "62" : "";
  const lokal = kodeNegara ? nomor.slice(2) : nomor;
  const kelompok = lokal.match(/.{1,4}/g) ?? [lokal];
  return kodeNegara
    ? `+62 ${kelompok.join("-")}`
    : `+${kelompok.join("-")}`;
}

/**
 * Membuat tautan wa.me. Mengembalikan null bila nomor belum dikonfigurasi,
 * sehingga antarmuka bisa menampilkan notifikasi.
 */
export function buatLinkWhatsApp(
  nomor: string | null | undefined,
  pesan: string,
): string | null {
  const tujuan = normalisasiNomor(nomor);
  if (!tujuan) return null;
  const teks = pesan ? `?text=${encodeURIComponent(pesan)}` : "";
  return `https://wa.me/${tujuan}${teks}`;
}

export function namaToko(settings: StoreSettings): string {
  return settings.namaToko?.trim() || "UdangKriuk";
}

export function pesanPembuka(settings: StoreSettings): string {
  return (
    settings.pesanPembuka?.trim() ||
    `Halo Admin ${namaToko(settings)}, saya ingin bertanya mengenai produk yang dijual.`
  );
}

export function pesanProduk(produk: Product, settings: StoreSettings): string {
  return `Halo Admin ${namaToko(settings)}, saya ingin bertanya mengenai produk ${produk.nama} dengan harga ${rupiah(
    produk.harga,
  )}. Apakah produk ini masih tersedia?`;
}

export function pesanPesanan(pesanan: Order, settings: StoreSettings): string {
  const daftar = pesanan.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.nama} (${item.qty}x @ ${rupiah(item.harga)}) = ${rupiah(item.subtotal)}`,
    )
    .join("\n");

  const baris = [
    `Halo Admin ${namaToko(settings)}, saya ingin melakukan pemesanan.`,
    "",
    `Nomor Pesanan: ${pesanan.kode}`,
    "",
    `Nama: ${pesanan.nama}`,
    `WhatsApp: ${pesanan.whatsapp}`,
    `Alamat: ${pesanan.alamat}`,
    "",
    "Daftar Pesanan:",
    daftar,
    "",
    `Total Pembayaran: ${rupiah(pesanan.total)}`,
  ];

  if (pesanan.catatan?.trim()) {
    baris.push("", `Catatan: ${pesanan.catatan.trim()}`);
  }

  baris.push("", "Mohon konfirmasi pesanan saya. Terima kasih.");

  return baris.join("\n");
}
