import axios, { AxiosError } from "axios";
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

    const json = await response.json();

    console.log("Products Response:", json);

    return json.data.products;
  } catch (error) {
    console.error("Error saat fetch produk:", error);
    return null;
  }
};

export const TambahProduct = async (
  formData: FormData,
): Promise<ResponseData> => {
  try {
    const token = await getServerCookies("token");

    const response = await axios.post(`${TOKO_URL}products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      status: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "Gagal menambahkan product",
    };
  }
};

export const EditProduct = async (
  id: number,
  formData: FormData,
): Promise<ResponseData> => {
  try {
    const token = await getServerCookies("token");

    const response = await axios.patch(`${TOKO_URL}products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      status: true,
      message: response.data.message ?? "Product berhasil diupdate",
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "Gagal update product",
    };
  }
};

export const HapusProduct = async (id: number): Promise<ResponseData> => {
  try {
    const token = await getServerCookies("token");

    const response = await axios.delete(`${TOKO_URL}products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      status: true,
      message: response.data.message ?? "Product berhasil dihapus",
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "Gagal menghapus product",
    };
  }
};
