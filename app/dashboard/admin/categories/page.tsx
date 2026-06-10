// SERVER COMPONENT — static shell; CategoriesClient fetches data client-side
import CategoriesClient from "@/components/dashboard/admin/categories/CategoriesClient";
import { mockBrands, mockCategories } from "@/data/mock-data";
import { Tag } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Categories & Brands — Admin" };

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
          <Tag size={20} className="text-green-700" />
        </div>
        <div>
          <h1
            className="text-2xl font-black text-slate-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Categories & Brands
          </h1>
          <p className="text-sm text-slate-500">
            {mockCategories.length} categories · {mockBrands.length} brands
          </p>
        </div>
      </div>
      <CategoriesClient
        initialCategories={mockCategories}
        initialBrands={mockBrands}
      />
    </div>
  );
}
