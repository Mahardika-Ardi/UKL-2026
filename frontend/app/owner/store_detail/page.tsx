"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/component/navbar_owner";

export default function StoreDetailPage() {
  const orders = [
    {
      user: "Kiana",
      userImage: "/img/avatar_kiana.png",
      order: "Dasi",
      status: "Unpaid",
      statusImage: "/img/status_unpaid.png",
      total: "Rp 350k",
      statusColor: "text-red-500",
    },
    {
      user: "Ardi",
      userImage: "/img/avatar_ardi.png",
      order: "Sabuk",
      status: "Unpaid",
      statusImage: "/img/status_unpaid.png",
      total: "Rp 173k",
      statusColor: "text-red-500",
    },
    {
      user: "Leon",
      userImage: "/img/avatar_leon.png",
      order: "Topi",
      status: "Paid",
      statusImage: "/img/status_paid.png",
      total: "Rp 812k",
      statusColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Main Content */}
      <main className="px-8 py-6 space-y-6">
        {/* Title + Edit */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Your Store</h1>
        </div>

        {/* Stats + Recent Orders + Today's Income */}
        <div className="flex gap-4">
          {/* Left Card: Stats + Recent Orders */}
          <div className="flex-1 bg-gray-100 rounded-2xl p-5 space-y-4">
            {/* Store Stats — 4 equal cols, no padding so they align with table below */}
            <div className="grid grid-cols-4 border-b border-gray-300 pb-4">
              {[
                {
                  label: "Total Buyers",
                  value: "9110",
                  iconW: 28,
                  iconH: 22,
                  icon: "/img/total_buyers.png",
                },
                {
                  label: "Completed Orders",
                  value: "9011",
                  iconW: 28,
                  iconH: 22,
                  icon: "/img/completed_orders.png",
                },
                {
                  label: "Cancelled Orders",
                  value: "020",
                  iconW: 28,
                  iconH: 22,
                  icon: "/img/cancelled_orders.png",
                },
                {
                  label: "Store Rating",
                  value: "4.94",
                  iconW: 28,
                  iconH: 22,
                  icon: "/img/store_rating.png",
                },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <Image
                      src={stat.icon}
                      alt={stat.label}
                      width={stat.iconW}
                      height={stat.iconH}
                      className="object-cover"
                    />
                    <span className="text-lg font-bold text-gray-800">
                      {stat.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders Table — 4 equal cols matching the stats grid above */}
            <div>
              <table className="w-full text-left table-fixed">
                <colgroup>
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "25%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="text-sm font-semibold text-gray-700 pb-3">
                      Recent Orders
                    </th>
                    <th className="text-sm font-semibold text-gray-700 pb-3">
                      Order
                    </th>
                    <th className="text-sm font-semibold text-gray-700 pb-3">
                      Status
                    </th>
                    <th className="text-sm font-semibold text-gray-700 pb-3">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((row, i) => (
                    <tr key={i}>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <Image
                            src={row.userImage}
                            alt={row.user}
                            width={22}
                            height={22}
                            className="object-cover rounded-full"
                          />
                          <span className="text-sm text-gray-800">
                            {row.user}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 text-sm text-gray-800">
                        {row.order}
                      </td>
                      <td className={`py-2 ${row.statusColor}`}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={row.statusImage}
                            alt={row.status}
                            width={18}
                            height={14}
                            className="object-cover"
                          />
                          <span className="text-sm">{row.status}</span>
                        </div>
                      </td>
                      <td className="py-2 text-sm text-gray-800">
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Card: Today's Income */}
          <div className="w-56 bg-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3">
            {/* Store icon */}
            <div className="flex items-end gap-0.5">
              <Image
                src="/img/store_icon.png"
                alt="Store"
                width={32}
                height={28}
                className="object-cover"
              />
            </div>
            <span className="text-base font-semibold text-gray-800">
              Todays Income
            </span>
            <span className="text-2xl font-bold text-gray-400">
              Rp. 5.318.008
            </span>
          </div>
        </div>

        {/* Add Product Section */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-black  ">Add Product</h2>
          <div className="flex gap-4">
            <button className="w-40 h-20 border-2 bg-blue-500 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-blue-600 transition">
              <Link
                href="/owner/products"
                className="text-xl text-white font-light leading-none"
              >
                Go to Add Product
              </Link>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
