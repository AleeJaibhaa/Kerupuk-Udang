import type { Metadata } from "next";
import { FormCheckout } from "@/components/FormCheckout";
import { getPengaturan } from "@/lib/store";
import { normalisasiNomor } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function HalamanCheckout() {
  const pengaturan = await getPengaturan();
  const whatsappSiap = Boolean(normalisasiNomor(pengaturan.nomorWhatsApp));

  return (
    <>
      <section className="kepala-halaman">
        <div className="wadah">
          <p className="remah">
            <a href="/keranjang">Keranjang</a> / Checkout
          </p>
          <h1>Checkout pesanan</h1>
          <p>
            Lengkapi data pengiriman. Setelah pesanan dibuat, Anda akan menerima
            nomor pesanan dan dapat mengirim ringkasannya ke WhatsApp admin.
          </p>
        </div>
      </section>

      <div className="wadah">
        <FormCheckout whatsappSiap={whatsappSiap} />
      </div>
    </>
  );
}
