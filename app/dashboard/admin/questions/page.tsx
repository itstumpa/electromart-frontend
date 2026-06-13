import { Metadata } from "next";
import AdminQuestionsClient from "./AdminQuestionsClient";

export const metadata: Metadata = {
  title: "Product Questions — Admin Dashboard",
};

export default function AdminQuestionsPage() {
  return <AdminQuestionsClient />;
}
