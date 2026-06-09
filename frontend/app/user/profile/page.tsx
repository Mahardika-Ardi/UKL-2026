"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  avatarUrl: string | null;
  avatarPublicId: string | null;
}

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    avatarUrl: null,
    avatarPublicId: null,
  });
  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}users/me`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Fetched profile data:", result);

        if (result.data) {
          const userData: UserProfile = {
            firstName: result.data.firstName || "",
            lastName: result.data.lastName || "",
            email: result.data.email || "",
            phone: result.data.phone || "",
            gender: result.data.gender || "",
            birthDate: result.data.birthDate
              ? result.data.birthDate.split("T")[0] // Normalize ISO date to YYYY-MM-DD
              : "",
            avatarUrl: result.data.avatarUrl || null,
            avatarPublicId: result.data.avatarPublicId || null,
          };
          setProfile(userData);
          setInitialProfile(userData);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // If your backend supports direct image upload, replace this with your actual upload logic.
  // This example assumes the backend returns { avatarUrl, avatarPublicId } after upload.
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}users/me/avatar`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.data) {
        setProfile((prev) => ({
          ...prev,
          avatarUrl: result.data.avatarUrl || prev.avatarUrl,
          avatarPublicId: result.data.avatarPublicId || prev.avatarPublicId,
        }));
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);

      // Fallback: preview locally via FileReader if upload not yet available
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleReset = () => {
    if (initialProfile) {
      setProfile(initialProfile);
    } else {
      setProfile({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        birthDate: "",
        avatarUrl: null,
        avatarPublicId: null,
      });
    }
  };

  const hasChanges = () => {
    if (!initialProfile) return false;
    return JSON.stringify(profile) !== JSON.stringify(initialProfile);
  };

  const handleSave = async () => {
    if (!hasChanges()) {
      alert("No changes to save");
      return;
    }

    setIsSaving(true);

    try {
      // Build request body sesuai UpdateUserDto + field dari RegisterDto
      const body: Record<string, string | null | undefined> = {
        firstName: profile.firstName || undefined,
        lastName: profile.lastName || undefined,
        gender: profile.gender || undefined,
        birthDate: profile.birthDate || undefined,
        phone: profile.phone || undefined,
        avatarUrl: profile.avatarUrl || undefined,
        avatarPublicId: profile.avatarPublicId || undefined,
      };

      // Hapus key yang undefined agar tidak terkirim
      Object.keys(body).forEach(
        (key) => body[key] === undefined && delete body[key]
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_JAJAL_URL}users/me`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.data) {
        const updated: UserProfile = {
          firstName: result.data.firstName || "",
          lastName: result.data.lastName || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          gender: result.data.gender || "",
          birthDate: result.data.birthDate
            ? result.data.birthDate.split("T")[0]
            : "",
          avatarUrl: result.data.avatarUrl || null,
          avatarPublicId: result.data.avatarPublicId || null,
        };
        setProfile(updated);
        setInitialProfile(updated);
        alert("Profile saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (hasChanges()) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    router.push("/user/shop");
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#276749]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-1 bg-white">
      {/* Header */}
      <div className="bg-[#E5E5E5] px-4 py-4 flex items-center gap-3 border-b border-[#CCCCCC]">
        <button
          onClick={handleBack}
          className="text-black hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Go back"
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
          Edit Profile
        </h1>
      </div>

      {/* Content */}
      <div className="px-6 pt-8 pb-10 max-w-2xl mx-auto mt-6">
        {/* Avatar */}
        <div className="mb-8 relative w-fit">
          <div
            className="w-24 h-24 rounded-full bg-[#808080] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!isUploadingAvatar) fileInputRef.current?.click();
              }
            }}
          >
            {isUploadingAvatar ? (
              <div className="w-full h-full bg-[#808080] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-[#808080] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12 text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Edit Icon */}
          <button
            onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Change avatar"
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
            onChange={handleAvatarChange}
          />
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-5">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-[15px] font-medium text-black mb-2"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={profile.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#276749] focus:border-transparent transition-all"
              style={{ maxWidth: "660px" }}
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-[15px] font-medium text-black mb-2"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={profile.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#276749] focus:border-transparent transition-all"
              style={{ maxWidth: "660px" }}
            />
          </div>

          {/* Email - Read Only */}
          <div>
            <label
              htmlFor="email"
              className="block text-[15px] font-medium text-black mb-2"
            >
              Email{" "}
              <span className="text-[12px] font-normal text-gray-400">
                (cannot be changed)
              </span>
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              readOnly
              className="w-full bg-[#D9D9D9] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-500 cursor-not-allowed"
              style={{ maxWidth: "660px" }}
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-[15px] font-medium text-black mb-2"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="e.g. +6281234567890"
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#276749] focus:border-transparent transition-all"
              style={{ maxWidth: "660px" }}
            />
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-[15px] font-medium text-black mb-2"
            >
              Gender
            </label>
            <select
              id="gender"
              value={profile.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#276749] focus:border-transparent transition-all appearance-none"
              style={{ maxWidth: "660px" }}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="birthDate"
              className="block text-[15px] font-medium text-black mb-2"
            >
              Date of Birth
            </label>
            <input
              id="birthDate"
              type="date"
              value={profile.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#276749] focus:border-transparent transition-all"
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
            disabled={!hasChanges()}
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}