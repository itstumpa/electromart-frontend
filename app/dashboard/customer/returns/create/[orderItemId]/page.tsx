import { Metadata } from "next";
import CreateReturnClient from "./CreateReturnClient";

export const metadata: Metadata = {
  title: "Request Return — ElectroMart",
};

export default function CreateReturnPage() {
  return <CreateReturnClient />;
}
