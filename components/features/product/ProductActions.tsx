"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { addToCart, addToGuestCart } from "@/api/cart.api";
import {
  addToWishlist,
  addToGuestWishlist,
  checkWishlistItem,
  checkGuestWishlistItem,
  removeFromWishlist,
  removeFromGuestWishlist,
} from "@/api/wishlist.api";
import { notifyCartUpdated } from "@/hooks/useCartCount";
import { getApiErrorMessage, isUnauthorized } from "@/utils/api-error";
import { authStorage } from "@/utils/auth-storage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  productId: string;
  stock: number;
  price: number;
  originalPrice?: number;
}

export default function ProductActions({
  productId,
  stock,
  price,
  originalPrice,
}: Props) {
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = authStorage.getAuthUser();
    const check = user ? checkWishlistItem : checkGuestWishlistItem;
    check(productId)
      .then((res) => setWishlisted(res.data.data?.inWishlist ?? false))
      .catch(() => setWishlisted(false));
  }, [productId]);

  const toggleWishlist = async () => {
    const user = authStorage.getAuthUser();
    const remove = user ? removeFromWishlist : removeFromGuestWishlist;
    const add = user ? addToWishlist : addToGuestWishlist;
    try {
      if (wishlisted) {
        await remove(productId);
        setWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await add(productId);
        setWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      if (!isUnauthorized(err)) {
        toast.error(getApiErrorMessage(err, "Wishlist update failed"));
      }
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    const user = authStorage.getAuthUser();
    const add = user ? addToCart : addToGuestCart;
    try {
      await add(productId, qty);
      notifyCartUpdated();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setBuyingNow(true);
    const user = authStorage.getAuthUser();
    const add = user ? addToCart : addToGuestCart;
    try {
      await add(productId, qty);
      notifyCartUpdated();
      router.push("/checkout");
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Unable to proceed. Please try again."),
      );
    } finally {
      setBuyingNow(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Quantity + CTA row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Qty stepper */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden w-fit">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center text-sm font-bold text-slate-900 tabular-nums">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Add to cart */}
        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
          disabled={stock === 0 || adding}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
            stock === 0
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : addedToCart
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300"
          }`}
        >
          <AnimatePresence mode="wait">
            {addedToCart ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                Added to Cart!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <ShoppingCart size={16} />
                {stock === 0 ? "Out of Stock" : "Add to Cart"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Buy Now */}
        <motion.button
          onClick={handleBuyNow}
          whileTap={{ scale: 0.97 }}
          disabled={stock === 0 || buyingNow}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-white border-2 border-amber-600 text-slate-800 hover:bg-amber-50 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 shadow-md transition-all duration-300"
        >
          {buyingNow ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
            />
          ) : (
            <>
              <Zap size={16} />
              {stock === 0 ? "Unavailable" : "Buy Now"}
            </>
          )}
        </motion.button>

        {/* Wishlist */}
        <motion.button
          onClick={toggleWishlist}
          whileTap={{ scale: 0.88 }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
            wishlisted
              ? "bg-red-50 border-red-300 text-red-500"
              : "border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-400"
          }`}
        >
          <Heart size={18} className={wishlisted ? "fill-red-500" : ""} />
        </motion.button>
      </div>

      {/* Stock warning */}
      {stock > 0 && stock <= 15 && (
        <p className="text-xs text-red-600 font-semibold">
          ⚠ Only {stock} left in stock — order soon
        </p>
      )}

      {/* Total for qty > 1 */}
      {qty > 1 && (
        <p className="text-xs text-slate-500">
          Total:{" "}
          <span className="font-bold text-slate-900">
            ${(price * qty).toLocaleString()}
          </span>
          {originalPrice && (
            <span className="ml-2 line-through text-slate-400">
              ${(originalPrice * qty).toLocaleString()}
            </span>
          )}
        </p>
      )}

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
        {[
          { icon: Truck, label: "Free Shipping", sub: "Orders over $99" },
          { icon: Shield, label: "2yr Warranty", sub: "Genuine product" },
          { icon: RotateCcw, label: "30-Day Return", sub: "No questions" },
        ].map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center gap-1 p-3 bg-amber-50 rounded-xl"
          >
            <Icon size={17} className="text-amber-700" />
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {label}
            </p>
            <p className="text-[10px] text-slate-500">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
