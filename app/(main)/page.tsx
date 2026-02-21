import BestSellers from "./home/Bestsellers";
import CategoryGrid from "./home/Categorygrid";
import DealsBanner from "./home/Dealsbanner";
import FeaturedProducts from "./home/Featuredproducts";
import HeroBanner from "./home/Herobanner";
import OnSale from "./home/Onsale";
import TestimonialsSection from "./home/Testimonialssection";


export const metadata = {
  title: 'ElectroMart — Tech That Moves You Forward',
  description:
    'Discover the latest smartphones, laptops, audio gear, cameras and more. Authorized reseller with genuine warranty and free shipping on orders over $99.',
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <BestSellers />
      <OnSale />
      <DealsBanner />
      <TestimonialsSection />
    </>
  );
}