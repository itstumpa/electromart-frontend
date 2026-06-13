import { Metadata } from "next";
import TagsClient from "./TagsClient";

export const metadata: Metadata = {
  title: "Product Tags — ElectroMart",
  description: "Browse products by tags",
};

export default function TagsPage() {
  return <TagsClient />;
}
