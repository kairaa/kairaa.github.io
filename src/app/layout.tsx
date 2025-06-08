import Script from "next/script";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./_contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://kaira.me'),
  title: {
    template: "%s | Kaira",
    default: "Kaira - Developer & Tech Enthusiast"
  },
  description: "Personal blog and portfolio of Kaira - sharing insights on technology, programming, and software development.",
  keywords: ["kaira", "blog", "programming", "technology", "software development", "web development"],
  authors: [{ name: "Kaira" }],
  creator: "Kaira",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kaira.me",
    siteName: "Kaira",
    title: "Kaira - Developer & Tech Enthusiast",
    description: "Personal blog and portfolio of Kaira - sharing insights on technology, programming, and software development.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaira - Developer & Tech Enthusiast",
    description: "Personal blog and portfolio of Kaira - sharing insights on technology, programming, and software development.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-9TGQ04LM6Q"></Script>
        <Script id="google-analytics">
          {
            `
            window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-9TGQ04LM6Q');
            `
          }
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
