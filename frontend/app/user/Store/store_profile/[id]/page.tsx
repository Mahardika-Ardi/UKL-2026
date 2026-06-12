"use client";

import Image from "next/image";
import Navbar from "@/component/navbar-user";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

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

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string | null;
  rating: string;
  ratingCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function UserStoreDetailPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params?.id as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeLoading, setStoreLoading] = useState<boolean>(true);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [storeError, setStoreError] = useState<string | null>(null);


  useEffect(() => {
    if (!storeId) return;
    const fetchStore = async (): Promise<void> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}stores/${storeId}`,
          { method: "GET", credentials: "include" },
        );
        const data = await response.json();
        if (!response.ok || !data.success) {
          setStoreError(data.message || "Gagal mengambil data toko");
          return;
        }
        const storeData: Store = data?.data?.store || data?.data || data;
        setStore(storeData);
      } catch (err) {
        console.error("Fetch Store Error:", err);
        setStoreError("Terjadi kesalahan saat mengambil data toko");
      } finally {
        setStoreLoading(false);
      }
    };
    fetchStore();
  }, [storeId]);

  useEffect(() => {
    if (!storeId) return;
    const fetchProducts = async (): Promise<void> => {
      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}products`,
        );
        url.searchParams.set("storeId", storeId);
        url.searchParams.set("page", "1");
        url.searchParams.set("limit", "10");
        url.searchParams.set("isActive", "true");
        const response = await fetch(url.toString(), {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok || !data.success) return;
        setProducts(data?.data?.products || []);
      } catch (err) {
        console.error("Fetch Products Error:", err);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [storeId]);

  const formatPrice = (price: string): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(price));

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar />
        <div className="flex items-center justify-center pt-40">
          <p className="text-gray-500 text-lg">Memuat data toko...</p>
        </div>
      </div>
    );
  }

  if (storeError || !store) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40 gap-3">
          <p className="text-red-500">{storeError || "Toko tidak ditemukan"}</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 underline"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const ratingValue = parseFloat(store.rating);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

      <div className="pt-32 px-8 pb-10 text-black">
        {/* Store Header */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex items-start gap-5 flex-1">
            <div className="w-28 h-28 mx-4 rounded-full bg-gray-300 overflow-hidden shrink-0">
              {store.logoUrl ? (
                <Image
                  src={store.logoUrl}
                  alt={store.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold bg-gray-500">
                  {store.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold">{store.name}</h1>
              <p className="text-gray-600 mt-1">
                {store.description || "Tidak ada deskripsi"}
              </p>
              <p className="text-gray-600 mt-1">
                Operating Hours: {store.openTime} – {store.closeTime}
              </p>
              <p className="text-gray-600 mt-1">
                {store.lastOnlineAt
                  ? `● Terakhir online ${new Date(store.lastOnlineAt).toLocaleString("id-ID")}`
                  : "● Status online tidak tersedia"}
              </p>
              <p className="text-gray-600 mt-1">
                👤 {store.owner.firstName}
                {store.owner.lastName ? ` ${store.owner.lastName}` : ""}
              </p>
            </div>
          </div>

          <div className="border border-gray-400 rounded-xl p-4 min-w-56 bg-white">
            <h2 className="font-bold text-lg mb-3">Transactions</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-6">
                <span>🛍️ Total Terjual</span>
                <p className="font-medium">
                  {store.totalSold > 0
                    ? store.totalSold.toLocaleString("id-ID")
                    : "0"}
                </p>
              </div>
              <div className="flex justify-between gap-6">
                <span>📅 Berdiri Sejak</span>
                <p className="font-medium">
                  {new Date(store.foundedAt).toLocaleDateString("id-ID", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-400 rounded-xl p-4 min-w-56 bg-white">
            <h2 className="font-bold text-lg mb-3">
              Rating ⭐ {ratingValue > 0 ? ratingValue.toFixed(1) : "Belum ada"}
            </h2>
            {store.ratingCount > 0 ? (
              <p className="text-sm text-gray-500">
                Dari {store.ratingCount} ulasan
              </p>
            ) : (
              <p className="text-sm text-gray-400">Belum ada ulasan</p>
            )}
          </div>
        </div>

        <hr className="my-8 border-gray-400" />

        {/* Products Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            Produk Toko
            {!productsLoading && (
              <span className="text-base font-normal text-gray-500 ml-2">
                ({products.length} produk)
              </span>
            )}
          </h2>

          {productsLoading && (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-400">Memuat produk...</p>
            </div>
          )}

          {!productsLoading && products.length === 0 && (
            <div className="flex items-center justify-center py-16 border border-dashed border-gray-300 rounded-xl bg-white">
              <p className="text-gray-400">Belum ada produk di toko ini</p>
            </div>
          )}

          {!productsLoading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-400 overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  {/* Product Image — klik navigasi ke detail */}
                  <div
                    className="h-52 bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/user/products/${product.id}`)}
                  >
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={300}
                        height={208}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    {/* Nama produk juga bisa diklik */}
                    <h3
                      className="font-bold truncate cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() =>
                        router.push(`/user/products/${product.id}`)
                      }
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mt-0.5">
                      {product.description}
                    </p>

                    <div className="mt-4">
                      <p className="font-bold text-lg">
                        {formatPrice(product.price)}
                      </p>

                      <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-gray-400">
                          {product.stock > 0 ? (
                            <span>Stok: {product.stock}</span>
                          ) : (
                            <span className="text-red-400">Habis</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
