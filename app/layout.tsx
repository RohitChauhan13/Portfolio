import type { Metadata } from "next";
import { Toaster } from "sonner";
import { InspectProtection } from "@/components/inspect-protection";
import { getSiteSettings } from "@/lib/data";
import { defaultDescription, defaultKeywords, siteName } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  applicationName: siteName,
  title: {
    default: "Rohit Chauhan | React Native and Full Stack Developer",
    template: "%s | Rohit Chauhan"
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  authors: [{ name: "Rohit Chauhan" }],
  creator: "Rohit Chauhan",
  publisher: "Rohit Chauhan",
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: "Rohit Chauhan | React Native and Full Stack Developer",
    description: defaultDescription,
    url: absoluteUrl("/"),
    siteName,
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohit Chauhan | React Native and Full Stack Developer",
    description: defaultDescription
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: "/favicon.svg"
  }
};

const setInitialTheme = `(function(){try{const theme=localStorage.getItem('theme'); if(theme==='dark' || theme==='light'){document.documentElement.dataset.theme=theme; return;} if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.dataset.theme='dark';}}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        <InspectProtection enabled={settings.inspectProtectionEnabled} />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
