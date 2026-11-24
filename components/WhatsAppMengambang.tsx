"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { normalisasiNomor } from "@/lib/whatsapp";
import { IkonWhatsApp } from "./IkonWhatsApp";

/**
 * Tombol WhatsApp mengambang. Nomor dan pesan pembuka berasal dari pengaturan
 * admin, sehingga perubahan nomor langsung berlaku di semua halaman customer.
 */
export function WhatsAppMengambang({
  nomor,
  pesan,
  namaToko,
}: {
  nomor: string;
  pesan: string;
  namaToko: string;
}) {
  const jalur = usePathname() || "";
  const tautan = useMemo(() => {
    const nomorBersih = normalisasiNomor(nomor);
    if (!nomorBersih) return null;
    return `https://wa.me/${nomorBersih}?text=${encodeURIComponent(pesan)}`;
  }, [nomor, pesan]);

  if (jalur.startsWith("/admin")) return null;

  if (!tautan) {
    return (
      <button
        type="button"
        className="wa-mengambang nonaktif"
        onClick={() =>
          window.alert(
            "Nomor WhatsApp toko belum dikonfigurasi. Admin dapat mengaturnya di Dashboard Admin → Pengaturan.",
          )
        }
        aria-label="Nomor WhatsApp belum dikonfigurasi"
      >
        <IkonWhatsApp />
        <span>WA belum diatur</span>
      </button>
    );
  }

  return (
    <a
      href={tautan}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-mengambang"
      aria-label={`Chat WhatsApp ${namaToko}`}
      title={`Chat WhatsApp ${namaToko}`}
    >
      <span className="denyut" aria-hidden="true" />
      <IkonWhatsApp />
      <span>Chat WhatsApp</span>
    </a>
  );
}
