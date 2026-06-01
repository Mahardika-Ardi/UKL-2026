import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <>
      <section className="relative min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/img/telkom.jpeg')" }}>
        <div className="text-center max-w-3xl px-4">
          <h1 className="text-5xl font-bold mb-6">
            Atributo : Pusat Atribut Sekolah
          </h1>

          <p className="text-xl mb-12">
            Lengkapi kebutuhan seragam, topi, dasi, hingga ikat pinggang
            sekolah putra-putri Anda dalam satu tempat.
          </p>
          <div>
            <Link href="/login">
              <button className="px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-800 text-white font-semibold shadow-lg transition">
                Belanja Sekarang
              </button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 w-full text-center">
          <p className="text-gray-300 ">
            Scroll For More
          </p>
        </div>
      </section>

      <section className="bg-[#CCC8B9] py-20">
        <div className="container mx-auto mt-20">
          <div className="flex flex-col md:flex-row items-center gap-30">

            <div className="mb-8 md:mb-0">
              <Image
                className="rounded-lg shadow-lg"
                src="/img/telkom.jpeg"
                alt="Profile Image"
                width={1000}
                height={400}
              />
            </div>

            <div className="md:w-3/5">
              <h2 className="text-[41px] text-black font-bold mb-10">
                Kenapa Harus Belanja di Atributo?
              </h2>

              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                <li>
                  Semua atribut (logo, warna, ukuran) dijamin sesuai dengan aturan resmi dinas pendidikan/sekolah.
                </li>

                <li>
                  Menggunakan bahan yang awet, tidak panas, dan nyaman dipakai seharian oleh siswa.
                </li>

                <li>
                  Tidak perlu repot datang ke koperasi sekolah atau pasar, cukup pesan dari rumah dan barang akan diantar.
                </li>
              </ul>

              <button className="mt-10 px-6 py-4 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-full shadow-lg">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-[#CCC8B9]">
        <div className="container mx-auto px-6 text-black">

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              Kategori Produk
            </h2>

            <p className="text-gray-500 mt-3">
              Temukan berbagai kebutuhan atribut sekolah Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-20 gap-y-12">

            {/* Sabuk */}
            <div className="bg-white/75 backdrop-blur-2xl rounded-xl overflow-hidden shadow-2xl hover:shadow-xl transition">
              <Image
                src="/img/sabuk.jpg"
                alt="Sabuk"
                width={500}
                height={300}
                className="w-full h-56 object-cover"
              />

              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">
                  Sabuk
                </h3>
              </div>
            </div>

            {/* Dasi */}
            <div className="bg-white/75 backdrop-blur-2xl rounded-xl overflow-hidden shadow-2xl hover:shadow-xl transition">
              <Image
                src="/img/dasi.jpg"
                alt="Dasi"
                width={500}
                height={300}
                className="w-full h-56 object-cover"
              />

              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">
                  Dasi
                </h3>
              </div>
            </div>

            {/* Hasduk */}
            <div className="bg-white/75 backdrop-blur-2xl rounded-xl overflow-hidden shadow-2xl hover:shadow-xl transition">
              <Image
                src="/img/hasduk.jpg"
                alt="Hasduk"
                width={500}
                height={300}
                className="w-full h-56 object-cover"
              />

              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">
                  Hasduk
                </h3>
              </div>
            </div>

            {/* Almamater */}
            <div className="bg-white/75 backdrop-blur-2xl rounded-xl overflow-hidden shadow-2xl hover:shadow-xl transition">
              <Image
                src="/img/almet.jpg"
                alt="Almamater"
                width={500}
                height={300}
                className="w-full h-56 object-cover"
              />

              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">
                  Almamater
                </h3>
              </div>
            </div>

            {/* Kaos Kaki */}
            <div className="bg-white/75 backdrop-blur-2xl rounded-xl overflow-hidden shadow-2xl hover:shadow-xl transition">
              <Image
                src="/img/kaos-kaki.jpg"
                alt="Kaos Kaki"
                width={500}
                height={300}
                className="w-full h-56 object-cover"
              />

              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">
                  Kaos Kaki
                </h3>
              </div>
            </div>

            {/* Seragam */}
            <div className="bg-white/75 backdrop-blur-2xl rounded-xl overflow-hidden shadow-2xl hover:shadow-xl transition">
              <Image
                src="/img/sma.jpg"
                alt="Seragam"
                width={500}
                height={300}
                className="w-full h-56 object-cover"
              />

              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">
                  Seragam
                </h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-[#F5332C] text-white pt-20">
        <div className="container mx-auto px-10 py-10">

          {/* Bagian Atas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Atributo */}
            <div className="md:col-span-2">
              <h2 className="text-4xl font-bold mb-5">
                Atributo
              </h2>

              <p className="text- leading-relaxed max-w-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nulla aliquam nibh id mattis imperdiet. Aenean tempus
                blandit sapien, eu porttitor dui blandit non.
              </p>
            </div>

            {/* Kategori */}
            <div>
              <h3 className="text-2xl font-bold mb-5">
                Kategori
              </h3>

              <ul className="space-y-2 text-lg">
                <li>Dasi</li>
                <li>Sabuk</li>
                <li>Almamater</li>
                <li>Seragam</li>
                <li>Hasduk</li>
                <li>Kaos Kaki</li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="text-2xl font-bold mb-5">
                Customer Care
              </h3>

              <ul className="space-y-2 text-lg">
                <li>FAQ</li>
                <li>Kebijakan Atributo</li>
                <li>Cara Memesan</li>
              </ul>
            </div>

            {/* Sosial Media */}
            <div className="flex justify-end gap-6 text-4xl">
              <i className="ri-whatsapp-fill"></i>
              <i className="ri-instagram-line"></i>
              <i className="ri-facebook-circle-fill"></i>
              <i className="ri-twitter-x-line"></i>
            </div>

          </div>

          {/* Nomor Telepon */}
          <div className="flex justify-end mt-16">
            <p className="text-lg font-semibold">
              Call us on +62 082182310
            </p>
          </div>

          <div className="border-t border-white/50 my-10" />

          {/* Copyright */}
          <div className="text-center mt-8">
            <p className="text-xl">
              © 2026 Atributo. All Rights Reserved.
            </p>
          </div>

        </div>
      </section>

    </>
  );
}
