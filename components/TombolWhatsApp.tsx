"use client";

import { IkonWhatsApp } from "./IkonWhatsApp";

type Props = {
  href: string | null;
  label: string;
  className?: string;
  pesanKosong?: string;
  tooltip?: string;
};

/**
 * Tombol WhatsApp yang menunjukkan notifikasi jika nomor belum dikonfigurasi.
 */
export function TombolWhatsApp({
  href,
  label,
  className = "btn btn-wa",
  pesanKosong = "Nomor WhatsApp toko belum dikonfigurasi. Silakan hubungi admin melalui email atau atur nomornya di Dashboard Admin → Pengaturan.",
  tooltip,
}: Props) {
  if (!href) {
    return (
      <button
        type="button"
        className={`${className} nonaktif`}
        onClick={() => window.alert(pesanKosong)}
        title="Nomor WhatsApp belum dikonfigurasi"
        aria-label={`${label} (nomor WhatsApp belum dikonfigurasi)`}
      >
        <IkonWhatsApp />
        {label}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={tooltip}
      aria-label={label}
    >
      <IkonWhatsApp />
      {label}
    </a>
  );
}
