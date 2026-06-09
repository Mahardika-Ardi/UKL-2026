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

    if (!response.ok) {
      console.error(
        "Gagal fetch produk:",
        response.status,
        response.statusText,
      );
      return null;
    }

    const json: unknown = await response.json();

    if (Array.isArray(json)) {
      return json as Product[];
    }

    if (
      typeof json === "object" &&
      json !== null &&
      "data" in json &&
      Array.isArray((json as { data: unknown }).data)
    ) {
      return (json as { data: Product[] }).data;
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
      message: response.data.message ?? "Product berhasil ditambahkan",
    };
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return {
        status: false,
        message:
          axiosError.response?.data?.message ?? "Gagal menambahkan product",
      };
    }

    if (error instanceof Error) {
      return {
        status: false,
        message: error.message,
      };
    }

    return {
      status: false,
      message: "Gagal menambahkan product",
    };
  }
};
