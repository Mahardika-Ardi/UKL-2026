"use client";

import Modal from "@/component/modal";
import { TambahProduct } from "@/services/products";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export const FormProducts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState<File | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error("Pilih gambar terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("stock", String(stock));
    formData.append("image", image);

    const response = await TambahProduct(formData);

    if (response.status) {
      toast.success(response.message);

      setName("");
      setDescription("");
      setPrice(0);
      setStock(0);
      setImage(null);

      setIsOpen(false);
      router.refresh();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Tambah Product
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Tambah Product"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Nama Product</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded py-2 px-4 w-full"
              required
            />
          </div>

          <div>
            <label>Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="border border-gray-300 rounded py-2 px-4 w-full"
              required
            />
          </div>

          <div>
            <label>Harga</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border border-gray-300 rounded py-2 px-4 w-full"
              required
            />
          </div>

          <div>
            <label>Stok</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="border border-gray-300 rounded py-2 px-4 w-full"
              required
            />
          </div>

          <div>
            <label>Gambar</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 px-5 py-3 bg-green-500 text-white rounded-md shadow hover:bg-blue-600 transition duration-200"
          >
            Tambah
          </button>
        </form>
      </Modal>
    </div>
  );
};

/* return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition duration-200"
      >
        Tambah Lek
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Form Barang">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="nama_barang" className="text-sm font-medium text-slate-700">
              Nama Barang
            </label>
            <input
              type="text"
              id="nama_barang"
              name="nama_barang"
              value={nama_barang}
              onChange={(e) => setNamaBarang(e.target.value)}
              className="border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="deskripsi" className="text-sm font-medium text-slate-700">
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="border border-gray-300 rounded-xl py-3 px-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <label htmlFor="harga" className="text-sm font-medium text-slate-700">
                Harga
              </label>
              <input
                type="number"
                id="harga"
                name="harga"
                value={harga}
                onChange={(e) => setHarga(Number(e.target.value))}
                className="border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="stok" className="text-sm font-medium text-slate-700">
                Stok
              </label>
              <input
                type="number"
                id="stok"
                name="stok"
                value={stok}
                onChange={(e) => setStok(Number(e.target.value))}
                className="border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="image" className="text-sm font-medium text-slate-700">
              Gambar
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              className="border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 px-5 py-3 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition duration-200"
          >
            Simpan
          </button>
        </form>
      </Modal>
    </div>
  ) */
