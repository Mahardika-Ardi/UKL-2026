"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("");

  const products = [
    {
      id: 1,
      name: "Nama Barang",
      image: "/img/telkom.jpeg",
      quantity: 2,
      price: 30000,
    },
    {
      id: 2,
      name: "Nama Barang",
      image: "/img/telkom.jpeg",
      quantity: 1,
      price: 120000,
    },
  ];

  const shippingCost = 10000;

  const subtotal = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 text-black">
      <div className="w-full bg-[#e6e6e6] rounded-xl p-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push("/user/cart")}
            className="hover:opacity-70 transition cursor-pointer"
            title="Kembali ke Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <h1 className="text-2xl font-semibold">
            Pembayaran
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* LIST PRODUK */}
          <div className="flex-1 bg-[#d3d3d3] rounded-xl p-6 space-y-10">

            {products.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between gap-5"
              >
                <div className="flex gap-5">

                  {/* GAMBAR */}
                  <div className="w-45 h-45 relative rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex flex-col justify-center">
                    <h2 className="font-semibold text-2xl">
                      {item.name}
                    </h2>

                    <p className="text-lg text-gray-700 font-semibold">
                      Jumlah: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <p className="font-semibold text-lg">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RINGKASAN */}
          <div className="w-full lg:w-87 bg-[#d3d3d3] rounded-xl p-6">

            <h2 className="font-semibold text-lg mb-4">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span>Total Barang :</span>
                <span>{products.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Quantity :</span>
                <span>
                  {products.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal :</span>
                <span>
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Biaya Ongkir :</span>
                <span>
                  Rp {shippingCost.toLocaleString("id-ID")}
                </span>
              </div>

              <hr />

              <div className="flex justify-between font-bold text-base">
                <span>Total :</span>
                <span>
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>

            </div>

            {/* METODE PEMBAYARAN */}
            <div className="mt-8">
              <p className="font-semibold mb-3">
                METODE PEMBAYARAN
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  "OVO",
                  "GoPay",
                  "DANA",
                  "Transfer",
                  "Visa",
                ].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`px-3 py-2 rounded-md border transition
                    ${
                      paymentMethod === method
                        ? "bg-black text-white border-black"
                        : "bg-white border-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {paymentMethod && (
                <p className="text-sm mt-3">
                  Metode dipilih:
                  <span className="font-semibold ml-1">
                    {paymentMethod}
                  </span>
                </p>
              )}
            </div>

            {/* TOMBOL BAYAR */}
            <button
              disabled={!paymentMethod}
              className="mt-8 w-full py-3 rounded-md border border-gray-500 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Bayar Rp {total.toLocaleString("id-ID")}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}