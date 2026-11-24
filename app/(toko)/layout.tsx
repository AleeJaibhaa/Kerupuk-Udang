import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppMengambang } from "@/components/WhatsAppMengambang";
import { getPengaturan } from "@/lib/store";
import { namaToko, pesanPembuka } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function LayoutToko({
  children,
}: {
  children: React.ReactNode;
}) {
  const pengaturan = await getPengaturan();

  return (
    <>
      <Header namaToko={namaToko(pengaturan)} />
      <main>{children}</main>
      <Footer pengaturan={pengaturan} />
      <WhatsAppMengambang
        nomor={pengaturan.nomorWhatsApp}
        pesan={pesanPembuka(pengaturan)}
        namaToko={namaToko(pengaturan)}
      />
    </>
  );
}
