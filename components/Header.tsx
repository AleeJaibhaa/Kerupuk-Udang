"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useKeranjang } from "./KeranjangProvider";

const tautan = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/keranjang", label: "Keranjang" },
  { href: "/admin", label: "Admin" },
];

export function Header({ namaToko }: { namaToko: string }) {
  const jalur = usePathname();
  const { totalQty } = useKeranjang();

  return (
    <header className="situs-header">
      <div className="wadah header-dalam">
        <Link href="/" className="merek" aria-label={`${namaToko} beranda`}>
          <span className="merek-emoji" aria-hidden="true">
            🦐
          </span>
          <span>
            {namaToko}
            <span className="kecil">Kerupuk Udang Premium</span>
          </span>
        </Link>

        <nav className="nav-utama" aria-label="Navigasi utama">
          {tautan.map((item) => {
            const aktif =
              item.href === "/"
                ? jalur === "/"
                : jalur.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${aktif ? " aktif" : ""}`}
              >
                {item.label}
                {item.href === "/keranjang" && totalQty > 0 ? (
                  <span className="lencana" style={{ marginLeft: 8 }}>
                    {totalQty}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <Link href="/keranjang" className="keranjang-taut">
          <span aria-hidden="true">🛒</span>
          <span className="pesan-layar-kecil">Keranjang</span>
          <span className="lencana">{totalQty}</span>
        </Link>
      </div>
    </header>
  );
}
