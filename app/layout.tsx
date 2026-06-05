import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { baseUrl, createMetadata } from "@/lib/metadata";
import { source } from "@/lib/source";
import "./global.css";

export const metadata: Metadata = createMetadata({
  title: {
    template: "%s | Cube AI",
    default: "Cube AI Docs",
  },
  description:
    "Documentation for Cube AI, the secure LLM and confidential AI platform from Ultraviolet.",
  metadataBase: new URL(baseUrl),
  openGraph: { url: baseUrl },
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-background text-foreground font-body">
        <RootProvider>
          <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
