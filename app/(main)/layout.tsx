import { Suspense, type ReactNode } from "react";
import { Toaster } from "sonner";
import MainFooter from "./MainFooter";
import MainNavbar from "./MainNavbar";
import TopBar from "./TopBar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Suspense fallback={null}>
        <Toaster richColors position="top-right" />

        <MainNavbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <MainFooter />
    </div>
  );
}
