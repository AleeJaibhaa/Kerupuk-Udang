import type { Metadata } from "next";
import Link from "next/link";
import { UbahStatus } from "@/components/UbahStatus";
import { formatTanggal, rupiah } from "@/lib/format";
import { daftarPesanan } from "@/lib/store";
import { STATUS_PEMBAYARAN, STATUS_PESANAN } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Admin",
};

export default async function DashboardAdmin() {
  const pesanan = await daftarPesanan();

  const baru = pesanan.filter((p) => p.status === "baru").length;
  const dikonfirmasi = pesanan.filter((p) => p.status === "dikonfirmasi").length;
  const belumBayar = pesanan.filter((p) => p.pembayaran === "belum_bayar").length;
  const omzet = pesanan
    .filter((p) => p.status !== "dibatalkan")
    .reduce((jumlah, p) => jumlah + p.total, 0);

  return (
    <>
      <div className="admin-kepala">
        <div>
          <h1>Pesanan masuk</h1>
          <p>
            Konfirmasi pesanan dan perbarui status setelah pelanggan mengirim
            pesan WhatsApp.
          </p>
        </div>
        <Link href="/admin/pengaturan" className="btn btn-garis btn-kecil">
          ⚙️ Pengaturan kontak
        </Link>
      </div>

      <div className="stat-grid">
        <div className="stat-kartu">
          <span>Total pesanan</span>
          <strong>{pesanan.length}</strong>
        </div>
        <div className="stat-kartu">
          <span>Baru dibuat</span>
          <strong>{baru}</strong>
        </div>
        <div className="stat-kartu">
          <span>Sudah dikonfirmasi</span>
          <strong>{dikonfirmasi}</strong>
        </div>
        <div className="stat-kartu">
          <span>Belum dibayar</span>
          <strong>{belumBayar}</strong>
        </div>
        <div className="stat-kartu">
          <span>Nilai pesanan</span>
          <strong style={{ fontSize: "1.25rem" }}>{rupiah(omzet)}</strong>
        </div>
      </div>

      <div className="tabel-wrap" style={{ marginBottom: 60 }}>
        {pesanan.length === 0 ? (
          <div className="admin-kosong">
            Belum ada pesanan. Pesanan dari halaman checkout akan muncul di sini
            secara otomatis.
          </div>
        ) : (
          <table className="tabel tabel-admin">
            <thead>
              <tr>
                <th>Pesanan</th>
                <th>Pelanggan</th>
                <th>Alamat</th>
                <th>Produk</th>
                <th className="angka">Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pesanan.map((item) => (
                <tr key={item.kode}>
                  <td>
                    <span className="kode">{item.kode}</span>
                    <span className="sub">{formatTanggal(item.dibuatPada)} WIB</span>
                  </td>
                  <td>
                    {item.nama}
                    <span className="sub">{item.whatsapp}</span>
                  </td>
                  <td style={{ maxWidth: 220 }}>
                    <span className="sub" style={{ whiteSpace: "pre-line" }}>
                      {item.alamat}
                    </span>
                  </td>
                  <td>
                    {item.items.map((baris) => (
                      <span className="sub" key={baris.slug}>
                        {baris.nama} · {baris.qty}x · {rupiah(baris.subtotal)}
                      </span>
                    ))}
                    {item.catatan ? (
                      <span className="sub">Catatan: {item.catatan}</span>
                    ) : null}
                  </td>
                  <td className="angka" style={{ fontWeight: 800 }}>
                    {rupiah(item.total)}
                  </td>
                  <td>
                    <UbahStatus
                      kode={item.kode}
                      status={item.status}
                      pembayaran={item.pembayaran}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="petunjuk" style={{ marginBottom: 40 }}>
        Status pesanan:{" "}
        {STATUS_PESANAN.map((s) => s.label).join(" · ")} — status pembayaran:{" "}
        {STATUS_PEMBAYARAN.map((s) => s.label).join(" · ")}.
      </p>
    </>
  );
}
