import AdminProfileClient from "./Profileclient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile — Admin Dashboard" };

export default function AdminProfilePage() {
  return <AdminProfileClient />;
}
