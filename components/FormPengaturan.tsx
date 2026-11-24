"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { StoreSettings } from "@/lib/types";
import {
  buatLinkWhatsApp,
  normalisasiNomor,
  pesanPembuka,
  tampilkanNomor,
} from "@/lib/whatsapp";

export function FormPengaturan({
  pengaturanAwal,
}: {
  pengaturanAwal: StoreSettings;
}) {
  const router = useRouter();
  const [nilai, setNilai] = useState<StoreSettings>(pengaturanAwal);
  const [galat, setGalat] = useState("");
  const [sukses, setSukses] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);

  const nomorBersih = useMemo(
    () => normalisasiNomor(nilai.nomorWhatsApp),
    [nilai.nomorWhatsApp],
  );

  const pratinjauTautan = useMemo(
    () => buatLinkWhatsApp(nilai.nomorWhatsApp, pesanPembuka(nilai)),
    [nilai],
  );

  function ubah(field: keyof StoreSettings, value: string) {
    setNilai((sebelumnya) => ({ ...sebelumnya, [field]: value }));
    setSukses("");
  }

  async function simpan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (menyimpan) return;
    setGalat("");
    setSukses("");

    const nomor = nilai.nomorWhatsApp.replace(/\D/g, "");
    if (nomor && (nomor.length < 8 || nomor.length > 15)) {
      setGalat(
        "Nomor WhatsApp harus 8–15 digit. Gunakan format internasional tanpa tanda +, mis. 6281234567890.",
      );
      return;
    }

    setMenyimpan(true);
    try {
      const respons = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nilai),
      });
      const data = await respons.json().catch(() => ({}));
      if (!respons.ok) {
        throw new Error(data?.pesan ?? "Pengaturan gagal disimpan.");
      }
      setNilai(data.pengaturan);
      setSukses(
        "Pengaturan tersimpan. Nomor WhatsApp baru langsung dipakai di seluruh tombol website.",
      );
      router.refresh();
    } catch (error) {
      setGalat(
        error instanceof Error ? error.message : "Pengaturan gagal disimpan.",
      );
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <form className="pengaturan-kisi" onSubmit={simpan}>
      <div className="kartu-panel">
        <h2>Informasi toko</h2>
        <p className="petunjuk">
          Semua data di bawah tampil di footer website customer.
        </p>

        {galat ? (
          <p className="pesan-galat" style={{ marginBottom: 16 }} role="alert">
            {galat}
          </p>
        ) : null}
        {sukses ? (
          <p className="pesan-sukses" style={{ marginBottom: 16 }} role="status">
            {sukses}
          </p>
        ) : null}

        <div className="form-kisi">
          <div className="form-grup">
            <label className="label" htmlFor="namaToko">
              Nama toko
            </label>
            <input
              id="namaToko"
              className="input"
              value={nilai.namaToko}
              onChange={(e) => ubah("namaToko", e.target.value)}
              placeholder="UdangKriuk"
            />
          </div>

          <div className="form-grup">
            <label className="label" htmlFor="nomorWhatsApp">
              Nomor WhatsApp toko
            </label>
            <input
              id="nomorWhatsApp"
              className="input"
              value={nilai.nomorWhatsApp}
              onChange={(e) => ubah("nomorWhatsApp", e.target.value)}
              placeholder="6281234567890"
              inputMode="tel"
            />
            <span className="petunjuk">
              Format internasional tanpa +, spasi, atau tanda hubung. Contoh:
              6281234567890.
            </span>
            {nomorBersih ? (
              <span className="petunjuk">
                Tersimpan sebagai <strong>{nomorBersih}</strong>
                {nomorBersih !== nilai.nomorWhatsApp.replace(/\D/g, "")
                  ? " (otomatis disesuaikan)"
                  : ""}
              </span>
            ) : (
              <span className="petunjuk" style={{ color: "var(--merah)" }}>
                Nomor kosong: tombol WhatsApp akan menampilkan notifikasi belum
                dikonfigurasi.
              </span>
            )}
          </div>

          <div className="form-grup penuh">
            <label className="label" htmlFor="pesanPembuka">
              Pesan pembuka otomatis
            </label>
            <textarea
              id="pesanPembuka"
              className="textarea"
              value={nilai.pesanPembuka}
              onChange={(e) => ubah("pesanPembuka", e.target.value)}
              placeholder="Halo Admin UdangKriuk, saya ingin bertanya mengenai produk yang dijual."
            />
            <span className="petunjuk">
              Pesan ini dipakai tombol WhatsApp mengambang dan tombol “Hubungi
              Kami”. Pesan produk dan pesanan dibuat otomatis dari data pesanan.
            </span>
          </div>

          <div className="form-grup penuh">
            <label className="label" htmlFor="alamat">
              Alamat toko
            </label>
            <textarea
              id="alamat"
              className="textarea"
              value={nilai.alamat}
              onChange={(e) => ubah("alamat", e.target.value)}
              placeholder="Jl. Raya Pesisir No. 12, Sidoarjo, Jawa Timur"
              style={{ minHeight: 70 }}
            />
          </div>

          <div className="form-grup">
            <label className="label" htmlFor="jamOperasional">
              Jam operasional
            </label>
            <textarea
              id="jamOperasional"
              className="textarea"
              value={nilai.jamOperasional}
              onChange={(e) => ubah("jamOperasional", e.target.value)}
              placeholder={"Senin – Sabtu: 08.00 – 20.00 WIB\nMinggu: 09.00 – 17.00 WIB"}
              style={{ minHeight: 78 }}
            />
            <span className="petunjuk">Tiap baris ditampilkan sebagai baris baru.</span>
          </div>

          <div className="form-grup">
            <label className="label" htmlFor="email">
              Email toko
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={nilai.email}
              onChange={(e) => ubah("email", e.target.value)}
              placeholder="halo@udangkriuk.id"
            />
            <span className="petunjuk">Boleh dikosongkan.</span>
          </div>
        </div>

        <div className="hero-aksi" style={{ marginTop: 20 }}>
          <button type="submit" className="btn btn-utama" disabled={menyimpan}>
            {menyimpan ? "Menyimpan…" : "Simpan pengaturan"}
          </button>
          <button
            type="button"
            className="btn btn-garis"
            onClick={() => {
              setNilai(pengaturanAwal);
              setSukses("");
              setGalat("");
            }}
          >
            Kembalikan
          </button>
        </div>
      </div>

      <aside className="pratinjau">
        <h3>Pratinjau tombol WhatsApp</h3>
        <div className="bubble">{pesanPembuka(nilai)}</div>
        <p className="nomor">
          {nomorBersih ? (
            <>
              Dikirim ke <strong>{tampilkanNomor(nomorBersih)}</strong>
            </>
          ) : (
            "Nomor belum diatur — tombol akan menampilkan notifikasi."
          )}
        </p>
        <p className="petunjuk" style={{ color: "#c2a488", marginTop: 10 }}>
          {pratinjauTautan
            ? `Tautan: ${pratinjauTautan.slice(0, 64)}…`
            : "Tautan WhatsApp belum tersedia."}
        </p>
      </aside>
    </form>
  );
}
