import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us when you create an account, make a purchase, or contact our support team. This includes your name, email address, shipping address, phone number, and payment information. We also automatically collect certain technical information when you use our platform, including your IP address, browser type, device identifiers, and usage data such as pages visited and actions taken.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `ElectroMart uses your information to process and fulfill your orders, send order confirmations and shipping updates, provide customer support, personalize your shopping experience, send promotional communications (with your consent), detect and prevent fraud, improve our platform and services, and comply with legal obligations. We do not sell your personal information to third parties.`,
  },
  {
    title: "3. Information Sharing",
    content: `We share your information only as necessary to operate our platform. This includes sharing with vendors to fulfill your orders (name, shipping address, and order details only), payment processors to handle transactions securely, logistics partners to deliver your purchases, and service providers who assist with our operations under strict confidentiality agreements. We may also disclose information when required by law or to protect the rights and safety of ElectroMart and its users.`,
  },
  {
    title: "4. Cookies & Tracking",
    content: `ElectroMart uses cookies and similar tracking technologies to maintain your session, remember your preferences, analyze usage patterns, and deliver relevant content. You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of the platform. We use analytics tools to understand how users interact with our services, and this data is aggregated and anonymized wherever possible.`,
  },
  {
    title: "5. Data Security",
    content: `We implement industry-standard security measures to protect your personal information, including encryption of data in transit and at rest, secure payment processing (we never store raw card data), access controls and authentication requirements, regular security assessments, and monitoring for suspicious activity. While we take every reasonable precaution, no method of transmission over the internet is 100% secure. We encourage you to use strong, unique passwords for your account.`,
  },
  {
    title: "6. Data Retention",
    content: `We retain your personal information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law or legitimate business interests such as fraud prevention and financial record-keeping.`,
  },
  {
    title: "7. Your Rights",
    content: `Depending on your location, you may have the right to access the personal information we hold about you, request correction of inaccurate data, request deletion of your personal data, object to or restrict certain processing of your data, and request a portable copy of your data. To exercise any of these rights, please contact us at privacy@electromart.com. We will respond to your request within 30 days.`,
  },
  {
    title: "8. Children's Privacy",
    content: `ElectroMart is not directed to children under the age of 13, and we do not knowingly collect personal information from children. If we become aware that a child under 13 has provided us with personal information, we will delete such information immediately. If you believe we have inadvertently collected information from a child, please contact us promptly.`,
  },
  {
    title: "9. Third-Party Links",
    content: `Our platform may contain links to third-party websites or services that are not operated by ElectroMart. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites. We encourage you to review the privacy policy of every site you visit. Vendor storefronts on our platform are subject to their own privacy practices in addition to ours.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page and updating the date below. For significant changes, we may also notify you by email. Your continued use of ElectroMart after any changes constitutes your acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
  const lastUpdated = "June 1, 2026";

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
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
              <Shield size={22} className="text-green-700" />
            </div>
            <div>
              <h1
                className="text-3xl sm:text-4xl font-black text-slate-900"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Privacy Policy
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
                    href={`#${s.title.replace(/\s+/g, "-").toLowerCase()}`}
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
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-sm text-green-800 font-medium leading-relaxed">
                Your privacy matters to us. This policy explains what
                information we collect, how we use it, and the choices you have
                regarding your data. We are committed to protecting your
                personal information.
              </p>
            </div>

            {/* Sections */}
            {SECTIONS.map((section) => (
              <div
                key={section.title}
                id={section.title.replace(/\s+/g, "-").toLowerCase()}
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
                Questions about your privacy?{" "}
                <Link
                  href="/contact"
                  className="text-amber-600 font-bold hover:underline"
                >
                  Contact us
                </Link>{" "}
                or email{" "}
                <a
                  href="mailto:privacy@electromart.com"
                  className="text-amber-600 font-bold hover:underline"
                >
                  privacy@electromart.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
