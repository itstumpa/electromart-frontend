import { Metadata } from "next";
import VendorReturnsClient from "./VendorReturnsClient";

export const metadata: Metadata = {
  title: "Return Requests — Vendor Dashboard",
};

export default function VendorReturnsPage() {
  return <VendorReturnsClient />;
}
