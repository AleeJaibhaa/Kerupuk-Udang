import { promises as fs } from "node:fs";
import path from "node:path";
import { getProduct } from "./products";
import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  StoreSettings,
} from "./types";

const DATA_FILE =
  process.env.UDANGKRIUK_DATA_FILE ??
  path.join(process.cwd(), "data", "store.json");

const PENGATURAN_AWAL: StoreSettings = {
  namaToko: "UdangKriuk",
  nomorWhatsApp: "6281234567890",
  pesanPembuka:
    "Halo Admin UdangKriuk, saya ingin bertanya mengenai produk yang dijual.",
  alamat: "Jl. Raya Pesisir No. 12, Sidoarjo, Jawa Timur 61218",
  jamOperasional: "Senin – Sabtu: 08.00 – 20.00 WIB\nMinggu: 09.00 – 17.00 WIB",
  email: "halo@udangkriuk.id",
};

type Database = {
  pengaturan: StoreSettings;
  pesanan: Order[];
  nomorTerakhir: number;
};

const KOSONG: Database = {
  pengaturan: PENGATURAN_AWAL,
  pesanan: [],
  nomorTerakhir: 0,
};

let antrean: Promise<unknown> = Promise.resolve();

/** Menjalankan penulisan berkas satu per satu agar data tidak saling menimpa. */
function denganKunci<T>(kerja: () => Promise<T>): Promise<T> {
  const hasil = antrean.then(kerja, kerja);
  antrean = hasil.catch(() => undefined);
  return hasil;
}

async function bacaDatabase(): Promise<Database> {
  try {
    const mentah = await fs.readFile(DATA_FILE, "utf8");
    const data = JSON.parse(mentah) as Partial<Database>;
    return {
      pengaturan: { ...PENGATURAN_AWAL, ...(data.pengaturan ?? {}) },
      pesanan: Array.isArray(data.pesanan) ? data.pesanan : [],
      nomorTerakhir: Number(data.nomorTerakhir) || 0,
    };
  } catch {
    return structuredClone(KOSONG);
  }
}

async function tulisDatabase(data: Database): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function getPengaturan(): Promise<StoreSettings> {
  const data = await bacaDatabase();
  return data.pengaturan;
}

export async function simpanPengaturan(
  perubahan: Partial<StoreSettings>,
): Promise<StoreSettings> {
  return denganKunci(async () => {
    const data = await bacaDatabase();
    const pengaturan: StoreSettings = {
      namaToko: (perubahan.namaToko ?? data.pengaturan.namaToko).trim(),
      nomorWhatsApp: (perubahan.nomorWhatsApp ?? data.pengaturan.nomorWhatsApp).trim(),
      pesanPembuka: (perubahan.pesanPembuka ?? data.pengaturan.pesanPembuka).trim(),
      alamat: (perubahan.alamat ?? data.pengaturan.alamat).trim(),
      jamOperasional: (perubahan.jamOperasional ?? data.pengaturan.jamOperasional).trim(),
      email: (perubahan.email ?? data.pengaturan.email).trim(),
    };
    data.pengaturan = pengaturan;
    await tulisDatabase(data);
    return pengaturan;
  });
}

export async function daftarPesanan(): Promise<Order[]> {
  const data = await bacaDatabase();
  return [...data.pesanan].sort((a, b) => b.dibuatPada.localeCompare(a.dibuatPada));
}

export async function cariPesanan(kode: string): Promise<Order | null> {
  const data = await bacaDatabase();
  return data.pesanan.find((p) => p.kode === kode.toUpperCase()) ?? null;
}

export type ItemMasukan = { slug: string; qty: number };

export type PesananBaru = {
  nama: string;
  whatsapp: string;
  alamat: string;
  catatan?: string;
  items: ItemMasukan[];
};

export class KesalahanPesanan extends Error {}

export async function buatPesanan(masukan: PesananBaru): Promise<Order> {
  const nama = masukan.nama?.trim() ?? "";
  const whatsapp = masukan.whatsapp?.trim() ?? "";
  const alamat = masukan.alamat?.trim() ?? "";

  if (!nama) throw new KesalahanPesanan("Nama pelanggan wajib diisi.");
  if (!/\d{8,15}/.test(whatsapp.replace(/\D/g, "")))
    throw new KesalahanPesanan("Nomor WhatsApp tidak valid.");
  if (!alamat) throw new KesalahanPesanan("Alamat pengiriman wajib diisi.");
  if (!Array.isArray(masukan.items) || masukan.items.length === 0)
    throw new KesalahanPesanan("Keranjang masih kosong.");

  const items: OrderItem[] = [];
  for (const masukanItem of masukan.items) {
    const produk = getProduct(masukanItem.slug);
    if (!produk) throw new KesalahanPesanan(`Produk tidak ditemukan.`);
    const qty = Math.max(1, Math.trunc(Number(masukanItem.qty) || 0));
    if (qty > 99) throw new KesalahanPesanan("Jumlah per produk maksimal 99.");
    items.push({
      slug: produk.slug,
      nama: produk.nama,
      harga: produk.harga,
      qty,
      subtotal: produk.harga * qty,
    });
  }

  const total = items.reduce((jumlah, item) => jumlah + item.subtotal, 0);

  return denganKunci(async () => {
    const data = await bacaDatabase();
    data.nomorTerakhir += 1;
    const sekarang = new Date().toISOString();
    const pesanan: Order = {
      kode: `UK-${String(data.nomorTerakhir).padStart(4, "0")}`,
      nama,
      whatsapp,
      alamat,
      catatan: masukan.catatan?.trim() ?? "",
      items,
      total,
      status: "baru",
      pembayaran: "belum_bayar",
      dibuatPada: sekarang,
      diperbaruiPada: sekarang,
    };
    data.pesanan.push(pesanan);
    await tulisDatabase(data);
    return pesanan;
  });
}

export async function perbaruiPesanan(
  kode: string,
  perubahan: { status?: OrderStatus; pembayaran?: PaymentStatus },
): Promise<Order | null> {
  return denganKunci(async () => {
    const data = await bacaDatabase();
    const pesanan = data.pesanan.find((p) => p.kode === kode.toUpperCase());
    if (!pesanan) return null;
    if (perubahan.status) pesanan.status = perubahan.status;
    if (perubahan.pembayaran) pesanan.pembayaran = perubahan.pembayaran;
    pesanan.diperbaruiPada = new Date().toISOString();
    await tulisDatabase(data);
    return pesanan;
  });
}
