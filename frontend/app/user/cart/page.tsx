// app/user/cart/page.tsx
"use client";

import Navbar from "@/component/navbar-user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface CartProduct {
  id: string;
  name: string;
  price: string;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  store: {
    id: string;
    name: string;
  };
}

interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: CartProduct;
}

export default function CartPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  // localQty menyimpan perubahan quantity sebelum di-save
  const [localQty, setLocalQty] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;

    const fetchCart = async (): Promise<void> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}cart`,
          { method: "GET", credentials: "include" },
        );
        const data = await response.json();

        if (cancelled) return;

        if (!response.ok || !data.success) {
          setError(data.message || "Gagal mengambil data keranjang");
          return;
        }

        const items: CartItem[] = data.data?.items ?? data.data ?? [];
        const initQty: Record<string, number> = {};
        items.forEach((item) => {
          initQty[item.productId] = item.quantity;
        });

        setCartItems(items);
        setLocalQty(initQty);
      } catch (err) {
        if (cancelled) return;
        console.error("Fetch Cart Error:", err);
        setError("Terjadi kesalahan saat mengambil keranjang");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCart();

    return () => {
      cancelled = true;
    };
  }, []);

  // Ubah qty di local state saja, belum hit API
  const handleChangeQty = (
    productId: string,
    newQty: number,
    maxStock: number,
  ): void => {
    if (newQty < 1 || newQty > maxStock) return;
    setLocalQty((prev) => ({ ...prev, [productId]: newQty }));
  };

  // Cek apakah qty sudah berubah dari server
  const isDirty = (item: CartItem): boolean =>
    localQty[item.productId] !== item.quantity;

  // PATCH /cart/{productId} — hanya dipanggil saat klik Save
  const handleSave = async (productId: string): Promise<void> => {
    const newQty = localQty[productId];
    if (!newQty) return;

    try {
      setSavingId(productId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}cart/${productId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQty }),
        },
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        console.error("Save Cart Error:", data.message);
        return;
      }

      const savedQty: number = data.data?.quantity ?? newQty;

      // Update cartItems dengan quantity yang sudah tersimpan di server
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: savedQty } : item,
        ),
      );
      setLocalQty((prev) => ({ ...prev, [productId]: savedQty }));
    } catch (err) {
      console.error("Save Cart Error:", err);
    } finally {
      setSavingId(null);
    }
  };

  // DELETE /cart/{productId}
  const handleDelete = async (productId: string): Promise<void> => {
    try {
      setDeletingId(productId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}cart/${productId}`,
        { method: "DELETE", credentials: "include" },
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        console.error("Delete Cart Error:", data.message);
        return;
      }

      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId),
      );
      setLocalQty((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } catch (err) {
      console.error("Delete Cart Error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: string | number): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(price));

  const grandTotal = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.product.price) * (localQty[item.productId] ?? item.quantity),
    0,
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="px-8 py-24">
        <h1 className="text-3xl font-bold mb-8 text-black">Shopping Cart</h1>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500">Memuat keranjang...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && cartItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-gray-500 text-lg">Keranjang kamu kosong.</p>
            <button
              onClick={() => router.push("/user/Store")}
              className="text-sm text-blue-500 underline"
            >
              Belanja sekarang
            </button>
          </div>
        )}

        {!loading && !error && cartItems.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left text-black">
                      Produk
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-black">
                      Jumlah
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-black">
                      Total
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-black">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const currentQty =
                      localQty[item.productId] ?? item.quantity;
                    const dirty = isDirty(item);
                    const isSaving = savingId === item.productId;
                    const isDeleting = deletingId === item.productId;
                    const isBusy = isSaving || isDeleting;

                    return (
                      <tr key={item.id} className={isBusy ? "opacity-50" : ""}>
                        {/* Produk */}
                        <td className="border border-gray-300 px-4 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                              {item.product.imageUrl ? (
                                <Image
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-400 text-xs">
                                  No Image
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-black">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.product.store.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatPrice(item.product.price)} / pcs
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Jumlah */}
                        <td className="border border-gray-300 px-4 py-4 text-center text-black">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              disabled={currentQty <= 1 || isBusy}
                              onClick={() =>
                                handleChangeQty(
                                  item.productId,
                                  currentQty - 1,
                                  item.product.stock,
                                )
                              }
                              className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <span className="px-2 min-w-6 text-center">
                              {currentQty}
                            </span>
                            <button
                              disabled={
                                currentQty >= item.product.stock || isBusy
                              }
                              onClick={() =>
                                handleChangeQty(
                                  item.productId,
                                  currentQty + 1,
                                  item.product.stock,
                                )
                              }
                              className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="border border-gray-300 px-4 py-4 text-center font-semibold text-black">
                          {formatPrice(
                            String(Number(item.product.price) * currentQty),
                          )}
                        </td>

                        {/* Aksi */}
                        <td className="border border-gray-300 px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            {dirty && (
                              <button
                                disabled={isBusy}
                                onClick={() => handleSave(item.productId)}
                                className="text-xs px-3 py-1 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {isSaving ? "Menyimpan..." : "Simpan"}
                              </button>
                            )}
                            <button
                              disabled={isBusy}
                              onClick={() => handleDelete(item.productId)}
                              className="text-red-500 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {isDeleting ? "Menghapus..." : "Hapus"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-end mt-8 gap-3">
              <p className="text-lg font-semibold text-black">
                Grand Total: {formatPrice(String(grandTotal))}
              </p>
              <button
                onClick={() => router.push("/user/transaksi")}
                className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition"
              >
                Bayar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
