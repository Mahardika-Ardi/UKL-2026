'use client';

import Link from "next/link";
import { useState } from "react";

export default function ChangePasswordPage() {
  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1); // Hanya ambil digit terakhir
    setOtpCode(newOtp);

    // Auto-focus ke field berikutnya
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="p-6 text-black">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/user/setting" className="text-xl font-bold">
          ◀
        </Link>
        <h1 className="text-xl font-bold">Change Password</h1>
      </div>

      {/* Email Verification Info */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="text-4xl mb-2">📧❗</div>
        <p className="text-gray-600 text-sm">
          Enter the verification code sent to the email <br />
          <span className="font-semibold">Lorep_Ipsum@gmail.com</span>
        </p>
      </div>

      {/* OTP Input Box */}
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
              className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="•"
            />
          ))}
        </div>
      </div>

      {/* Change Password Form */}
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>

      <label className="block text-sm font-medium mb-2">New Password</label>
      <input
        type="password"
        placeholder="Password1234"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <label className="block text-sm font-medium mb-2">Confirm Password</label>
      <input
        type="password"
        placeholder="Password1234"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Save Button */}
      <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
        Save Changes
      </button>
    </div>
  );
}