import { Metadata } from "next";
import ReturnDetailClient from "./ReturnDetailClient";

export const metadata: Metadata = {
  title: "Return Details — ElectroMart",
};

export default function ReturnDetailPage() {
  return <ReturnDetailClient />;
}
