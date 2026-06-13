"use client";

import { getAllTags, type TagDto } from "@/api/tag.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { motion } from "framer-motion";
import { Tag, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TagsClient() {
  const [tags, setTags] = useState<TagDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = () => {
    setLoading(true);
    getAllTags()
      .then((res) => setTags(res.data.data ?? []))
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load tags")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBEB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-48" />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-full w-28" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1
            className="text-2xl sm:text-3xl font-black text-slate-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Browse by Tags
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover products by topic — {tags.length} tags available
          </p>
        </div>

        {tags.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <Tag size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-semibold">No tags available</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, i) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/tags/${tag.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-full text-sm font-medium text-slate-700 hover:text-amber-700 transition-all shadow-sm hover:shadow"
                >
                  <Tag size={14} className="text-amber-500" />
                  {tag.name}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
