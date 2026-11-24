import Link from "next/link";
import type { StoreSettings } from "@/lib/types";
import {
  buatLinkWhatsApp,
  namaToko as namaTokoDari,
  pesanPembuka,
  tampilkanNomor,
} from "@/lib/whatsapp";
import { TombolWhatsApp } from "./TombolWhatsApp";

export function Footer({ pengaturan }: { pengaturan: StoreSettings }) {
  const nama = namaTokoDari(pengaturan);
  const nomor = tampilkanNomor(pengaturan.nomorWhatsApp);
  const tautan = buatLinkWhatsApp(
    pengaturan.nomorWhatsApp,
    pesanPembuka(pengaturan),
  );
  const email = pengaturan.email?.trim();

  return (
    <footer className="situs-footer">
      <div className="wadah">
        <div className="footer-kisi">
          <div className="footer-kolom">
            <h3>Kontak Admin</h3>
            <div className="kontak-baris">
              <span className="ikon" aria-hidden="true">
                💬
              </span>
              <div>
                <strong>WhatsApp toko</strong>
                {nomor ? (
                  tautan ? (
                    <a href={tautan} target="_blank" rel="noopener noreferrer">
                      {nomor}
                    </a>
                  ) : (
                    nomor
                  )
                ) : (
                  <span>Belum dikonfigurasi</span>
                )}
              </div>
            </div>
            <div className="footer-aksi">
              <TombolWhatsApp
                href={tautan}
                label="Hubungi Kami"
                className="btn btn-wa btn-kecil"
              />
              <Link href="/produk" className="btn btn-garis btn-kecil">
                Lihat Produk
              </Link>
            </div>
          </div>

          <div className="footer-kolom">
            <h3>Kunjungi Toko</h3>
            <div className="kontak-baris">
              <span className="ikon" aria-hidden="true">
                📍
              </span>
              <div>
                <strong>Alamat</strong>
                <span>{pengaturan.alamat || "Belum diisi"}</span>
              </div>
            </div>
            <div className="kontak-baris">
              <span className="ikon" aria-hidden="true">
                ✉️
              </span>
              <div>
                <strong>Email</strong>
                {email ? <a href={`mailto:${email}`}>{email}</a> : <span>Belum diisi</span>}
              </div>
            </div>
          </div>

          <div className="footer-kolom">
            <h3>Jam Operasional</h3>
            <p className="jam">{pengaturan.jamOperasional || "Belum diisi"}</p>
            <div className="kontak-baris" style={{ marginTop: 14 }}>
              <span className="ikon" aria-hidden="true">
                🛒
              </span>
              <div>
                <strong>Cara pesan</strong>
                <span>
                  Checkout di website, lalu kirim ringkasan pesanan lewat WhatsApp
                  untuk dikonfirmasi admin.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bawah">
          <span>
            © {new Date().getFullYear()} {nama}. Kerupuk udang buatan Indonesia.
          </span>
          <span>
            <Link href="/admin">Dashboard Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
