  'use client'

  import { HapusProduct } from "@/services/products";
  import { toast } from "react-toastify";
  import { useRouter } from "next/navigation";

  export const HapusProductButton = ({ billId }: { billId: number }) => {
    const router = useRouter();
    const handleDelete = async () => { 
      const response = await HapusProduct(billId);
      if (response.status) {
        toast("Barang berhasil dihapus", {
          hideProgressBar: true, containerId: 'UploudImage',
          type: "success", autoClose: 3000
        });
        router.refresh();
      } else {
        toast("Gagal menghapus barang", {
          hideProgressBar: true, containerId: 'UploudImage',
          type: "error", autoClose: 3000
        });
      }
    }

    return (
      <button
        onClick={handleDelete}
        className="mt-3 px-7 py-1 bg-red-500 rounded text-white shadow hover:bg-red-600 transition duration-200"
      >
        Hapus
      </button>
    );
  }