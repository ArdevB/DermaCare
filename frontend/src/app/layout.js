import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ShopProvider } from "@/hooks/useShop";
config.autoAddCss = false;

export const metadata = {
  title: "DermaCare",
  description: "Ecommerce website",
  keywords: "online shopping, ecommerce, buy and sell",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <ShopProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ShopProvider>
      </body>
    </html>
  );
}
