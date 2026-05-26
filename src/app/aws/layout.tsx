import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elevating Banyan Tree | AWS 2026",
  description:
    "Elevating Banyan Tree AWS 2026 — June 7–10, Banyan Tree Zhuhai Phoenix Bay. Agenda, venue information and seating.",
};

export default function AwsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
