"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Pesanan" },
  { href: "/admin/pengaturan", label: "Pengaturan Kontak" },
];

export function TabAdmin() {
  const jalur = usePathname() || "";

  return (
    <nav className="tab-admin" aria-label="Navigasi dashboard">
      {tabs.map((tab) => {
        const aktif =
          tab.href === "/admin" ? jalur === "/admin" : jalur.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href} className={aktif ? "aktif" : ""}>
            {tab.label}
          </Link>
        );
      })}
      <Link href="/" style={{ marginLeft: "auto" }}>
        ← Lihat toko
      </Link>
    </nav>
  );
}
