import type { Metadata } from "next";
import "./globals.css";
import { KeranjangProvider } from "@/components/KeranjangProvider";
import { getPengaturan } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const pengaturan = await getPengaturan();
  return {
    title: {
      default: `${pengaturan.namaToko} — Kerupuk Udang Premium`,
      template: `%s · ${pengaturan.namaToko}`,
    },
    description:
      "Kerupuk udang premium buatan Sidoarjo. Renyah, gurih, dan siap dipesan lewat WhatsApp.",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <KeranjangProvider>{children}</KeranjangProvider>
      </body>
    </html>
  );
}
