'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function StoreVerificationPage() {
  const router = useRouter();
  const [docType, setDocType] = useState('id-card');
  const [idNumber, setIdNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);

    // Buat preview image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed && photoFile) {
      setIsSubmitted(true);
      console.log({ docType, idNumber, agreed, photoFile });

      // Delay navigate untuk menampilkan pesan "go to your store"
      setTimeout(() => {
        router.push('/owner/profile');
      }, 1500);
    }
  };

  const handleBack = () => {
    router.push('/user/shop');
  };

  return (
    <div className="min-h-screen bg-white py-8">
      {/* Header Section - Left Aligned */}
      <div className="px-6 mb-4">
        {/* Title with Back Button */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="text-black hover:opacity-70 transition-opacity cursor-pointer"
            title="Back to shop"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-left text-black  ">Identity Verification</h1>
        </div>

        {/* Separator Line */}
        <div className="border-b border-gray-300"></div>
      </div>

      {/* Security Info Box - Left Aligned */}
      <div className="px-6 mb-12">
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 flex gap-3 items-start">
          <div className="text-blue-600 text-xl shrink-0">🛡️</div>
          <p className="text-blue-900 text-sm font-medium">
            Your data is only used for verification purposes and is kept secure.
          </p>
        </div>
      </div>

      {/* Centered Content Section */}
      <div className="flex justify-center px-6">
        <div className="max-w-lg w-full">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="flex justify-center py-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer"
              >
                {photoPreview ? (
                  <div className="w-56 h-56 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-56 h-56 bg-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-350 transition duration-200">
                    <div className="text-center">
                      <p className="text-gray-600 text-lg font-medium">Image</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* Document Type Section */}
            <div className="text-center space-y-4">
              <h2 className="text-lg font-bold">Photo of Your ID Card</h2>
              <p className="text-gray-600 text-sm">
                You can use a national ID Card or Passport.
              </p>

              {/* Radio Buttons */}
              <div className="flex gap-6 justify-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="doc-type"
                    value="id-card"
                    checked={docType === 'id-card'}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 text-sm">ID Card</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="doc-type"
                    value="passport"
                    checked={docType === 'passport'}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 text-sm">Passport</span>
                </label>
              </div>

              {/* ID Number Input */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  National ID / Passport Number
                </label>
                <input
                  type="text"
                  placeholder="1XXXXXXXXX"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-gray-600"
                />
                <label htmlFor="agree" className="text-xs text-gray-700 cursor-pointer">
                  I agree to submit my personal data for verification.
                </label>
              </div>

              {/* Submit Button */}
              {isSubmitted ? (
                <div className="text-center py-3">
                  <p className="text-lg font-bold text-green-600 animate-pulse">
                    ✓ Go to your store
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!agreed || !photoFile}
                  className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Take Photo
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}