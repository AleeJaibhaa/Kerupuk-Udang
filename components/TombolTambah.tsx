"use client";

import { useState } from "react";
import { useKeranjang } from "./KeranjangProvider";

export function TombolTambah({
  slug,
  qty = 1,
  label = "Tambah",
  className = "btn btn-oranye btn-kecil",
}: {
  slug: string;
  qty?: number;
  label?: string;
  className?: string;
}) {
  const { tambah } = useKeranjang();
  const [ditambahkan, setDitambahkan] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        tambah(slug, qty);
        setDitambahkan(true);
        window.setTimeout(() => setDitambahkan(false), 1600);
      }}
      aria-live="polite"
    >
      {ditambahkan ? "✓ Masuk keranjang" : label}
    </button>
  );
}
