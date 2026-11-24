import Link from "next/link";
import { TabAdmin } from "@/components/TabAdmin";
import { getPengaturan } from "@/lib/store";
import { namaToko } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const pengaturan = await getPengaturan();

  return (
    <>
      <header className="situs-header">
        <div className="wadah header-dalam">
          <Link href="/admin" className="merek">
            <span className="merek-emoji" aria-hidden="true">
              🦐
            </span>
            <span>
              {namaToko(pengaturan)}
              <span className="kecil">Dashboard Admin</span>
            </span>
          </Link>
          <Link href="/" className="keranjang-taut">
            Situs customer
          </Link>
        </div>
      </header>
      <main className="wadah">
        <TabAdmin />
        {children}
      </main>
    </>
  );
}
