"use client";

import Image from "next/image";
import Navbar from "@/component/navbar-user";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface ProductStore {
  id: string;
  name: string;
  logoUrl: string;
  verificationStatus: string;
}

interface ProductDetail {
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
  updatedAt: string;
  store: ProductStore;
}

export default function UserProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(0);
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const [cartMessage, setCartMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async (): Promise<void> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}products/${productId}`,
          { method: "GET", credentials: "include" },
        );
        const data = await response.json();
        if (!response.ok || !data.success) {
          setError(data.message || "Gagal mengambil data produk");
          return;
        }
        setProduct(data.data);
      } catch (err) {
        console.error("Fetch Product Error:", err);
        setError("Terjadi kesalahan saat mengambil data produk");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product || qty === 0) return;
    setCartLoading(true);
    setCartMessage(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}cart`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity: qty }),
        },
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        setCartMessage({
          type: "error",
          text: data.message || "Gagal menambah ke keranjang",
        });
        return;
      }
      setCartMessage({
        type: "success",
        text: "Berhasil ditambahkan ke keranjang!",
      });
      setQty(0);
    } catch (err) {
      console.error("Add to Cart Error:", err);
      setCartMessage({ type: "error", text: "Terjadi kesalahan, coba lagi." });
    } finally {
      setCartLoading(false);
    }
  };

  const formatPrice = (price: string): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(price));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar />
        <div className="flex items-center justify-center pt-40">
          <p className="text-gray-500 text-lg">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40 gap-3">
          <p className="text-red-500">{error || "Produk tidak ditemukan"}</p>
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

  const ratingValue = parseFloat(product.rating);
  const outOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />
      <div className="pt-32 px-8 pb-10 text-black max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          ← Kembali
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="w-full md:w-96 h-80 md:h-auto bg-gray-100 flex items-center justify-center shrink-0">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <span className="text-5xl">🖼️</span>
                  <span className="text-sm">Tidak ada gambar</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <button
                  onClick={() =>
                    router.push(`/user/store_profile/${product.store.id}`)
                  }
                  className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    {product.store.logoUrl ? (
                      <Image
                        src={product.store.logoUrl}
                        alt={product.store.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-gray-400 text-white">
                        {product.store.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 hover:text-gray-800">
                    {product.store.name}
                  </span>
                </button>

                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm text-gray-600">
                    {ratingValue > 0
                      ? `${ratingValue.toFixed(1)} (${product.ratingCount} ulasan)`
                      : "Belum ada rating"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {product.description || "Tidak ada deskripsi"}
                </p>

                <p className="text-sm mb-4">
                  Stok:{" "}
                  {outOfStock ? (
                    <span className="text-red-500 font-medium">Habis</span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      {product.stock} tersedia
                    </span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold mb-4">
                  {formatPrice(product.price)}
                </p>

                {!outOfStock && (
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-500">Jumlah:</span>
                    <div className="flex items-center border rounded-full px-3 py-1 gap-4">
                      <button
                        onClick={() => setQty((q) => Math.max(0, q - 1))}
                        className="text-xl font-bold w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-medium">{qty}</span>
                      <button
                        onClick={() =>
                          setQty((q) => Math.min(product.stock, q + 1))
                        }
                        className="text-xl font-bold w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition"
                      >
                        +
                      </button>
                    </div>
                    {qty > 0 && (
                      <span className="text-sm text-gray-500">
                        Subtotal:{" "}
                        {formatPrice(String(Number(product.price) * qty))}
                      </span>
                    )}
                  </div>
                )}

                {/* Feedback message */}
                {cartMessage && (
                  <p
                    className={`text-sm mb-3 font-medium ${cartMessage.type === "success" ? "text-green-600" : "text-red-500"}`}
                  >
                    {cartMessage.text}
                  </p>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock || qty === 0 || cartLoading}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all
                    bg-black hover:bg-gray-800
                    disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {cartLoading
                    ? "Menambahkan..."
                    : outOfStock
                      ? "Stok Habis"
                      : qty === 0
                        ? "Pilih Jumlah Dulu"
                        : "Tambah ke Keranjang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
