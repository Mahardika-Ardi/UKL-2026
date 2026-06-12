"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TOKO_URL } from "@/global"; // sesuaikan path jika berbeda

interface StoreProfile {
  name: string;
  description: string;
  openTime: string;
  closeTime: string;
  logoUrl: string | null;
}

export default function StoreProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<StoreProfile>({
    name: "",
    description: "",
    openTime: "",
    closeTime: "",
    logoUrl: null,
  });
  const [initialForm, setInitialForm] = useState<StoreProfile | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ── Fetch store data ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`${TOKO_URL}stores/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HTTP ${response.status}:`, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        localStorage.getItem("access_token")
        const result = await response.json();
        console.log("Fetched store data:", result);

        const storeData = result?.data?.store || result?.data || result;

        const populated: StoreProfile = {
          name: storeData.name || "",
          description: storeData.description || "",
          openTime: storeData.openTime || "",
          closeTime: storeData.closeTime || "",
          logoUrl: storeData.logoUrl || null,
        };

        setForm(populated);
        setInitialForm(populated);
      } catch (error) {
        console.error("Failed to fetch store:", error);
        alert("Gagal memuat data toko. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const hasChanges = () => {
    if (!initialForm) return false;
    const formChanged = JSON.stringify(form) !== JSON.stringify(initialForm);
    return formChanged || logoFile !== null;
  };

  const handleInputChange = (
    field: keyof Omit<StoreProfile, "logoUrl">,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (initialForm) {
      setForm(initialForm);
      setLogoFile(null);
    }
  };

  // ── Logo preview ──────────────────────────────────────────────────────────
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name) {
      alert("Nama toko wajib diisi");
      return;
    }

    if (!hasChanges()) {
      alert("Tidak ada perubahan untuk disimpan");
      return;
    }

    setIsSaving(true);
    try {
      // Build body — only send changed fields
      const body: Partial<Omit<StoreProfile, "logoUrl">> = {};
      if (form.name !== initialForm?.name) body.name = form.name;
      if (form.description !== initialForm?.description) body.description = form.description;
      if (form.openTime !== initialForm?.openTime) body.openTime = form.openTime;
      if (form.closeTime !== initialForm?.closeTime) body.closeTime = form.closeTime;

      const response = await fetch(`${TOKO_URL}stores/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Save Store Response:", result);

      const updated = result?.data?.store || result?.data || result;

      const newForm: StoreProfile = {
        name: updated.name || form.name,
        description: updated.description ?? form.description,
        openTime: updated.openTime || form.openTime,
        closeTime: updated.closeTime || form.closeTime,
        logoUrl: updated.logoUrl || form.logoUrl,
      };

      setForm(newForm);
      setInitialForm(newForm);
      setLogoFile(null);

      alert("Profil toko berhasil disimpan!");
      router.push("/owner/store_detail");
    } catch (error) {
      console.error("Save Store Error:", error);
      alert("Terjadi kesalahan saat menghubungi server");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (hasChanges()) {
      const confirmLeave = window.confirm(
        "Ada perubahan yang belum disimpan. Yakin ingin keluar?"
      );
      if (!confirmLeave) return;
    }
    router.push("/owner/store_detail");
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#276749]" />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen mx-1 bg-white">
      {/* Header */}
      <div className="bg-[#E5E5E5] px-4 py-4 flex items-center gap-3 border-b border-[#CCCCCC]">
        <button
          onClick={handleBack}
          className="text-black hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Kembali"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h1 className="text-[18px] font-semibold text-black tracking-tight">
          Store Profile
        </h1>
      </div>

      {/* Content */}
      <div className="px-6 pt-8 pb-10 max-w-2xl mx-auto mt-6">
        {/* Logo */}
        <div className="mb-8 relative w-fit">
          <div
            className="relative w-24 h-24 rounded-full bg-[#808080] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            {form.logoUrl ? (
              <Image
                src={form.logoUrl}
                alt="Store Logo"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#808080] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12 text-gray-400"
                >
                  <path d="M5.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM2.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM18.75 7.5a.75.75 0 00-1.5 0v2.25H15a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H21a.75.75 0 000-1.5h-2.25V7.5z" />
                </svg>
              </div>
            )}
          </div>

          {/* Edit icon */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Ganti logo toko"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 3.487a2.1 2.1 0 113.03 2.908L8.25 18l-4.5 1.5 1.5-4.5L16.862 3.487z"
              />
            </svg>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-5">
          {/* Store Name */}
          <div>
            <label
              htmlFor="storeName"
              className="block text-[15px] font-medium text-black mb-2"
            >
              Store Name
            </label>
            <input
              id="storeName"
              type="text"
              value={form.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your store name"
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#276749] focus:border-transparent transition-all"
              style={{ maxWidth: "660px" }}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="storeDescription"
              className="block text-[15px] font-medium text-black mb-2"
            >
              Description
            </label>
            <textarea
              id="storeDescription"
              value={form.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              placeholder="Describe your store..."
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#276749] focus:border-transparent transition-all resize-none"
              style={{ maxWidth: "660px" }}
            />
          </div>

          {/* Open Time & Close Time */}
          <div
            className="flex flex-col sm:flex-row gap-5"
            style={{ maxWidth: "660px" }}
          >
            <div className="flex-1">
              <label
                htmlFor="openTime"
                className="block text-[15px] font-medium text-black mb-2"
              >
                Open Time
              </label>
              <input
                id="openTime"
                type="time"
                value={form.openTime}
                onChange={(e) => handleInputChange("openTime", e.target.value)}
                className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#276749] focus:border-transparent transition-all"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="closeTime"
                className="block text-[15px] font-medium text-black mb-2"
              >
                Close Time
              </label>
              <input
                id="closeTime"
                type="time"
                value={form.closeTime}
                onChange={(e) => handleInputChange("closeTime", e.target.value)}
                className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#276749] focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="flex items-center justify-end gap-4 mt-10"
          style={{ maxWidth: "660px" }}
        >
          <button
            onClick={handleReset}
            disabled={!hasChanges() || isSaving}
            className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges() || isSaving}
            className="bg-[#276749] hover:bg-[#1E4D37] text-white text-[14px] font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isSaving && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}