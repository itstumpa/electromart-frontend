import { Metadata } from "next";
import TagProductsClient from "./TagProductsClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Tag: ${slug.replace(/-/g, " ")} — ElectroMart`,
    description: `Products tagged with ${slug.replace(/-/g, " ")}`,
  };
}

export default function TagProductsPage({ params }: Props) {
  return <TagProductsClient slug={params} />;
}
