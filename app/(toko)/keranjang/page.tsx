import type { Metadata } from "next";
import { IsiKeranjang } from "@/components/IsiKeranjang";

export const metadata: Metadata = {
  title: "Keranjang Belanja",
};

export default function HalamanKeranjang() {
  return (
    <>
      <section className="kepala-halaman">
        <div className="wadah">
          <p className="remah">
            <a href="/">Beranda</a> / Keranjang
          </p>
          <h1>Keranjang belanja</h1>
          <p>
            Periksa jumlah pesanan Anda, lalu lanjutkan ke checkout untuk membuat
            nomor pesanan.
          </p>
        </div>
      </section>

      <div className="wadah">
        <IsiKeranjang />
      </div>
    </>
  );
}
