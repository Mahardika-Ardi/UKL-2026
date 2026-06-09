export interface Product {
  id: number;
  nama_barang: string;
  deskripsi: string;
  harga: number;
  stok: number;
  imageUrl?: string;
}
 
export interface ResponseData {
  status: boolean;
  message: string;
}
 