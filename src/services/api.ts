const BASE_URL = "https://api.abcz.workers.dev/api/bazardor";

export async function fetchProducts(category?: string) {
  const url = category ? `${BASE_URL}/products?category=${category}` : `${BASE_URL}/products`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductById(id: string | number) {
  const res = await fetch(`${BASE_URL}/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}