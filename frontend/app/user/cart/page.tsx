'use client';

import Navbar from '@/component/navbar-user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const handleTransaksi = () => {
    router.push('/user/transaksi');
  }
  return (
    <div className="min-h-screen bg-white ">
      <Navbar />

      {/* Cart Content */}
      <div className="px-8 py-24">
        <h1 className="text-3xl font-bold mb-8 text-black">Shopping Cart</h1>

        {/* Cart Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Product</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-black">Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-black">Total</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-black">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Example Row */}
              <tr>
                <td className="border border-gray-300 px-4 py-4 flex items-center gap-4">
                  <Image
                    src="/images/arknights.png"
                    alt="Product"
                    width={80}
                    height={80}
                    className="rounded"
                  />
                  <div>
                    <p className="font-semibold text-black">Nama Produk</p>
                    <p className="text-sm text-gray-600">Nama Toko</p>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center text-black">
                  <div className="flex items-center justify-center gap-2">
                    <button className="px-2 py-1 border rounded hover:bg-gray-100">-</button>
                    <span className="px-2">2</span>
                    <button className="px-2 py-1 border rounded hover:bg-gray-100">+</button>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center font-semibold text-black">
                  Rp. 40.000
                </td> 
                <td className="border border-gray-300 px-4 py-4 text-center text-black">
                  <button className="text-red-500 hover:underline">Hapus</button>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-4 flex items-center gap-4">
                  <Image
                    src="/images/arknights.png"
                    alt="Product"
                    width={80}
                    height={80}
                    className="rounded"
                  />
                  <div>
                    <p className="font-semibold text-black">Nama Produk</p>
                    <p className="text-sm text-gray-600">Nama Toko</p>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center text-black">
                  <div className="flex items-center justify-center gap-2">
                    <button className="px-2 py-1 border rounded hover:bg-gray-100">-</button>
                    <span className="px-2">2</span>
                    <button className="px-2 py-1 border rounded hover:bg-gray-100">+</button>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center font-semibold text-black">
                  Rp. 40.000
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center">
                  <button className="text-red-500 hover:underline">Hapus</button>
                </td>
              </tr>
              
              <tr>
                <td className="border border-gray-300 px-4 py-4 flex items-center gap-4">
                  <Image
                    src="/images/arknights.png"
                    alt="Product"
                    width={80}
                    height={80}
                    className="rounded"
                  />
                  <div>
                    <p className="font-semibold text-black">Nama Produk</p>
                    <p className="text-sm text-gray-600">Nama Toko</p>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center text-black">
                  <div className="flex items-center justify-center gap-2">
                    <button className="px-2 py-1 border rounded hover:bg-gray-100">-</button>
                    <span className="px-2">2</span>
                    <button className="px-2 py-1 border rounded hover:bg-gray-100">+</button>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center font-semibold text-black">
                  Rp. 40.000
                </td>
                <td className="border border-gray-300 px-4 py-4 text-center">
                  <button className="text-red-500 hover:underline">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Checkout Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleTransaksi}
            className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition"
          >
            Bayar
          </button>
        </div>
      </div>
    </div>
  );
}