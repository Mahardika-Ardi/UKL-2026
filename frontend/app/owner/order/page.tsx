"use client";

import Navbar from "../../../component/navbar-owner";

export default function OrderPage() {

  const orders = [
    {
      name: "potut",
      product: "Seragam esempeh",
      price: "Rp. 50.000",
      status: "Belum Dibayar",
    },
    {
      name: "Leon",
      product: "Seragam esempeh, Kaos kaki, dan Topi",
      price: "Rp. 150.000",
      status: "Dibayar",
    },
    {
      name: "Leon",
      product: "Topi dan Dasi",
      price: "Rp. 60.000",
      status: "Belum Dibayar",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <Navbar />

      <div className="pt-28 px-20 pb-10 text-black">
        {/* TITLE */}
        <h1 className="text-2xl font-semibold mb-6">
          ← Order Masuk
        </h1>

        {/* LIST ORDER */}
        <div className="space-y-6">

          {orders.map((order, index) => (
            <div className="bg-white rounded-xl px-8 py-6 relative flex items-center border border-gray-300">

              {/* LEFT */}
              <div>
                <h2 className="font-semibold">
                  Nama pembeli : {order.name}
                </h2>

                <p className="text-sm text-gray-700 mt-1">
                  Produk : {order.product}
                </p>
              </div>

              {/* CENTER (HARGA FIX TENGAH) */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <p className="font-semibold text-lg">
                  {order.price}
                </p>
              </div>

              {/* RIGHT */}
              <div className="ml-auto">
                <span
                  className={`px-4 py-3 rounded-full text-sm text-white ${order.status === "Dibayar"
                      ? "bg-green-500"
                      : "bg-red-500"
                    }`}
                >
                  {order.status}
                </span>
              </div>

            </div>

          ))}

        </div>
      </div>
    </div >
  );
}