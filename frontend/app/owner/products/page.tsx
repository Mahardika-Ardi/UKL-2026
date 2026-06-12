import React from "react";
import { GetProduct } from "@/services/products";
import { Product } from "@/types/products";
import Navbar from "@/component/navbar_owner";
import { FormProducts } from "./formProducts";
import { EditProduct } from "./editProducts"

const ProductPage = async () => {
  const data: Product[] | null = await GetProduct();

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Admin Barang
        </h1>

        <FormProducts />

        <div className="mt-6">
          {!data || data.length === 0 ? (
            <div className="border rounded-lg p-4 bg-gray-100">
              <p className="text-gray-600">
                Belum ada produk yang tersedia.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((barang: any) => (
                <div
                  key={barang.id}
                  className="border border-black text-black rounded-lg shadow p-4"
                >
                  <h2 className="text-lg font-semibold">
                    {barang.nama_barang ||
                      barang.name ||
                      "Nama tidak tersedia"}
                  </h2>

                  <p className="mt-2">
                    {barang.deskripsi ||
                      barang.description ||
                      "Tidak ada deskripsi"}
                  </p>

                  <p className="mt-2 font-medium">
                    Rp{" "}
                    {barang.harga ||
                      barang.price ||
                      0}
                  </p>

                  <p className="mt-1">
                    Stok:{" "}
                    {barang.stok ||
                      barang.stock ||
                      0}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;