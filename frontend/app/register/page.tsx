'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react'
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!firstName || !email || !password || !birthDate || !gender) {
      alert('Semua field wajib diisi');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://ukl-2026-production.up.railway.app/api/v1/auth/register",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            email,
            password,
            birthDate,
            gender,
          }),
        },
      );

      const data = await response.json();
      console.log('Register Response:', data);

      if (!response.ok) {
        alert(data.message || 'Register gagal');
        return;
      }

      const token = data.token || data.accessToken || data?.data?.token;
      if (token) localStorage.setItem('token', token);

      const user = data.user || data?.data?.user;
      if (user) localStorage.setItem('user', JSON.stringify(user));

      alert('Register berhasil');
      router.push('/login');

    } catch (error) {
      console.error('Register Error:', error);
      alert('Terjadi kesalahan saat menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-300 relative">
        <Image src="/img/telkom.jpeg" alt="telkom" fill className="object-cover" />
      </div>

      <div className="flex-1 bg-white px-12 py-8 flex flex-col text-black overflow-y-auto">

        <div className="flex justify-end gap-8 mb-12 mr-20">
          <Link href="/login" className="font-semibold bg-gray-300 px-4 py-2 rounded-lg hover:underline">
            Login
          </Link>
          <Link href="/register" className="font-semibold text-white bg-gray-600 px-4 py-2 rounded-lg">
            Register
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Create Account</h1>
            <p className="text-gray-700 leading-relaxed">
              Daftarkan akunmu untuk mulai menggunakan layanan kami.
            </p>
          </div>

          {/* First Name */}
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">First Name</label>
            <input
              type="text"
              placeholder="Masukkan nama depan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              placeholder="abcd@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              placeholder="123456789"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* Birth Date */}
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Birth Date</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* Gender */}
          <div className="mb-8">
            <label className="block text-sm font-bold mb-2">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-black bg-white"
            >
              <option value="">-- Pilih Gender --</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="PREFER_NOT_TO_SAY">Prefer Not To Say</option>
            </select>
          </div>

          {/* Button Register */}
          <div className="mb-8">
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-700 font-semibold">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="flex gap-4 justify-center">
            <button className="flex-1 bg-gray-300 text-black font-bold py-3 rounded-lg hover:bg-gray-400 transition">Google</button>
            <button className="flex-1 bg-gray-300 text-black font-bold py-3 rounded-lg hover:bg-gray-400 transition">Facebook</button>
            <button className="flex-1 bg-gray-300 text-black font-bold py-3 rounded-lg hover:bg-gray-400 transition">Apple</button>
          </div>
        </div>
      </div>
    </div>
  );
}