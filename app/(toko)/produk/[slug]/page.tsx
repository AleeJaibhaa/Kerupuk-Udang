import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KartuProduk } from "@/components/KartuProduk";
import { PanelBeli } from "@/components/PanelBeli";
import { ProdukArt } from "@/components/ProdukArt";
import { TombolWhatsApp } from "@/components/TombolWhatsApp";
import { rupiah } from "@/lib/format";
import { getProduct, products } from "@/lib/products";
import { getPengaturan } from "@/lib/store";
import { buatLinkWhatsApp, pesanProduk } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produk = getProduct(slug);
  if (!produk) return { title: "Produk tidak ditemukan" };
  return {
    title: produk.nama,
    description: produk.deskripsi,
  };
}

export default async function HalamanDetailProduk({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produk = getProduct(slug);
  if (!produk) notFound();

  const pengaturan = await getPengaturan();
  const tautanWhatsApp = buatLinkWhatsApp(
    pengaturan.nomorWhatsApp,
    pesanProduk(produk, pengaturan),
  );
  const lainnya = products.filter((p) => p.slug !== produk.slug).slice(0, 3);

  return (
    <>
      <div className="wadah">
        <p className="remah" style={{ paddingTop: 22 }}>
          <Link href="/">Beranda</Link> / <Link href="/produk">Produk</Link> /{" "}
          {produk.nama}
        </p>

        <div className="detail-kisi">
          <ProdukArt produk={produk} className="detail-art" />

          <div className="detail-info">
            <span className="kartu-rasa">{produk.rasa}</span>
            <h1>{produk.nama}</h1>
            <p className="harga-besar">{rupiah(produk.harga)}</p>
            <p className="detail-deskripsi">{produk.deskripsi}</p>

            <div className="spek">
              <span>Berat {produk.berat}</span>
              <span>Stok tersedia</span>
              <span>Dikirim dari Sidoarjo</span>
            </div>

            <PanelBeli produk={produk} />

            <div style={{ marginTop: 14 }}>
              <TombolWhatsApp
                href={tautanWhatsApp}
                label="Tanyakan Produk via WhatsApp"
                className="btn btn-wa btn-lebar"
              />
            </div>

            <div className="komposisi" style={{ marginTop: 24 }}>
              <h3>Komposisi</h3>
              <ul>
                {produk.komposisi.map((bahan) => (
                  <li key={bahan}>{bahan}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="bagian krem">
        <div className="wadah">
          <div className="bagian-kepala">
            <div>
              <h2 className="bagian-judul">Varian lain yang mungkin cocok</h2>
              <p className="bagian-sub">
                Coba rasa lain, atau tanyakan paket bundling ke admin lewat
                WhatsApp.
              </p>
            </div>
            <Link href="/produk" className="taut-panah">
              Semua produk →
            </Link>
          </div>
          <div className="grid-produk">
            {lainnya.map((item) => (
              <KartuProduk key={item.slug} produk={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
