
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight, Star } from 'lucide-react';

import { getProductBySlug, mockProducts, mockReviews } from '@/data/mock-data';
import ProductGallery from '@/components/features/product/ProductGallery';
import ProductTabs from '@/components/features/product/ProductTabs';
import Reveal from '../../Utilities/Reveal';
import ProductCard from '../../Utilities/Productcard';
import ProductActions from '@/components/features/product/ProductActions';

/* ── Types ──────────────────────────────────── */
interface Props {
  params: Promise<{ slug: string }>;   // Next.js 15+: params is a Promise
}

/* ── Dynamic metadata (also async) ─────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found — ElectroMart' };

  return {
    title: `${product.name} — ElectroMart`,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: [{ url: product.image, width: 800, height: 800 }],
    },
  };
}

/* ── Static params (optional but good for SSG) ── */
export function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

/* ── Page component ─────────────────────────── */
export default async function ProductDetailPage({ params }: Props) {
  // ✅ Await params — required in Next.js 15+
  const { slug } = await params;

  // ✅ Data fetching in server component — no useEffect, no loading states
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const productReviews = mockReviews.filter((r) => r.productId === product.id);

  const relatedProducts = mockProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const categorySlug = product.categoryName.toLowerCase().replace(/[\s&]+/g, '-');

  return (
    <div className="min-h-screen bg-[#FFFBEB]">

      {/* ── Breadcrumb (server-rendered, no JS needed) ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
              <li>
                <Link href="/" className="hover:text-amber-600 transition-colors">
                  Home
                </Link>
              </li>
              <li><ChevronRight size={11} /></li>
              <li>
                <Link href="/products" className="hover:text-amber-600 transition-colors">
                  Products
                </Link>
              </li>
              <li><ChevronRight size={11} /></li>
              <li>
                <Link
                  href={`/products?category=${categorySlug}`}
                  className="hover:text-amber-600 transition-colors"
                >
                  {product.categoryName}
                </Link>
              </li>
              <li><ChevronRight size={11} /></li>
              <li>
                <span className="text-slate-700 font-medium truncate max-w-50 block">
                  {product.name}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Product hero ── */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">

          {/* 
            CLIENT COMPONENT — handles image switching 
            All data passed as props from server 
          */}
          <ProductGallery
            images={product.images}
            name={product.name}
            discount={discount}
            bestseller={product.bestseller}
          />

          {/* ── Product info (server-rendered) ── */}
          <div className="flex flex-col gap-5">

            {/* Brand + category */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                {product.brandName}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">{product.categoryName}</span>
              {product.featured && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-200'
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-900">{product.rating}</span>
              <span className="text-sm text-slate-400">
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  product.stock > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-black text-slate-900">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 
              CLIENT COMPONENT — handles qty, cart, wishlist 
              Only interactive state lives here
            */}
            <ProductActions
              stock={product.stock}
              price={product.price}
              originalPrice={product.originalPrice}
            />
          </div>
        </div>

        {/* 
          CLIENT COMPONENT — handles tab switching 
          Data passed as plain serializable props
        */}
        <Reveal className="mb-16">
          <ProductTabs
            specifications={product.specifications}
            reviews={productReviews}
          />
        </Reveal>

        {/* ── Related products (server-rendered) ── */}
        {relatedProducts.length > 0 && (
          <Reveal>
            <div className="flex items-end justify-between mb-6">
              <h2
                className="text-2xl font-black text-slate-900"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                You Might Also Like
              </h2>
              <Link
                href={`/products?category=${categorySlug}`}
                className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.07}>
                  <ProductCard product={p} index={i} />
                </Reveal>
              ))}
            </div>
          </Reveal>
        )}

      </div>
    </div>
  );
}