import { Metadata } from "next";
import ReturnsClient from "./ReturnsClient";

export const metadata: Metadata = {
  title: "My Returns — ElectroMart",
};

export default function ReturnsPage() {
  return <ReturnsClient />;
}
