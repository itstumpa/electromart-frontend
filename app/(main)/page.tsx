import BestSellers from "./home/TopSaleProducts";
import CategoryGrid from "./home/Categorygrid";
import DealsBanner from "./home/Dealsbanner";
import FeaturedProducts from "./home/Featuredproducts";
import HeroBanner from "./home/Herobanner";
import SaleBanner from "./home/Salebanner";
import OnSale from "./home/Onsale";
import TestimonialsSection from "./home/Testimonialssection";
import TopVendors from "./home/Topvendors";
import TopBrands from "./home/Topbrands";
import PopularProducts from "./home/Popularproducts";
import CTABentoGrid from "./home/Ctabentogrid";


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
      <SaleBanner />
      <PopularProducts />
      <CTABentoGrid />
      <BestSellers />
      <TopVendors />
      <TopBrands />
      <OnSale />
      {/* <DealsBanner /> */}
      <TestimonialsSection />
    </>
  );
}