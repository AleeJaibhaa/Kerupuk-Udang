import type { Product } from "@/lib/types";

export function ProdukArt({
  produk,
  className = "kartu-art",
  tampilkanCap = true,
}: {
  produk: Product;
  className?: string;
  tampilkanCap?: boolean;
}) {
  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(145deg, ${produk.warna.dari}, ${produk.warna.ke})`,
      }}
      aria-hidden="true"
    >
      {tampilkanCap && produk.unggulan ? <span className="cap">Terlaris</span> : null}
      <span className="emoji">{produk.emoji}</span>
    </div>
  );
}
