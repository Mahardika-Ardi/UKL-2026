'use client';

import Link from "next/link";
import { useState } from "react";

export default function NotificationSettingsPage() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="p-6 text-black">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/user/setting"
          className="text-xl font-bold"
        >
          ◀
        </Link>
        <h1 className="text-xl font-bold">Notification Settings</h1>
      </div>

      {/* Email Notification Section */}
      <div className="flex justify-between items-start py-4 border-b">
        <div className="flex flex-col">
          <span className="text-gray-800 font-semibold">Email Notification</span>
          <p className="text-gray-600 text-sm mt-1 max-w-md">
            If you do not activate it, you cannot receive OTP Password reset emails,
            both as a seller and as a buyer. You can reactivate it if you want to
            receive order notifications via email.
          </p>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            enabled ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}