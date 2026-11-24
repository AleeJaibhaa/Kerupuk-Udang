import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TombolWhatsApp } from "@/components/TombolWhatsApp";
import { formatTanggal, rupiah } from "@/lib/format";
import { cariPesanan, getPengaturan } from "@/lib/store";
import { STATUS_PEMBAYARAN, STATUS_PESANAN } from "@/lib/types";
import {
  buatLinkWhatsApp,
  namaToko,
  pesanPesanan,
  tampilkanNomor,
} from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ringkasan Pesanan",
};

export default async function HalamanPesanan({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  const pesanan = await cariPesanan(kode);
  if (!pesanan) notFound();

  const pengaturan = await getPengaturan();
  const tautanWhatsApp = buatLinkWhatsApp(
    pengaturan.nomorWhatsApp,
    pesanPesanan(pesanan, pengaturan),
  );
  const labelStatus =
    STATUS_PESANAN.find((s) => s.value === pesanan.status)?.label ?? pesanan.status;
  const labelBayar =
    STATUS_PEMBAYARAN.find((s) => s.value === pesanan.pembayaran)?.label ??
    pesanan.pembayaran;

  return (
    <section className="bagian">
      <div className="wadah" style={{ maxWidth: 880 }}>
        <div className="pesanan-kepala">
          <div>
            <p className="petunjuk">Pesanan berhasil dibuat</p>
            <p className="kode-pesanan">{pesanan.kode}</p>
            <p className="petunjuk">
              Dibuat {formatTanggal(pesanan.dibuatPada)} WIB
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className={`lencana-status status-${pesanan.status}`}>
              {labelStatus}
            </span>
            <span className={`lencana-status bayar-${pesanan.pembayaran}`}>
              {labelBayar}
            </span>
          </div>
        </div>

        <div className="kartu-panel">
          <h2>Ringkasan pesanan</h2>
          <p className="petunjuk">
            Pastikan data sudah benar sebelum dikirim ke admin.
          </p>

          <div className="info-pesanan">
            <div>
              <h3>Nama</h3>
              <p>{pesanan.nama}</p>
            </div>
            <div>
              <h3>WhatsApp</h3>
              <p>{pesanan.whatsapp}</p>
            </div>
            <div>
              <h3>Alamat pengiriman</h3>
              <p>{pesanan.alamat}</p>
            </div>
            {pesanan.catatan ? (
              <div>
                <h3>Catatan</h3>
                <p>{pesanan.catatan}</p>
              </div>
            ) : null}
          </div>

          <table className="tabel">
            <thead>
              <tr>
                <th>Produk</th>
                <th className="angka">Harga satuan</th>
                <th className="angka">Jumlah</th>
                <th className="angka">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pesanan.items.map((item) => (
                <tr key={item.slug}>
                  <td>{item.nama}</td>
                  <td className="angka">{rupiah(item.harga)}</td>
                  <td className="angka">{item.qty}x</td>
                  <td className="angka">{rupiah(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total-akhir">
            <span>Total pembayaran</span>
            <span>{rupiah(pesanan.total)}</span>
          </div>
        </div>

        <div className="kartu-panel" style={{ marginTop: 20 }}>
          <h2>Konfirmasi ke admin</h2>
          <p className="petunjuk">
            Tombol di bawah membuka WhatsApp dengan pesan pesanan yang sudah
            disiapkan. Anda hanya perlu menekan kirim.
          </p>

          <TombolWhatsApp
            href={tautanWhatsApp}
            label="Konfirmasi melalui WhatsApp"
            className="btn btn-wa btn-lebar"
          />

          {!tautanWhatsApp ? (
            <div className="peringatan">
              <span aria-hidden="true">⚠️</span>
              <span>
                Nomor WhatsApp toko belum dikonfigurasi. Pesanan Anda sudah
                tersimpan dengan kode <strong>{pesanan.kode}</strong>. Admin dapat
                mengatur nomor di Dashboard Admin → Pengaturan agar tombol ini
                aktif.
              </span>
            </div>
          ) : null}

          <p className="petunjuk" style={{ marginTop: 14 }}>
            Admin toko: {namaToko(pengaturan)}
            {pengaturan.nomorWhatsApp
              ? ` · ${tampilkanNomor(pengaturan.nomorWhatsApp)}`
              : ""}
          </p>

          <div className="peringatan">
            <span aria-hidden="true">ℹ️</span>
            <span>
              WhatsApp hanya membuka percakapan langsung. Website tidak membaca
              atau menerima balasan WhatsApp secara otomatis — admin mengonfirmasi
              dan memperbarui status pesanan secara manual melalui dashboard.
            </span>
          </div>
        </div>

        <div className="hero-aksi" style={{ marginTop: 22 }}>
          <Link href="/produk" className="btn btn-utama">
            Lanjut belanja
          </Link>
          <Link href="/keranjang" className="btn btn-garis">
            Lihat keranjang
          </Link>
        </div>
      </div>
    </section>
  );
}
