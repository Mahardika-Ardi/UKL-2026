'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/component/navbar-user';

export default function ShopPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/img/telkom.jpeg',
    '/img/telkom.jpeg',
    '/img/telkom.jpeg',
  ];

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* Carousel */}
      <div className="relative w-full h-100 bg-gray-200 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(${-currentIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full h-full shrink-0 relative">
              <Image
                src={image}
                alt="Shop Banner"
                fill
                className="object-cover rounded"
              />
            </div>
          ))}
        </div>
        <button
          onClick={prevImage}
          className="absolute left-4 bg-black text-white px-3 py-2 rounded-full hover:scale-110 transition-transform z-10"
        >
          ◀
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 bg-black text-white px-3 py-2 rounded-full hover:scale-110 transition-transform z-10"
        >
          ▶
        </button>
      </div>

      {/* Shop List */}
      <section className="px-8 py-16 bg-white">
        <h2 className="text-4xl font-bold mb-12 text-center">Shop List</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="border-2 border-gray-400 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-300">
                <h3 className="font-bold text-lg mb-1">Leon Shop</h3>
                <p className="text-sm text-gray-600">
                  loremipsub dot askwalnskasdj
                </p>
              </div>
              
              {/* Image Area */}
              <div className="relative h-100 bg-gray-300">
                <Image
                  src="/img/telkom.jpeg"
                  alt="Leon Shop"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}