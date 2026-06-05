import Link from 'next/link';
import { Scale, ArrowLeft } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using ElectroMart's platform, website, or mobile application, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. These terms apply to all visitors, users, vendors, and others who access or use the service.`,
  },
  {
    title: '2. User Accounts',
    content: `To access certain features of ElectroMart, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. ElectroMart reserves the right to terminate accounts, remove content, or cancel orders at its sole discretion.`,
  },
  {
    title: '3. Vendor Obligations',
    content: `Vendors on ElectroMart must provide accurate product listings, honor confirmed orders, and maintain a professional standard of service. Vendor accounts are subject to approval and may be suspended or terminated for violations including misrepresentation of products, failure to fulfill orders, fraudulent activity, or repeated poor customer feedback. Vendors are solely responsible for the products they list and sell.`,
  },
  {
    title: '4. Purchases & Payments',
    content: `All purchases made through ElectroMart are subject to product availability and confirmation of the order price. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase, inaccuracies in product or pricing information, or problems identified by our fraud avoidance team. Payment must be received prior to the acceptance of an order.`,
  },
  {
    title: '5. Returns & Refunds',
    content: `ElectroMart operates a buyer protection policy. Customers may request a return or refund within 14 days of delivery if the item is defective, damaged, or significantly not as described. Refunds are processed within 5–10 business days after the return is approved. Certain products such as opened software, digital downloads, and hygiene-sensitive items are non-returnable unless defective.`,
  },
  {
    title: '6. Prohibited Activities',
    content: `Users may not engage in any activity that interferes with or disrupts ElectroMart services, use the platform for any unlawful purpose, attempt to gain unauthorized access to any portion of the platform, upload malicious code or harmful content, engage in fraudulent transactions, or use automated tools to scrape or collect data from our platform without express written permission.`,
  },
  {
    title: '7. Intellectual Property',
    content: `The ElectroMart name, logo, and all related content, features, and functionality are owned by ElectroMart and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without explicit written permission. Product images and descriptions provided by vendors remain the intellectual property of their respective owners.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `ElectroMart shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of our services. We do not warrant that the platform will be uninterrupted or error-free. Our total liability to you for any claim arising from these terms or your use of the platform shall not exceed the amount paid by you in the six months preceding the claim.`,
  },
  {
    title: '9. Changes to Terms',
    content: `ElectroMart reserves the right to modify these Terms of Service at any time. We will provide notice of significant changes by updating the date at the top of this page and, where appropriate, notifying you by email. Your continued use of the platform after any changes constitutes your acceptance of the new terms.`,
  },
  {
    title: '10. Governing Law',
    content: `These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.`,
  },
];

export default function TermsPage() {
  const lastUpdated = 'June 1, 2026';

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-amber-600 transition-colors mb-6"
          >
            <ArrowLeft size={15} />
            Back to ElectroMart
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
              <Scale size={22} className="text-amber-700" />
            </div>
            <div>
              <h1
                className="text-3xl sm:text-4xl font-black text-slate-900"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Terms of Service
              </h1>
              <p className="text-sm text-slate-400 mt-1.5">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sidebar TOC — desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 bg-white rounded-2xl border border-slate-100 p-5">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Contents
              </p>
              <nav className="space-y-2">
                {SECTIONS.map((s) => (
                  <a
                    key={s.title}
                    href={`#${s.title.replace(/\s+/g, '-').toLowerCase()}`}
                    className="block text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors leading-snug py-0.5"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Intro */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-sm text-amber-800 font-medium leading-relaxed">
                Please read these Terms of Service carefully before using ElectroMart. By creating an account or making a purchase, you agree to be legally bound by these terms.
              </p>
            </div>

            {/* Sections */}
            {SECTIONS.map((section) => (
              <div
                key={section.title}
                id={section.title.replace(/\s+/g, '-').toLowerCase()}
                className="bg-white rounded-2xl border border-slate-100 p-6"
              >
                <h2
                  className="text-lg font-black text-slate-900 mb-3"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {section.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}

            {/* Footer note */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
              <p className="text-sm text-slate-500">
                Have questions about our terms?{' '}
                <Link href="/contact" className="text-amber-600 font-bold hover:underline">
                  Contact us
                </Link>
                {' '}or email{' '}
                <a href="mailto:legal@electromart.com" className="text-amber-600 font-bold hover:underline">
                  legal@electromart.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}