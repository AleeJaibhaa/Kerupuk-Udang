"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useKeranjang } from "@/components/KeranjangProvider";
import { rupiah } from "@/lib/format";
import { getProduct } from "@/lib/products";

type NilaiForm = {
  nama: string;
  whatsapp: string;
  alamat: string;
  catatan: string;
};

const AWAL: NilaiForm = { nama: "", whatsapp: "", alamat: "", catatan: "" };

export function FormCheckout({ whatsappSiap }: { whatsappSiap: boolean }) {
  const router = useRouter();
  const { items, siap, kosongkan } = useKeranjang();
  const [nilai, setNilai] = useState<NilaiForm>(AWAL);
  const [galat, setGalat] = useState("");
  const [mengirim, setMengirim] = useState(false);

  const baris = useMemo(
    () =>
      items
        .map((item) => {
          const produk = getProduct(item.slug);
          if (!produk) return null;
          return { produk, qty: item.qty, subtotal: produk.harga * item.qty };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    [items],
  );

  const total = baris.reduce((jumlah, item) => jumlah + item.subtotal, 0);

  function ubah(field: keyof NilaiForm, value: string) {
    setNilai((sebelumnya) => ({ ...sebelumnya, [field]: value }));
  }

  async function kirim(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mengirim) return;
    setGalat("");

    if (!nilai.nama.trim()) return setGalat("Nama pelanggan wajib diisi.");
    if (nilai.whatsapp.replace(/\D/g, "").length < 8)
      return setGalat("Nomor WhatsApp minimal 8 digit, mis. 081234567890.");
    if (!nilai.alamat.trim()) return setGalat("Alamat pengiriman wajib diisi.");

    setMengirim(true);
    try {
      const respons = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nilai,
          items: items.map((item) => ({ slug: item.slug, qty: item.qty })),
        }),
      });
      const data = await respons.json().catch(() => ({}));
      if (!respons.ok) {
        throw new Error(data?.pesan ?? "Pesanan gagal dibuat. Coba lagi.");
      }
      kosongkan();
      router.push(`/pesanan/${data.pesanan.kode}`);
    } catch (error) {
      setGalat(
        error instanceof Error ? error.message : "Pesanan gagal dibuat. Coba lagi.",
      );
      setMengirim(false);
    }
  }

  if (!siap) {
    return (
      <p className="kosong-teks" style={{ padding: "40px 0" }}>
        Memuat pesanan…
      </p>
    );
  }

  if (baris.length === 0) {
    return (
      <div className="keranjang-kisi">
        <div className="kosong">
          <span className="emoji" aria-hidden="true">
            🧾
          </span>
          <h2>Belum ada produk untuk di-checkout</h2>
          <p>Tambahkan produk ke keranjang terlebih dahulu.</p>
          <Link href="/produk" className="btn btn-oranye">
            Lihat katalog produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="keranjang-kisi" onSubmit={kirim}>
      <div className="kartu-panel">
        <h2>Data pengiriman</h2>
        <p className="petunjuk">
          Data ini dipakai untuk membuat nomor pesanan dan pesan WhatsApp ke
          admin.
        </p>

        {galat ? (
          <p className="pesan-galat" style={{ marginBottom: 16 }} role="alert">
            {galat}
          </p>
        ) : null}

        <div className="form-kisi">
          <div className="form-grup">
            <label className="label" htmlFor="nama">
              Nama pelanggan <span>*</span>
            </label>
            <input
              id="nama"
              className="input"
              value={nilai.nama}
              onChange={(e) => ubah("nama", e.target.value)}
              placeholder="Contoh: Siti Rahma"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-grup">
            <label className="label" htmlFor="whatsapp">
              Nomor WhatsApp <span>*</span>
            </label>
            <input
              id="whatsapp"
              className="input"
              value={nilai.whatsapp}
              onChange={(e) => ubah("whatsapp", e.target.value)}
              placeholder="081234567890"
              inputMode="tel"
              autoComplete="tel"
              required
            />
            <span className="petunjuk">Boleh format 08… atau 628…</span>
          </div>

          <div className="form-grup penuh">
            <label className="label" htmlFor="alamat">
              Alamat pengiriman <span>*</span>
            </label>
            <textarea
              id="alamat"
              className="textarea"
              value={nilai.alamat}
              onChange={(e) => ubah("alamat", e.target.value)}
              placeholder="Jalan, nomor rumah, kelurahan, kecamatan, kota, kode pos"
              required
            />
          </div>

          <div className="form-grup penuh">
            <label className="label" htmlFor="catatan">
              Catatan tambahan
            </label>
            <textarea
              id="catatan"
              className="textarea"
              value={nilai.catatan}
              onChange={(e) => ubah("catatan", e.target.value)}
              placeholder="Contoh: minta level pedas sedang, kirim setelah jam 15.00"
            />
          </div>
        </div>

        {!whatsappSiap ? (
          <div className="peringatan">
            <span aria-hidden="true">⚠️</span>
            <span>
              Nomor WhatsApp toko belum dikonfigurasi. Pesanan tetap tersimpan di
              sistem, namun tombol konfirmasi WhatsApp belum bisa dipakai. Hubungi
              admin lewat email sampai nomornya diatur di dashboard.
            </span>
          </div>
        ) : null}
      </div>

      <aside className="ringkasan">
        <h2>Pesanan Anda</h2>
        {baris.map(({ produk, qty, subtotal }) => (
          <div className="baris" key={produk.slug}>
            <span>
              {produk.nama} <strong>×{qty}</strong>
            </span>
            <span>{rupiah(subtotal)}</span>
          </div>
        ))}
        <div className="baris total">
          <span>Total</span>
          <span>{rupiah(total)}</span>
        </div>
        <button
          type="submit"
          className="btn btn-utama btn-lebar"
          disabled={mengirim}
        >
          {mengirim ? "Membuat pesanan…" : "Buat pesanan"}
        </button>
        <Link
          href="/keranjang"
          className="btn btn-garis btn-lebar"
          style={{ marginTop: 8 }}
        >
          Kembali ke keranjang
        </Link>
        <p className="catatan-kecil">
          <span aria-hidden="true">ℹ️</span>
          Pesanan tersimpan di sistem, lalu Anda mengirim ringkasannya ke WhatsApp
          admin untuk dikonfirmasi.
        </p>
      </aside>
    </form>
  );
}
