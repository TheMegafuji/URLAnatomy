import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { ThemeToggle } from '@/components/theme-toggle';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://urlanatomy.com';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for URL Anatomy: data security, local processing, cookies, Google AdSense, and your rights under GDPR and CCPA.',
  openGraph: {
    title: 'Privacy Policy | URL Anatomy',
    url: `${siteUrl}/privacy`,
  },
  alternates: { canonical: `${siteUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4 w-full max-w-7xl mx-auto justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold shrink-0 text-foreground hover:underline underline-offset-4">
            ← URL Anatomy
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy for URL Anatomy</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: January 31, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground">
          <p>
            At URL Anatomy, accessible from {siteUrl}, one of our main priorities is the privacy of
            our visitors. This Privacy Policy document describes the types of information that is
            collected and recorded by URL Anatomy and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy,
            do not hesitate to contact us.
          </p>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">
              1. Data Security & Local Processing (Client-Side Only)
            </h2>
            <p className="mb-2">
              <strong>We prioritize your data security.</strong> URL Anatomy is designed as a
              client-side application.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>No Server Storage:</strong> The URLs, tokens, keys, and parameters you paste
                into URL Anatomy are processed <strong>exclusively within your web browser</strong>{' '}
                using JavaScript.
              </li>
              <li>
                <strong>No Data Transmission:</strong> We do not transmit your input data to our
                servers or any third-party storage.
              </li>
              <li>
                <strong>Zero Logs of Content:</strong> We do not log, save, or view the contents of
                the URLs you analyze.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. Log Files</h2>
            <p>
              URL Anatomy follows a standard procedure of using log files. These files log visitors
              when they visit the website. All hosting companies do this as part of hosting
              services&apos; analytics. The information collected by log files includes internet
              protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time
              stamp, referring/exit pages, and possibly the number of clicks. These are not linked
              to any information that is personally identifiable. The purpose of the information is
              for analyzing trends, administering the site, tracking users&apos; movement on the
              website, and gathering demographic information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. Cookies and Web Beacons</h2>
            <p>
              Like any other website, URL Anatomy uses &quot;cookies&quot;. These cookies are used to
              store information including visitors&apos; preferences and the pages on the website
              that the visitor accessed or visited. The information is used to optimize the
              users&apos; experience by customizing our web page content based on visitors&apos;
              browser type and/or other information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. Google AdSense & DoubleClick DART Cookie</h2>
            <p>
              Google is a third-party vendor on our site. It also uses cookies, known as DART
              cookies, to serve ads to our site visitors based upon their visit to {siteUrl} and
              other sites on the internet. However, visitors may choose to decline the use of DART
              cookies by visiting the Google ad and content network Privacy Policy at the following
              URL:{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                https://policies.google.com/technologies/ads
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. Advertising Partners Privacy Policies</h2>
            <p className="mb-2">
              You may consult this list to find the Privacy Policy for each of the advertising
              partners of URL Anatomy.
            </p>
            <p>
              Third-party ad servers or ad networks use technologies like cookies, JavaScript, or
              Web Beacons in their respective advertisements and links that appear on URL Anatomy,
              which are sent directly to users&apos; browsers. They automatically receive your IP
              address when this occurs. These technologies are used to measure the effectiveness of
              their advertising campaigns and/or to personalize the advertising content that you see
              on websites that you visit.
            </p>
            <p>
              Note that URL Anatomy has no access to or control over these cookies that are used by
              third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. Third Party Privacy Policies</h2>
            <p>
              URL Anatomy&apos;s Privacy Policy does not apply to other advertisers or websites.
              Thus, we advise you to consult the respective Privacy Policies of these third-party
              ad servers for more detailed information. It may include their practices and
              instructions about how to opt-out of certain options.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">7. GDPR & CCPA Rights (Data Protection)</h2>
            <p>
              Since URL Anatomy does not collect or store personal data from your inputs (URLs), we
              do not hold user accounts or personal databases. However, users maintain full rights
              over their navigation data as per standard international laws. If you wish to disable
              cookies, you may do so through your individual browser options.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">8. Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to our Terms
              of Use.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
