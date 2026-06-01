"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("Lorep_Ipsum");
  const [email, setEmail] = useState("Lorep Ipsum@gmail.com");
  const [Bankname, setBankname] = useState("08XX-XXXX-XXXX");
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
    setBankname("08XX-XXXX-XXXX");
    setGender("Male");
    setDob("");
    setAvatar(null);
  };

  const handleSave = () => {
    alert("Changes saved!");
  };

  const handleBack = () => {
    router.push("/owner/store_detail");
  };

  return (
    <div className="min-h-screen mx-1 bg-white">
      {/* Header */}
      <div
        className="bg-[#E5E5E5] px-4 py-4 flex items-center gap-3 border-b border-[#CCCCCC]">
        <button
          onClick={handleBack}
          className="text-black hover:opacity-70 transition-opacity cursor-pointer"
        >
          <span className="text-2xl font-bold">←</span>
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
          {/* Name */}
          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Store_Name
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

          {/* Bankname */}
          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Bank Name
            </label>
            <input
              type="text"
              value={Bankname}
              onChange={(e) => setBankname(e.target.value)}
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              style={{ maxWidth: "660px" }}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[15px] font-medium text-black mb-2">
              Bank Account Number
            </label>
            <input
              type="tel"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="Male"
              className="w-full bg-[#EBEBEB] border border-[#C8C8C8] rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
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