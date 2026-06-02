"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("21:00");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setOpenTime("08:00");
    setCloseTime("21:00");
    setAvatar(null);
    setAvatarFile(null);
  };

  // ✅ Hanya 1 handleSave — duplikat dihapus, URL diperbaiki
  const handleSave = async () => {
  if (!name.trim()) {
    alert("Store name wajib diisi");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("openTime", openTime);
    formData.append("closeTime", closeTime);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    console.log("Cookies:", document.cookie);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}stores`,
      {
        method: "POPOSTT", // ganti PUT/PAT jika backend memintanya
        credentials: "include", // kirim cookie
        body: formData,
      },
    );

    const data = await response.json();

    console.log("Response:", data);

    if (!response.ok) {
      alert(data.message || "Gagal menyimpan profil");
      return;
    }

    alert("Profil berhasil disimpan!");
    router.push("/owner/store_detail");
  } catch (error) {
    console.error("Save Profile Error:", error);
    alert("Terjadi kesalahan saat menghubungi server");
  } finally {
    setLoading(false);
  }
};

  // ✅ handleBack mengarah ke store_detail (owner)
  const handleBack = () => {
    router.push("/user/shop");
  };

  return (
    <div className="min-h-screen mx-1 bg-white">
      {/* Header */}
      <div className="bg-[#E5E5E5] px-4 py-4 flex items-center gap-3 border-b border-[#CCCCCC]">
        <button
          onClick={handleBack}
          className="text-black hover:opacity-70 transition-opacity cursor-pointer"
        >
          <span className="text-2xl font-bold">←</span>
        </button>
        <h1 className="text-[18px] font-semibold text-black tracking-tight">
          Store Profile
        </h1>
      </div>

      {/* Content */}
      <div className="px-6 pt-8 pb-10 max-w-2xl mx-auto mt-6">
        {/* Avatar */}
        <div className="mb-8 relative w-fit">
          <div
            className="w-25 h-25 rounded-full bg-[#808080] overflow-hidden cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#808080]" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm">✏️</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Store Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your store name"
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              style={{ maxWidth: "660px" }}
            />
          </div>

          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe your store..."
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors resize-vertical"
              style={{ maxWidth: "660px" }}
            />
          </div>

          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Open Time
            </label>
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
              style={{ maxWidth: "660px" }}
            />
          </div>

          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Close Time
            </label>
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
              style={{ maxWidth: "660px" }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="flex items-center justify-end gap-4 mt-10"
          style={{ maxWidth: "660px" }}
        >
          <button
            onClick={handleReset}
            disabled={loading}
            className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#276749] hover:bg-[#1E4D37] text-white text-[14px] font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
