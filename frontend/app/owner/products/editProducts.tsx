'use client'

import Modal from '@/components/modal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { EditBarang } from '@/service/barang';

export const FormEditBarang = ({ id, nama_barang, deskripsi, harga, stok }: { id: number, nama_barang: string, deskripsi: string, harga: number, stok: number }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [namaBarang, setNamaBarang] = useState(nama_barang);
  const [deskripsiBarang, setDeskripsiBarang] = useState(deskripsi);
  const [hargaBarang, setHargaBarang] = useState(harga);
  const [stokBarang, setStokBarang] = useState(stok);
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nama_barang', namaBarang);
    formData.append('deskripsi', deskripsiBarang);
    formData.append('harga', String(hargaBarang));
    formData.append('stok', String(stokBarang));
    if (image) formData.append('image', image);

    const response = await EditBarang(id, formData);
    console.log(response);
    if (response.status) {
      toast("Barang berhasil diupdate", {
        hideProgressBar: true, containerId: 'UploudImage',
        type: "success", autoClose: 3000
      });
      setIsOpen(false);
      router.refresh();
    } else {
      toast("Gagal mengupdate barang", {
        hideProgressBar: true, containerId: 'UploudImage',
        type: "error", autoClose: 3000
      });
    }
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-3 px-9 py-1 bg-blue-500 rounded text-white shadow hover:bg-blue-600 transition duration-200"
      >
        Edit
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Edit Barang</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
            <input
              type="text"
              value={namaBarang}
              onChange={(e) => setNamaBarang(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              value={deskripsiBarang}
              onChange={(e) => setDeskripsiBarang(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Harga</label>
            <input
              type="number"
              value={hargaBarang}
              onChange={(e) => setHargaBarang(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stok</label>
            <input
              type="number"
              value={stokBarang}
              onChange={(e) => setStokBarang(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gambar</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 px-5 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition duration-200"
          >
            Simpan Perubahan
          </button>
        </form>
      </Modal>
    </div>
  )
}