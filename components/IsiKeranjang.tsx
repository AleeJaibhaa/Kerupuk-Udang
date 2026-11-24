"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useKeranjang } from "@/components/KeranjangProvider";
import { ProdukArt } from "@/components/ProdukArt";
import { rupiah } from "@/lib/format";
import { getProduct } from "@/lib/products";

export function IsiKeranjang() {
  const { items, siap, aturQty, hapus } = useKeranjang();

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
  const totalQty = baris.reduce((jumlah, item) => jumlah + item.qty, 0);

  if (!siap) {
    return (
      <p className="kosong-teks" style={{ padding: "40px 0" }}>
        Memuat keranjang…
      </p>
    );
  }

  if (baris.length === 0) {
    return (
      <div className="keranjang-kisi">
        <div className="kosong">
          <span className="emoji" aria-hidden="true">
            🛒
          </span>
          <h2>Keranjang masih kosong</h2>
          <p>
            Tambahkan kerupuk udang favorit Anda dari katalog, lalu kembali ke
            halaman ini.
          </p>
          <Link href="/produk" className="btn btn-oranye">
            Lihat katalog produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="keranjang-kisi">
      <div className="daftar-keranjang">
        {baris.map(({ produk, qty, subtotal }) => (
          <div className="item-keranjang" key={produk.slug}>
            <ProdukArt
              produk={produk}
              className="item-art"
              tampilkanCap={false}
            />
            <div className="item-info">
              <h3>
                <Link href={`/produk/${produk.slug}`}>{produk.nama}</Link>
              </h3>
              <p>
                {rupiah(produk.harga)} · {produk.berat}
              </p>
              <p style={{ marginTop: 4, fontWeight: 700, color: "var(--tinta)" }}>
                Subtotal {rupiah(subtotal)}
              </p>
            </div>
            <div className="item-aksi">
              <div className="qty-kontrol">
                <button
                  type="button"
                  onClick={() => aturQty(produk.slug, qty - 1)}
                  aria-label={`Kurangi ${produk.nama}`}
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  onClick={() => aturQty(produk.slug, qty + 1)}
                  aria-label={`Tambah ${produk.nama}`}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="hapus"
                onClick={() => hapus(produk.slug)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <aside className="ringkasan">
        <h2>Ringkasan pesanan</h2>
        <div className="baris">
          <span>Jumlah produk</span>
          <span>{totalQty} item</span>
        </div>
        <div className="baris">
          <span>Subtotal</span>
          <span>{rupiah(total)}</span>
        </div>
        <div className="baris">
          <span>Ongkos kirim</span>
          <span>Dikonfirmasi admin</span>
        </div>
        <div className="baris total">
          <span>Total</span>
          <span>{rupiah(total)}</span>
        </div>
        <Link href="/checkout" className="btn btn-utama btn-lebar">
          Lanjut ke checkout
        </Link>
        <p className="catatan-kecil">
          <span aria-hidden="true">ℹ️</span>
          Ringkasan pesanan akan dikirim ke WhatsApp admin untuk dikonfirmasi
          manual.
        </p>
      </aside>
    </div>
  );
}
