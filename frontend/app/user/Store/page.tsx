"use client";

import Image from "next/image";
import Navbar from "../../../component/navbar-user";
import { useState } from "react";

export default function StorePage() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const increaseQty = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decreaseQty = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
  };

  const products = Array(8).fill({
    name: "Item_Name",
    description: "Item Description",
    price: "10.000",
    sold: "10K+ Sold",
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

      <div className="pt-32 px-8 pb-10 text-black">
        <div className="flex flex-col lg:flex-row gap-8 items-start">


          <div className="flex items-start gap-5 flex-1">
            <div className="w-28 h-28 mx-10 rounded-full bg-gray-500 overflow-hidden shrink-0">
              <Image
                src="/img/telkom.jpeg"
                alt="Store"
                width={120}
                height={120}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold">Shop Name</h1>

              <p className="text-gray-600">
                Store Open Since February 20, 2022
              </p>

              <p className="text-gray-600">
                Operating Hours: 24 Hours
              </p>

              <p className="text-gray-600 mt-1">
                ● Last online 1 hour ago
              </p>
            </div>
          </div>


          <div className="border border-gray-400 rounded-xl p-4 min-w-100 bg-white">
            <h2 className="font-bold text-lg mb-3">
              Transactions
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>👥 Buyers</span>
                <div className="text-right">
                  <p>420 People</p>
                  <p className="text-xs text-gray-500">
                    (Last 2 Weeks)
                  </p>
                </div>
              </div>

              <div className="flex justify-between space-y-3">
                <span>✔ Sold</span>
                <p>98,91% (9011)</p>
              </div>

              <div className="flex justify-between">
                <span>🚚 Avg. Delivery</span>
                <p>1 Hour</p>
              </div>
            </div>
          </div>

          {/* RATING */}
          <div className="border border-gray-400 rounded-xl p-4 min-w-100 bg-white">
            <h2 className="font-bold text-lg mb-3">
              Rating ⭐ 4.9
            </h2>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>⭐⭐⭐⭐⭐</span>
                <span>8.700</span>
              </div>

              <div className="flex justify-between">
                <span>⭐⭐⭐⭐</span>
                <span>173</span>
              </div>

              <div className="flex justify-between">
                <span>⭐⭐⭐</span>
                <span>86</span>
              </div>

              <div className="flex justify-between">
                <span>⭐⭐</span>
                <span>31</span>
              </div>

              <div className="flex justify-between">
                <span>⭐</span>
                <span>21</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-400" />


        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-400 overflow-hidden shadow-sm hover:shadow-md transition"
            >

              <div className="h-72 bg-gray-300 flex items-center justify-center">
                <h1 className="text-4xl font-bold">
                  Image
                </h1>
              </div>


              <div className="p-3">
                <h3 className="font-bold">
                  {product.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  {product.description}
                </p>

                <div className="mt-8">
                  <p className="font-bold text-xl">
                    {product.price}
                  </p>

                  <div className="flex justify-between items-center mt-1">
                    <p className="font-bold">
                      {product.sold}
                    </p>

                    <div>
                      {(quantities[index] || 0) === 0 ? (
                        <button
                          onClick={() => increaseQty(index)}
                          className="border rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold"
                        >
                          +
                        </button>
                      ) : (
                        <div className="border rounded-full px-3 py-1 flex items-center gap-4">
                          <button
                            onClick={() => decreaseQty(index)}
                            className="text-xl"
                          >
                            -
                          </button>

                          <span>{quantities[index]}</span>

                          <button
                            onClick={() => increaseQty(index)}
                            className="text-xl"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}