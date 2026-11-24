import Link from "next/link";
import { rupiah } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProdukArt } from "./ProdukArt";
import { TombolTambah } from "./TombolTambah";

export function KartuProduk({ produk }: { produk: Product }) {
  return (
    <article className="kartu-produk">
      <Link href={`/produk/${produk.slug}`} aria-label={`Lihat ${produk.nama}`}>
        <ProdukArt produk={produk} />
      </Link>
      <div className="kartu-badan">
        <span className="kartu-rasa">{produk.rasa}</span>
        <h3 className="kartu-nama">
          <Link href={`/produk/${produk.slug}`}>{produk.nama}</Link>
        </h3>
        <p className="kartu-deskripsi">{produk.deskripsi}</p>
        <div className="kartu-bawah">
          <span className="harga">
            {rupiah(produk.harga)}
            <small>{produk.berat}</small>
          </span>
          <TombolTambah slug={produk.slug} />
        </div>
      </div>
    </article>
  );
}
