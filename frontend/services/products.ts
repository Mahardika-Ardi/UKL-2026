import axios from "axios";
import { Product, ResponseData } from "@/types/products";
import { getServerCookies } from "@/lib/server-cookies";
import { TOKO_URL } from "@/global";
 
export const GetProduct = async (): Promise<Product[] | null> => {
  try {
    const response = await fetch(`${TOKO_URL}products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
 
    if (!response.ok) {
      console.error(
        "Gagal fetch produk:",
        response.status,
        response.statusText,
      );
      return null;
    }
 
    const json = await response.json();
 
    if (Array.isArray(json)) {
      return json as Product[];
    } else if (json?.data && Array.isArray(json.data)) {
      return json.data as Product[];
    }
 
    return null;
  } catch (error) {
    console.error("Error saat fetch produk:", error);
    return null;
  }
};
 
export const TambahProduct = async (
  formData: FormData,
): Promise<ResponseData> => {
  try {
    // getServerCookies (plural) sesuai nama import
    const token = await getServerCookies("token");
 
    const response = await axios({
      method: "POST",
      url: `${TOKO_URL}products`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
 
    return {
      status: true,
      message: response.data.message || "Product berhasil ditambahkan",
    };
  } catch (error: any) {
    console.error(error);
    return {
      status: false,
      message: error.response?.data?.message || "Gagal menambahkan product",
    };
  }
};