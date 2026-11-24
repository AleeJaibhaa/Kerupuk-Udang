"use client";

import { useMemo, useState } from "react";
import { KartuProduk } from "@/components/KartuProduk";
import { products } from "@/lib/products";

export function DaftarProduk() {
  const daftarRasa = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.rasa)))],
    [],
  );
  const [rasaAktif, setRasaAktif] = useState("Semua");

  const hasil = useMemo(
    () =>
      rasaAktif === "Semua"
        ? products
        : products.filter((p) => p.rasa === rasaAktif),
    [rasaAktif],
  );

  return (
    <>
      <div className="saringan" role="group" aria-label="Saring berdasarkan rasa">
        {daftarRasa.map((rasa) => (
          <button
            key={rasa}
            type="button"
            className={`chip${rasa === rasaAktif ? " aktif" : ""}`}
            onClick={() => setRasaAktif(rasa)}
            aria-pressed={rasa === rasaAktif}
          >
            {rasa}
          </button>
        ))}
      </div>

      {hasil.length === 0 ? (
        <p className="kosong-teks">Belum ada produk pada kategori ini.</p>
      ) : (
        <div className="grid-produk">
          {hasil.map((produk) => (
            <KartuProduk key={produk.slug} produk={produk} />
          ))}
        </div>
      )}
    </>
  );
}
