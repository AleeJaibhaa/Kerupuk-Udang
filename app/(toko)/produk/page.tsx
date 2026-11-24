import type { Metadata } from "next";
import { DaftarProduk } from "@/components/DaftarProduk";

export const metadata: Metadata = {
  title: "Katalog Produk",
  description: "Semua varian kerupuk udang UdangKriuk beserta harga terbaru.",
};

export default function HalamanKatalog() {
  return (
    <>
      <section className="kepala-halaman">
        <div className="wadah">
          <p className="remah">
            <a href="/">Beranda</a> / Produk
          </p>
          <h1>Katalog kerupuk udang</h1>
          <p>
            Enam varian gurih dan renyah, dibuat dari udang segar. Pilih rasa
            favorit, lalu tanyakan stok langsung ke admin lewat WhatsApp di
            halaman produk.
          </p>
        </div>
      </section>

      <section className="bagian">
        <div className="wadah">
          <DaftarProduk />
        </div>
      </section>
    </>
  );
}
