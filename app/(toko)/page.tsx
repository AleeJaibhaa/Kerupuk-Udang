import Link from "next/link";
import { KartuProduk } from "@/components/KartuProduk";
import { TombolWhatsApp } from "@/components/TombolWhatsApp";
import { products } from "@/lib/products";
import { getPengaturan } from "@/lib/store";
import { buatLinkWhatsApp, namaToko, pesanPembuka } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function Beranda() {
  const pengaturan = await getPengaturan();
  const nama = namaToko(pengaturan);
  const tautanWhatsApp = buatLinkWhatsApp(
    pengaturan.nomorWhatsApp,
    pesanPembuka(pengaturan),
  );

  const unggulan = [
    ...products.filter((p) => p.unggulan),
    ...products.filter((p) => !p.unggulan),
  ].slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="wadah hero-kisi">
          <div>
            <span className="eyebrow">🦐 Buatan Sidoarjo · Sejak 2016</span>
            <h1 className="hero-judul">
              Renyahnya kerupuk udang, <em>gurihnya kebersamaan.</em>
            </h1>
            <p className="hero-sub">
              {nama} membuat kerupuk udang dari udang segar pilihan, digoreng dua
              kali agar tetap renyah sampai meja makan Anda. Pesan langsung,
              konfirmasi lewat WhatsApp.
            </p>
            <div className="hero-aksi">
              <Link href="/produk" className="btn btn-oranye">
                Belanja sekarang
              </Link>
              <TombolWhatsApp
                href={tautanWhatsApp}
                label="Tanya via WhatsApp"
                className="btn btn-garis"
              />
            </div>
            <div className="hero-catatan">
              <div>
                <strong>12.400+</strong>
                paket terkirim
              </div>
              <div>
                <strong>4,9 / 5</strong>
                rating pelanggan
              </div>
              <div>
                <strong>35%</strong>
                udang asli tiap resep
              </div>
            </div>
          </div>

          <div className="hero-seni">
            <div className="piring">
              <span className="piring-emoji" aria-hidden="true">
                🍤
              </span>
            </div>
            <div className="kartu-melayang atas">
              <strong>Renyah tahan lama</strong>
              <span>Kemasan kedap udara</span>
            </div>
            <div className="kartu-melayang bawah">
              <strong>Udang asli</strong>
              <span>Tanpa pengawet &amp; pewarna</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bagian">
        <div className="wadah">
          <div className="bagian-kepala">
            <div>
              <h2 className="bagian-judul">Favorit pelanggan</h2>
              <p className="bagian-sub">
                Empat varian paling sering dipesan. Semua tersedia dalam kemasan
                200 gram siap santap.
              </p>
            </div>
            <Link href="/produk" className="taut-panah">
              Lihat semua produk →
            </Link>
          </div>
          <div className="grid-produk">
            {unggulan.map((produk) => (
              <KartuProduk key={produk.slug} produk={produk} />
            ))}
          </div>
        </div>
      </section>

      <section className="bagian krem">
        <div className="wadah">
          <div className="bagian-kepala">
            <div>
              <h2 className="bagian-judul">Kenapa memilih {nama}?</h2>
              <p className="bagian-sub">
                Kami menjaga resep rumahan tetap sederhana: udang segar, bumbu
                asli, dan proses yang bersih.
              </p>
            </div>
          </div>
          <div className="grid-fitur">
            <div className="fitur">
              <div className="fitur-ikon" aria-hidden="true">
                🦐
              </div>
              <h3>Udang segar pilihan</h3>
              <p>
                Udang ditangkap dari tambak pesisir Sidoarjo dan diolah pada hari
                yang sama.
              </p>
            </div>
            <div className="fitur">
              <div className="fitur-ikon" aria-hidden="true">
                🌿
              </div>
              <h3>Tanpa pengawet</h3>
              <p>
                Hanya tepung tapioka, bumbu alami, dan garam laut. Tanpa pewarna
                sintetis.
              </p>
            </div>
            <div className="fitur">
              <div className="fitur-ikon" aria-hidden="true">
                📦
              </div>
              <h3>Kemasan kedap udara</h3>
              <p>
                Dikemas dengan lapisan aluminium foil supaya tetap renyah saat
                sampai.
              </p>
            </div>
            <div className="fitur">
              <div className="fitur-ikon" aria-hidden="true">
                💬
              </div>
              <h3>Konfirmasi lewat WhatsApp</h3>
              <p>
                Setiap pesanan dikirim sebagai pesan siap kirim ke admin, jadi
                tidak perlu mengetik ulang.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bagian">
        <div className="wadah">
          <div className="bagian-kepala">
            <div>
              <h2 className="bagian-judul">Cara pesan dalam 4 langkah</h2>
              <p className="bagian-sub">
                Pesanan tersimpan di sistem kami, lalu dikonfirmasi manual oleh
                admin lewat WhatsApp.
              </p>
            </div>
          </div>
          <div className="langkah-grid">
            <div className="langkah">
              <span className="langkah-nomor">1</span>
              <h3>Pilih produk</h3>
              <p>Buka katalog dan tambahkan varian favorit ke keranjang.</p>
            </div>
            <div className="langkah">
              <span className="langkah-nomor">2</span>
              <h3>Isi data pengiriman</h3>
              <p>Lengkapi nama, nomor WhatsApp, dan alamat di halaman checkout.</p>
            </div>
            <div className="langkah">
              <span className="langkah-nomor">3</span>
              <h3>Kirim ke WhatsApp</h3>
              <p>
                Sistem membuat nomor pesanan dan pesan ringkasan yang siap
                dikirim.
              </p>
            </div>
            <div className="langkah">
              <span className="langkah-nomor">4</span>
              <h3>Admin konfirmasi</h3>
              <p>
                Admin membalas untuk pembayaran dan pengiriman, status pesanan
                diperbarui di dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bagian" style={{ paddingTop: 0 }}>
        <div className="wadah">
          <div className="ajakan">
            <div>
              <h2>Ada pertanyaan sebelum memesan?</h2>
              <p>
                Tanyakan stok, level pedas, atau ongkir langsung ke admin kami.
                Balasan mengikuti jam operasional toko.
              </p>
            </div>
            <div className="hero-aksi">
              <TombolWhatsApp
                href={tautanWhatsApp}
                label="Chat admin sekarang"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
