import { Suspense, type ReactNode } from 'react';
import TopBar from './TopBar';
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Suspense fallback={null}>

      <MainNavbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <MainFooter />
    </div>
  );
}