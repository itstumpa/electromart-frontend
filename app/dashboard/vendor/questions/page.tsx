import { Metadata } from "next";
import VendorQuestionsClient from "./VendorQuestionsClient";

export const metadata: Metadata = {
  title: "Product Questions — Vendor Dashboard",
};

export default function VendorQuestionsPage() {
  return <VendorQuestionsClient />;
}
