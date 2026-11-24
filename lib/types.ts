export type Product = {
  slug: string;
  nama: string;
  rasa: string;
  harga: number;
  berat: string;
  deskripsi: string;
  komposisi: string[];
  unggulan?: boolean;
  emoji: string;
  warna: { dari: string; ke: string };
};

export type StoreSettings = {
  namaToko: string;
  nomorWhatsApp: string;
  pesanPembuka: string;
  alamat: string;
  jamOperasional: string;
  email: string;
};

export type OrderItem = {
  slug: string;
  nama: string;
  harga: number;
  qty: number;
  subtotal: number;
};

export type OrderStatus = "baru" | "dikonfirmasi" | "selesai" | "dibatalkan";
export type PaymentStatus = "belum_bayar" | "sudah_bayar";

export type Order = {
  kode: string;
  nama: string;
  whatsapp: string;
  alamat: string;
  catatan: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  pembayaran: PaymentStatus;
  dibuatPada: string;
  diperbaruiPada: string;
};

export const STATUS_PESANAN: { value: OrderStatus; label: string }[] = [
  { value: "baru", label: "Baru dibuat" },
  { value: "dikonfirmasi", label: "Sudah dikonfirmasi" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

export const STATUS_PEMBAYARAN: { value: PaymentStatus; label: string }[] = [
  { value: "belum_bayar", label: "Belum dibayar" },
  { value: "sudah_bayar", label: "Sudah dibayar" },
];
