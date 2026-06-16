"use client";

import { getMyAddresses } from "@/src/services/api/address.api";
import {
  applyCartCoupon,
  applyGuestCartCoupon,
  getCart,
  getGuestCart,
  removeCartCoupon,
  removeGuestCartCoupon,
} from "@/src/services/api/cart.api";
import { placeGuestOrder, placeOrder } from "@/src/services/api/order.api";
import { initiatePayment, initiateGuestPayment } from "@/src/services/api/payment.api";
import type { Address, CartItem } from "@/data/types";
import { notifyCartUpdated } from "@/hooks/useCartCount";
import { mapAddressesToUi } from "@/lib/address-mappers";
import { mapCartItemsToUi } from "@/lib/cart-mappers";
import { getApiErrorMessage } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  MapPin,
  Shield,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import GuestCheckoutSection from "./components/GuestCheckoutSection";
import ShippingAddressSection from "./components/ShippingAddressSection";
import PaymentMethodSection from "./components/PaymentMethodSection";
import OrderSummarySection from "./components/OrderSummarySection";
import CouponSection from "./components/CouponSection";
import CheckoutActions from "./components/CheckoutActions";

// ─── Types ───────────────────────────────────────────────────
type Step = "address" | "payment" | "review";

interface ShippingForm {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentForm {
  method: "stripe" | "cod" | "sslcommerz";
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

// ─── Step indicator ───────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: "address", label: "Address", icon: MapPin },
    { key: "payment", label: "Payment", icon: CreditCard },
    { key: "review", label: "Review", icon: ShoppingBag },
  ];
  const idx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                  done ? "bg-green-600 text-white" : "",
                  active
                    ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                    : "",
                  !done && !active ? "bg-slate-200 text-slate-400" : "",
                ].join(" ")}
              >
                {done ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>
              <span
                className={`text-xs font-bold hidden sm:block ${active ? "text-amber-700" : done ? "text-green-700" : "text-slate-400"}`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-colors duration-300 ${i < idx ? "bg-green-500" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}



// ─── Step 3: Review ───────────────────────────────────────────
function ReviewStep({
  address,
  payment,
  items,
  subtotal,
  shipping,
  tax,
  total,
  discountAmt,
  couponCode,
  onBack,
  onPlace,
}: {
  address: ShippingForm;
  payment: PaymentForm;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discountAmt: number;
  couponCode: string;
  onBack: () => void;
  onPlace: () => Promise<void>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 mb-1">
          Review Your Order
        </h2>
        <p className="text-sm text-slate-400">
          Double-check everything before placing your order.
        </p>
      </div>

      {/* Items */}
      <div className="bg-slate-50 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Items ({items.length})
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {item.productName}
                </p>
                {item.variant && (
                  <p className="text-xs text-slate-400">{item.variant}</p>
                )}
                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-black text-slate-900 shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Address + Payment summary */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <MapPin size={12} /> Ship To
          </p>
          <p className="text-sm font-bold text-slate-900">{address.fullName}</p>
          <p className="text-sm text-slate-600">{address.street}</p>
          <p className="text-sm text-slate-600">
            {address.city}, {address.state} {address.zipCode}
          </p>
          <p className="text-sm text-slate-400 mt-1">{address.phone}</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <CreditCard size={12} /> Payment
          </p>
          {payment.method === "stripe" ? (
            <>
              <p className="text-sm font-bold text-slate-900">
                Stripe (Card)
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Pay with credit / debit card via Stripe
              </p>
            </>
          ) : payment.method === "cod" ? (
            <>
              <p className="text-sm font-bold text-slate-900">
                Cash on Delivery
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Pay when you receive your order
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-slate-900">
                Online Payment
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Pay via SSLCommerz
              </p>
            </>
          )}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        {discountAmt > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1">
              <Tag size={12} /> Coupon ({couponCode})
            </span>
            <span className="font-bold">-${discountAmt.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-600">
          <span>Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Tax (9%)</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-black text-base border-t border-slate-100 pt-2.5 mt-1">
          <span>Total</span>
          <span className="text-amber-700">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
        <Shield size={13} className="text-green-600 shrink-0" />
        Your order is protected by ElectroMart Buyer Protection.
      </div>

      <CheckoutActions total={total} onBack={onBack} onPlace={onPlace} />
    </div>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<ShippingForm | null>(null);
  const [payment, setPayment] = useState<PaymentForm | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmt, setDiscountAmt] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isGuest, setIsGuest] = useState(false);

  const loadCheckoutData = useCallback(async () => {
    const user = (await import('@/utils/auth-storage')).authStorage.getAuthUser();
    const guest = !user;
    setIsGuest(guest);
    try {
      const cartProm = guest ? getGuestCart() : getCart();
      const addrProm = guest ? Promise.resolve({ data: { data: [] } }) : getMyAddresses();
      const [cartRes, addrRes] = await Promise.all([cartProm, addrProm]);
      const cartData = cartRes.data.data;
      setCartItems(mapCartItemsToUi(cartData?.items ?? []));
      setAddresses(mapAddressesToUi(addrRes.data.data ?? []));
      // Sync coupon state from backend — cart is the source of truth
      setCouponCode(cartData?.couponCode ?? "");
      setCouponInput(cartData?.couponCode ?? "");
      setDiscountAmt(cartData?.discountAmount ?? 0);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load checkout"));
      setCartItems([]);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCheckoutData();
  }, [loadCheckoutData]);

  const applyCouponHandler = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponApplying(true);
    try {
      if (isGuest) {
        await applyGuestCartCoupon(code);
      } else {
        await applyCartCoupon(code);
      }
      await loadCheckoutData();
      setCouponError("");
      toast.success("Coupon applied successfully");
    } catch (err) {
      const msg = getApiErrorMessage(err, "Invalid coupon code");
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setCouponApplying(false);
    }
  };

  const removeCheckoutCoupon = async () => {
    try {
      if (isGuest) {
        await removeGuestCartCoupon();
      } else {
        await removeCartCoupon();
      }
      await loadCheckoutData();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to remove coupon"));
    }
  };

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 99 ? 0 : 14.99;
  const tax = Math.max(0, (subtotal - discountAmt) * 0.09);
  const total = subtotal - discountAmt + shipping + tax;

  const [guestInfo, setGuestInfo] = useState({
    guestEmail: "",
    guestName: "",
    guestPhone: "",
  });

  const handlePlaceOrder = async () => {
    if (!address || !payment) return;
    try {
      let orderRes;
      if (isGuest) {
        if (!guestInfo.guestEmail || !guestInfo.guestName || !guestInfo.guestPhone) {
          toast.error("Please fill in your contact information");
          return;
        }
        orderRes = await placeGuestOrder({
          guestEmail: guestInfo.guestEmail,
          guestName: guestInfo.guestName,
          guestPhone: guestInfo.guestPhone,
          shippingAddress: {
            fullName: address.fullName,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
          },
          couponCode: couponCode || undefined,
        });
      } else {
        orderRes = await placeOrder(
          {
            fullName: address.fullName,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
          },
          couponCode || undefined,
        );
      }
      const order = orderRes.data.data;
      if (!order?.id) throw new Error("Order not created");
      notifyCartUpdated();

      if (payment.method === "cod") {
        router.push(`/order-confirmation/${order.id}`);
        return;
      }

      const gateway = payment.method === "stripe" ? "STRIPE" : "SSLCOMMERZ";
      const payRes = isGuest
        ? await initiateGuestPayment({
            orderId: order.id,
            gateway,
          })
        : await initiatePayment({
            orderId: order.id,
            gateway,
          });
      const gatewayUrl = payRes.data.data?.gatewayUrl as string | undefined;
      if (gatewayUrl) {
        window.location.href = gatewayUrl;
        return;
      }
      // If no gateway URL (payment already processed), redirect to order confirmation
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to place order"));
      // Clear the coupon so the user can retry without stale state
      setCouponCode("");
      setCouponInput("");
      setDiscountAmt(0);
    }
  };

  if (loading) {
    return (
      <motion.div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
        <p className="text-slate-500 font-medium">Loading checkout...</p>
      </motion.div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div className="min-h-screen bg-[#FFFBEB] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-slate-600 font-semibold">Your cart is empty</p>
        <Link
          href="/cart"
          className="text-amber-600 font-bold hover:text-amber-700"
        >
          Back to cart
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={11} />
            <Link
              href="/cart"
              className="hover:text-amber-600 transition-colors"
            >
              Cart
            </Link>
            <ChevronRight size={11} />
            <span className="text-slate-700 font-semibold capitalize">
              Checkout
            </span>
          </div>
          <h1
            className="text-2xl font-black text-slate-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <StepIndicator current={step} />

        <div className="grid lg:grid-cols-5 gap-8">
          {/* ── Form area ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }}
                >
                  {step === "address" && (
                    <>
                      <GuestCheckoutSection
                        isGuest={isGuest}
                        guestInfo={guestInfo}
                        setGuestInfo={setGuestInfo}
                      />
                      <ShippingAddressSection
                        addresses={addresses}
                        onAddressCreated={loadCheckoutData}
                        isGuest={isGuest}
                        onNext={(data) => {
                          setAddress(data);
                          setStep("payment");
                        }}
                      />
                    </>
                  )}
                  {step === "payment" && (
                    <PaymentMethodSection
                      onNext={(data) => {
                        setPayment(data);
                        setStep("review");
                      }}
                      onBack={() => setStep("address")}
                    />
                  )}
                  {step === "review" && address && payment && (
                    <ReviewStep
                      address={address}
                      payment={payment}
                      items={cartItems}
                      subtotal={subtotal}
                      shipping={shipping}
                      tax={tax}
                      total={total}
                      discountAmt={discountAmt}
                      couponCode={couponCode}
                      onBack={() => setStep("payment")}
                      onPlace={handlePlaceOrder}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Mini order summary (sticky) ── */}
          <div className="lg:col-span-2">
            <OrderSummarySection
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              discountAmt={discountAmt}
              couponCode={couponCode}
            />
            <div className="mt-4">
              <CouponSection
                couponCode={couponCode}
                couponInput={couponInput}
                couponError={couponError}
                couponApplying={couponApplying}
                discountAmt={discountAmt}
                onApply={applyCouponHandler}
                onRemove={removeCheckoutCoupon}
                onInputChange={(value) => {
                  setCouponInput(value.toUpperCase());
                  setCouponError("");
                }}
                onKeyDown={() => applyCouponHandler()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
