"use client";

import Image from "next/image";
import Navbar from "../../../component/navbar-user";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface StoreOwner {
  id: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
}

interface Store {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  openTime: string;
  closeTime: string;
  lastOnlineAt: string | null;
  foundedAt: string;
  rating: string;
  ratingCount: number;
  totalSold: number;
  verificationStatus: string;
  owner: StoreOwner;
}

export default function StorePage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/img/telkom.jpeg',
    '/img/telkom.jpeg',
    '/img/telkom.jpeg',
  ];

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };


  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}stores`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();
        console.log("Stores Response:", data);

        if (!response.ok || !data.success) {
          setError(data.message || "Gagal mengambil data toko");
          return;
        }

        setStores(data.data.stores || []);
      } catch (err) {
        console.error("Fetch Stores Error:", err);
        setError("Terjadi kesalahan saat mengambil data toko");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            ✔ Verified
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
            ⏳ Pending
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
            ✗ Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

      <div className="relative w-full h-100 bg-gray-200 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(${-currentIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full h-full shrink-0 relative">
              <Image
                src={image}
                alt="Shop Banner"
                fill
                className="object-cover rounded"
              />
            </div>
          ))}
        </div>
        <button
          onClick={prevImage}
          className="absolute left-4 bg-black text-white px-3 py-2 rounded-full hover:scale-110 transition-transform z-10"
        >
          ◀
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 bg-black text-white px-3 py-2 rounded-full hover:scale-110 transition-transform z-10"
        >
          ▶
        </button>
      </div>


      <div className="pt-32 px-8 pb-10 text-black">
        <h1 className="text-2xl font-bold mb-6">Daftar Toko</h1>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 text-lg">Memuat data toko...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && stores.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500">Belum ada toko tersedia.</p>
          </div>
        )}

        {!loading && !error && stores.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Logo & Info Utama */}
                <div className="flex items-center gap-4 p-4 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    {store.logoUrl ? (
                      <Image
                        src={store.logoUrl}
                        alt={store.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
                        {store.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-base truncate">
                        {store.name}
                      </h2>
                      {getStatusBadge(store.verificationStatus)}
                    </div>
                    <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">
                      {store.description || "Tidak ada deskripsi"}
                    </p>
                  </div>
                </div>

                {/* Detail Info */}
                <div className="px-4 py-3 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>🕐 Jam Buka</span>
                    <span className="font-medium text-gray-800">
                      {store.openTime} – {store.closeTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>⭐ Rating</span>
                    <span className="font-medium text-gray-800">
                      {parseFloat(store.rating) > 0
                        ? `${parseFloat(store.rating).toFixed(1)} (${store.ratingCount} ulasan)`
                        : "Belum ada rating"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>🛍️ Total Terjual</span>
                    <span className="font-medium text-gray-800">
                      {store.totalSold > 0
                        ? store.totalSold.toLocaleString("id-ID")
                        : "0"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>👤 Pemilik</span>
                    <span className="font-medium text-gray-800">
                      {store.owner.firstName}
                      {store.owner.lastName ? ` ${store.owner.lastName}` : ""}
                    </span>
                  </div>
                </div>

                {/* Footer Tombol */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() =>
                      router.push(`/user/Store/store_profile/${store.id}`)
                    }
                    className="w-full mt-1 bg-black text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    Kunjungi Toko
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
