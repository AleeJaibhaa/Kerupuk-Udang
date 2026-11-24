import type { Metadata } from "next";
import { FormPengaturan } from "@/components/FormPengaturan";
import { getPengaturan } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pengaturan Kontak",
};

export default async function HalamanPengaturan() {
  const pengaturan = await getPengaturan();

  return (
    <>
      <div className="admin-kepala">
        <div>
          <h1>Pengaturan kontak &amp; WhatsApp</h1>
          <p>
            Satu nomor WhatsApp dipakai untuk tombol mengambang, tombol di halaman
            produk, dan konfirmasi checkout. Perubahan langsung berlaku di seluruh
            halaman customer.
          </p>
        </div>
      </div>

      <FormPengaturan pengaturanAwal={pengaturan} />
    </>
  );
}
