import { metadata } from "@/app/metadata";
import Layout from "@/layout";
import "@/assets/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Web3Provider } from "@/providers/AppProviders";
export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-mono">
        <main>
          <Web3Provider>
            <Layout>{children}</Layout>
          </Web3Provider>
        </main>
      </body>
    </html>
  );
}
