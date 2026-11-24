"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ItemKeranjang = { slug: string; qty: number };

type NilaiKeranjang = {
  items: ItemKeranjang[];
  siap: boolean;
  totalQty: number;
  tambah: (slug: string, qty?: number) => void;
  aturQty: (slug: string, qty: number) => void;
  hapus: (slug: string) => void;
  kosongkan: () => void;
};

const KunciPenyimpanan = "udangkriuk-keranjang";
const KeranjangContext = createContext<NilaiKeranjang | null>(null);

function bacaPenyimpanan(): ItemKeranjang[] {
  try {
    const mentah = window.localStorage.getItem(KunciPenyimpanan);
    if (!mentah) return [];
    const data = JSON.parse(mentah);
    if (!Array.isArray(data)) return [];
    return data
      .filter((item) => typeof item?.slug === "string" && Number(item?.qty) > 0)
      .map((item) => ({ slug: item.slug, qty: Math.min(99, Math.trunc(item.qty)) }));
  } catch {
    return [];
  }
}

export function KeranjangProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemKeranjang[]>([]);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    setItems(bacaPenyimpanan());
    setSiap(true);
  }, []);

  useEffect(() => {
    if (!siap) return;
    try {
      window.localStorage.setItem(KunciPenyimpanan, JSON.stringify(items));
    } catch {
      // penyimpanan browser penuh atau diblokir: keranjang tetap berjalan di sesi ini
    }
  }, [items, siap]);

  const tambah = useCallback((slug: string, qty = 1) => {
    setItems((sebelumnya) => {
      const ada = sebelumnya.find((item) => item.slug === slug);
      if (!ada) return [...sebelumnya, { slug, qty: Math.min(99, qty) }];
      return sebelumnya.map((item) =>
        item.slug === slug
          ? { ...item, qty: Math.min(99, item.qty + qty) }
          : item,
      );
    });
  }, []);

  const aturQty = useCallback((slug: string, qty: number) => {
    setItems((sebelumnya) =>
      sebelumnya
        .map((item) =>
          item.slug === slug
            ? { ...item, qty: Math.max(0, Math.min(99, Math.trunc(qty))) }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  }, []);

  const hapus = useCallback((slug: string) => {
    setItems((sebelumnya) => sebelumnya.filter((item) => item.slug !== slug));
  }, []);

  const kosongkan = useCallback(() => setItems([]), []);

  const totalQty = useMemo(
    () => items.reduce((jumlah, item) => jumlah + item.qty, 0),
    [items],
  );

  const nilai = useMemo(
    () => ({ items, siap, totalQty, tambah, aturQty, hapus, kosongkan }),
    [items, siap, totalQty, tambah, aturQty, hapus, kosongkan],
  );

  return (
    <KeranjangContext.Provider value={nilai}>{children}</KeranjangContext.Provider>
  );
}

export function useKeranjang(): NilaiKeranjang {
  const konteks = useContext(KeranjangContext);
  if (!konteks) {
    throw new Error("useKeranjang harus dipakai di dalam KeranjangProvider");
  }
  return konteks;
}
