"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TOKO_URL } from "@/global";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      const response = await fetch(`${TOKO_URL}auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log("Response:", data);
      if (!response.ok) {
        const errorMessage = Array.isArray(data.message)
          ? data.message[0]
          : data.message || "Login failed";

        toast.error(errorMessage, {
          hideProgressBar: true,
          containerId: "toastLogin",
          autoClose: 2000,
        });

        return;
      }
      toast.success(data.data?.message || data.message, {
        hideProgressBar: true,
        containerId: "toastLogin",
        autoClose: 2000,
      });

      if (data.data?.role === "SHOP_OWNER") {
        setTimeout(() => {
          router.replace("/owner/store_detail");
        }, 1000);
      } else {
        setTimeout(() => {
          router.replace("/user/Store");
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Cannot connect to server", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen text-black">
      <div className="flex-1 bg-white px-12 py-8 flex flex-col">
        <div className="flex justify-end gap-8 mb-12 mr-20">
          <Link
            href="/login"
            className="font-semibold text-white bg-gray-600 px-4 py-2 rounded-lg"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="font-semibold bg-gray-300 px-4 py-2 rounded-lg hover:underline"
          >
            Register
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>

            <p className="text-gray-700 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem, pariatur.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Email</label>

              <input
                type="email"
                placeholder="abcd@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-bold mb-2">Password</label>

              <input
                type="password"
                placeholder="123456789"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex justify-end mb-8">
              <Link
                href="#"
                className="text-gray-700 text-sm font-semibold hover:underline hover:text-blue-600 transition"
              >
                Forget Password ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 border-t border-gray-300"></div>

            <span className="text-gray-700 font-semibold">Or</span>

            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="flex gap-4 justify-center">
            <button className="flex-1 bg-gray-300 text-black font-bold py-3 rounded-lg hover:bg-gray-400 transition">
              Google
            </button>

            <button className="flex-1 bg-gray-300 text-black font-bold py-3 rounded-lg hover:bg-gray-400 transition">
              Facebook
            </button>

            <button className="flex-1 bg-gray-300 text-black font-bold py-3 rounded-lg hover:bg-gray-400 transition">
              Apple
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-300 relative">
        <Image
          src="/img/telkom.jpeg"
          alt="Login Banner"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
