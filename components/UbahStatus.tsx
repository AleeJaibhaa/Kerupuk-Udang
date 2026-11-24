"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  STATUS_PEMBAYARAN,
  STATUS_PESANAN,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/types";

export function UbahStatus({
  kode,
  status,
  pembayaran,
}: {
  kode: string;
  status: OrderStatus;
  pembayaran: PaymentStatus;
}) {
  const router = useRouter();
  const [statusLokal, setStatusLokal] = useState<OrderStatus>(status);
  const [bayarLokal, setBayarLokal] = useState<PaymentStatus>(pembayaran);
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");

  useEffect(() => setStatusLokal(status), [status]);
  useEffect(() => setBayarLokal(pembayaran), [pembayaran]);

  async function kirim(perubahan: {
    status?: OrderStatus;
    pembayaran?: PaymentStatus;
  }) {
    setSibuk(true);
    setGalat("");
    try {
      const respons = await fetch(`/api/orders/${kode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perubahan),
      });
      if (!respons.ok) {
        const data = await respons.json().catch(() => ({}));
        throw new Error(data?.pesan ?? "Gagal menyimpan perubahan.");
      }
      router.refresh();
    } catch (error) {
      setGalat(error instanceof Error ? error.message : "Gagal menyimpan.");
    } finally {
      setSibuk(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 6, minWidth: 170 }}>
      <select
        className="select-kecil"
        value={statusLokal}
        disabled={sibuk}
        aria-label={`Status pesanan ${kode}`}
        onChange={(event) => {
          const nilai = event.target.value as OrderStatus;
          setStatusLokal(nilai);
          void kirim({ status: nilai });
        }}
      >
        {STATUS_PESANAN.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <select
        className="select-kecil"
        value={bayarLokal}
        disabled={sibuk}
        aria-label={`Status pembayaran ${kode}`}
        onChange={(event) => {
          const nilai = event.target.value as PaymentStatus;
          setBayarLokal(nilai);
          void kirim({ pembayaran: nilai });
        }}
      >
        {STATUS_PEMBAYARAN.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {galat ? (
        <span style={{ color: "var(--merah)", fontSize: "0.72rem" }}>{galat}</span>
      ) : null}
    </div>
  );
}
