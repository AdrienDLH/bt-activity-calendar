import type { Metadata } from "next";

const TITLE = "Elevating Banyan Tree | AWS 2026";
const DESCRIPTION =
  "Elevating Banyan Tree AWS 2026 — June 7–10, Banyan Tree Zhuhai Phoenix Bay. Agenda, venue information and seating.";

export const metadata: Metadata = {
  // Makes the relative og:image resolve to an absolute URL on the event domain.
  metadataBase: new URL("https://aws2026.banyantree.com"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: "https://aws2026.banyantree.com",
    siteName: "Elevating Banyan Tree AWS 2026",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/aws/opengraph.jpg", // 1200×630, served from /public/aws
        width: 1200,
        height: 630,
        alt: "Elevating Banyan Tree — AWS 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/aws/opengraph.jpg"],
  },
};

export default function AwsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
