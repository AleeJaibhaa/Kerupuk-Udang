"use client";

import Link from "next/link";
import { useState } from "react";
import { useKeranjang } from "@/components/KeranjangProvider";
import { TombolTambah } from "@/components/TombolTambah";
import { rupiah } from "@/lib/format";
import type { Product } from "@/lib/types";

export function PanelBeli({ produk }: { produk: Product }) {
  const [qty, setQty] = useState(1);
  const { items, siap, aturQty } = useKeranjang();
  const diKeranjang = siap
    ? items.find((item) => item.slug === produk.slug)?.qty ?? 0
    : 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div className="qty-kontrol">
          <button
            type="button"
            onClick={() => setQty((n) => Math.max(1, n - 1))}
            disabled={qty <= 1}
            aria-label="Kurangi jumlah"
          >
            −
          </button>
          <span aria-live="polite">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((n) => Math.min(99, n + 1))}
            disabled={qty >= 99}
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
        <TombolTambah
          slug={produk.slug}
          qty={qty}
          label={`Tambah ke keranjang · ${rupiah(produk.harga * qty)}`}
          className="btn btn-oranye"
        />
        <Link href="/keranjang" className="btn btn-garis">
          Lihat keranjang
        </Link>
      </div>

      {diKeranjang > 0 ? (
        <div className="petunjuk">
          {diKeranjang} produk ini sudah ada di keranjang.{" "}
          <button
            type="button"
            className="hapus"
            onClick={() => aturQty(produk.slug, 0)}
          >
            Hapus dari keranjang
          </button>
        </div>
      ) : null}
    </div>
  );
}
