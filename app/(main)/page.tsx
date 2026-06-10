import dynamic from "next/dynamic";
import CategoryGrid from "./home/Categorygrid";
import HeroBanner from "./home/Herobanner";
// import BestSellers from "./home/TopSaleProducts";
// import FeaturedProducts from "./home/Featuredproducts";
// import OnSale from "./home/Onsale";
// import TestimonialsSection from "./home/Testimonialssection";
// import TopVendors from "./home/Topvendors";
// import TopBrands from "./home/Topbrands";
// import PopularProducts from "./home/Popularproducts";
// import CTABentoGrid from "./home/Ctabentogrid";

const FeaturedProducts = dynamic(() => import("./home/Featuredproducts"), {
  loading: () => (
    <div className="h-96 animate-pulse bg-slate-100 rounded-2xl mx-4" />
  ),
});
const PopularProducts = dynamic(() => import("./home/Popularproducts"), {
  loading: () => (
    <div className="h-96 animate-pulse bg-slate-100 rounded-2xl mx-4" />
  ),
});
const CTABentoGrid = dynamic(() => import("./home/Ctabentogrid"), {
  loading: () => (
    <div className="h-64 animate-pulse bg-slate-100 rounded-2xl mx-4" />
  ),
});
const BestSellers = dynamic(() => import("./home/TopSaleProducts"), {
  loading: () => (
    <div className="h-96 animate-pulse bg-slate-100 rounded-2xl mx-4" />
  ),
});
const TopVendors = dynamic(() => import("./home/Topvendors"), {
  loading: () => (
    <div className="h-64 animate-pulse bg-slate-100 rounded-2xl mx-4" />
  ),
});
const TopBrands = dynamic(() => import("./home/Topbrands"), {
  loading: () => (
    <div className="h-48 animate-pulse bg-slate-100 rounded-2xl mx-4" />
  ),
});
const OnSale = dynamic(() => import("./home/Onsale"), {
  loading: () => (
    <div className="h-96 animate-pulse bg-slate-100 rounded-2xl mx-4" />
  ),
});
const TestimonialsSection = dynamic(
  () => import("./home/Testimonialssection"),
  {
    loading: () => (
      <div className="h-64 animate-pulse bg-slate-100 rounded-2xl mx-4" />
    ),
  },
);

export const metadata = {
  title: "ElectroMart — Tech That Moves You Forward",
  description:
    "Discover the latest smartphones, laptops, audio gear, cameras and more. Authorized reseller with genuine warranty and free shipping on orders over $99.",
};

export default function HomePage() {
  return (
    <>
    
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <PopularProducts />
      <CTABentoGrid />
      <BestSellers />
      <TopVendors />
      <TopBrands />
      <OnSale />
      <TestimonialsSection />
    </>
  );
}
