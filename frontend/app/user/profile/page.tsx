"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("Lorep_Ipsum");
  const [email, setEmail] = useState("Lorep Ipsum@gmail.com");
  const [number, setNumber] = useState("08XX-XXXX-XXXX");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setName("Lorep_Ipsum");
    setEmail("Lorep Ipsum@gmail.com");
    setNumber("08XX-XXXX-XXXX");
    setGender("Male");
    setDob("");
    setAvatar(null);
  };

  const handleSave = () => {
    alert("Changes saved!");
  };

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
          {/* Edit Icon */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
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
          {/* Name */}
          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              style={{ maxWidth: "660px" }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              style={{ maxWidth: "660px" }}
            />
          </div>

          {/* Number */}
          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Number
            </label>
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              style={{ maxWidth: "660px" }}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Gender
            </label>
            <input
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="Male"
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              style={{ maxWidth: "660px" }}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Date of Birth
            </label>
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-500 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
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
            className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors px-2"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="bg-[#276749] hover:bg-[#1E4D37] text-white text-[14px] font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}