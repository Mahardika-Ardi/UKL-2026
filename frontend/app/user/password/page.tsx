"use client";

import Link from "next/link";
import { useState } from "react";

export default function ChangePasswordPage() {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`,
      ) as HTMLInputElement;

      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`,
      ) as HTMLInputElement;

      prevInput?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      alert("Masukkan email terlebih dahulu");
      return;
    }

    try {
      setLoadingOtp(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}auth/forgot-password`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );


      const user = await response.json();

      console.log(user);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengirim OTP");
      }

      alert("OTP berhasil dikirim");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan");
      }
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    const code = otpCode.join("");

    if (code.length !== 6) {
      alert("OTP harus 6 digit");
      return;
    }

    if (!newPassword) {
      alert("Password baru wajib diisi");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Konfirmasi password tidak sesuai");
      return;
    }

    try {
      setLoadingReset(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            password: newPassword,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal reset password");
      }

      alert("Password berhasil diubah");

      setOtpCode(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan");
      }
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="p-6 text-black max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/user/setting" className="text-xl font-bold">
          ◀
        </Link>

        <h1 className="text-xl font-bold">Change Password</h1>
      </div>

      <label className="block text-sm font-medium mb-2">Email</label>

      <input
        type="email"
        placeholder="email@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-3"
      />

      <button
        onClick={handleSendOtp}
        disabled={loadingOtp}
        className="w-full bg-blue-600 text-white py-3 rounded-lg mb-6 hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loadingOtp ? "Sending..." : "Send OTP"}
      </button>

      <div className="flex flex-col items-center text-center mb-6">
        <div className="text-4xl mb-2">📧</div>

        <p className="text-gray-600 text-sm">
          Masukkan kode OTP yang telah dikirim ke email
        </p>

        <p className="font-semibold text-sm mt-1">
          {email || "email@gmail.com"}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-center gap-3">
          {otpCode.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">New Password</h2>

      <label className="block text-sm font-medium mb-2">Password Baru</label>

      <input
        type="password"
        placeholder="Password baru"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
      />

      <label className="block text-sm font-medium mb-2">
        Konfirmasi Password
      </label>

      <input
        type="password"
        placeholder="Konfirmasi password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-6"
      />

      <button
        onClick={handleResetPassword}
        disabled={loadingReset}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      >
        {loadingReset ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
