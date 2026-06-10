import type { Product } from "@/data/types";
import { getServerApiBase } from "@/lib/api-config";
import {
  mapDetailDtoToProduct,
  mapListItemDtoToProduct,
} from "@/lib/product-mappers";
import type { ApiResponse } from "@/types/api";
import type { ProductDetailDto, ProductListItemDto } from "@/types/product";

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    const res = await fetch(
      `${getServerApiBase()}/products/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 60 },
        credentials: "include",
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResponse<ProductDetailDto>;
    return mapDetailDtoToProduct(json.data);
  } catch {
    return null;
  }
}

export async function fetchRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  try {
    const res = await fetch(
      `${getServerApiBase()}/products?categoryId=${product.categoryId}&limit=${limit + 1}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data: ProductListItemDto[];
    };
    return json.data
      .filter((p) => p.id !== product.id)
      .slice(0, limit)
      .map(mapListItemDtoToProduct);
  } catch {
    return [];
  }
}
