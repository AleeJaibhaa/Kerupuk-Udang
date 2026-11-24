import type { Product } from "./types";

export const products: Product[] = [
  {
    slug: "kerupuk-udang-original",
    nama: "Kerupuk Udang Original",
    rasa: "Gurih udang asli",
    harga: 15000,
    berat: "200 gram",
    deskripsi:
      "Kerupuk udang klasik dengan rasa gurih yang bersahabat. Dibuat dari udang segar pilihan dan digoreng dua kali agar renyah tahan lama.",
    komposisi: ["Udang segar 35%", "Tepung tapioka", "Bawang putih", "Garam laut", "Minyak kelapa sawit"],
    unggulan: true,
    emoji: "🦐",
    warna: { dari: "#FDBA74", ke: "#EA580C" },
  },
  {
    slug: "kerupuk-udang-balado",
    nama: "Kerupuk Udang Balado",
    rasa: "Pedas balado",
    harga: 18000,
    berat: "200 gram",
    deskripsi:
      "Perpaduan udang gurih dengan bumbu balado khas Padang. Pedasnya hangat, tidak menyengat, dan bikin nagih satu demi satu.",
    komposisi: ["Udang segar 33%", "Tepung tapioka", "Cabai merah keriting", "Tomat", "Bawang merah", "Garam"],
    unggulan: true,
    emoji: "🌶️",
    warna: { dari: "#FCA5A5", ke: "#B91C1C" },
  },
  {
    slug: "kerupuk-udang-pedas-daun-jeruk",
    nama: "Kerupuk Udang Pedas Daun Jeruk",
    rasa: "Pedas segar daun jeruk",
    harga: 19000,
    berat: "200 gram",
    deskripsi:
      "Pedas yang ringan dengan aroma daun jeruk yang wangi. Cocok untuk teman nasi hangat atau camilan sore.",
    komposisi: ["Udang segar 32%", "Tepung tapioka", "Cabai rawit", "Daun jeruk", "Garam", "Minyak kelapa sawit"],
    emoji: "🍃",
    warna: { dari: "#BBF7D0", ke: "#15803D" },
  },
  {
    slug: "kerupuk-udang-bawang",
    nama: "Kerupuk Udang Bawang",
    rasa: "Bawang gurih",
    harga: 17000,
    berat: "200 gram",
    deskripsi:
      "Aroma bawang goreng yang kuat berpadu udang pilihan. Teksturnya tebal dan mengembang sempurna saat digoreng.",
    komposisi: ["Udang segar 30%", "Tepung tapioka", "Bawang putih", "Bawang merah", "Garam"],
    emoji: "🧄",
    warna: { dari: "#FDE68A", ke: "#B45309" },
  },
  {
    slug: "kerupuk-udang-keju",
    nama: "Kerupuk Udang Keju",
    rasa: "Keju creamy",
    harga: 20000,
    berat: "200 gram",
    deskripsi:
      "Varian favorit anak-anak: gurih udang dengan taburan bumbu keju. Renyah, ringan, dan tidak berminyak.",
    komposisi: ["Udang segar 30%", "Tepung tapioka", "Bubuk keju", "Susu bubuk", "Garam"],
    emoji: "🧀",
    warna: { dari: "#FEF08A", ke: "#CA8A04" },
  },
  {
    slug: "kerupuk-udang-mentah",
    nama: "Kerupuk Udang Mentah",
    rasa: "Original (belum digoreng)",
    harga: 22000,
    berat: "500 gram",
    deskripsi:
      "Kerupuk mentah siap goreng untuk stok di rumah. Simpan di tempat kering, goreng dalam minyak panas sekitar 15 detik.",
    komposisi: ["Udang segar 35%", "Tepung tapioka", "Bawang putih", "Garam", "Pengembang alami"],
    emoji: "📦",
    warna: { dari: "#FBCFE8", ke: "#9D174D" },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const kategoriRasa = ["Semua", ...Array.from(new Set(products.map((p) => p.rasa)))];
