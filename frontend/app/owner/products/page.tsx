import { GetProduct } from "@/services/products";
import { Product } from "@/types/products";
import Navbar from "@/component/navbar_owner";
 
const ProductPage = async () => {
  const data: Product[] | null = await GetProduct();
 
  return (
    <div>
      <Navbar />
 
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-black">Admin Barang</h1>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {data?.map((barang) => (
            <div
              key={barang.id}
              className="border border-black text-black rounded-lg shadow p-4"
            >
              <h2>{barang.nama_barang}</h2>
              <p>{barang.deskripsi}</p>
              <p>Rp {barang.harga}</p>
              <p>Stok: {barang.stok}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default ProductPage;
 