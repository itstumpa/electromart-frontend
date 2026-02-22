'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Props {
  images: string[];
  name: string;
  discount: number | null;
  bestseller: boolean;
}

export default function ProductGallery({ images, name, discount, bestseller }: Props) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        key={activeImage}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22 }}
        className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm"
      >
        <Image
        fill
        // width={200}
        // height={200}
          src={images[activeImage]}
          alt={name}
          className="w-full h-full object-contain p-8"
        />
        {discount && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            -{discount}% OFF
          </span>
        )}
        {bestseller && (
          <span className="absolute top-4 right-4 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            Bestseller
          </span>
        )}
      </motion.div>

      {/* Thumbnails */}
      <div className="flex gap-3 flex-wrap">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i)}
            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white ${
              activeImage === i
                ? 'border-amber-600 shadow-md shadow-amber-200'
                : 'border-slate-200 hover:border-amber-300'
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <Image fill src={img} alt="" className="w-full h-full object-contain p-2" />
          </button>
        ))}
      </div>
    </div>
  );
}