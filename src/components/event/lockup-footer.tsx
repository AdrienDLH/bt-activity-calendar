/**
 * LOCKUP FOOTER
 *
 * The "Elevating Banyan Tree / AWS 2026" lockup, rendered in the deep brand
 * green on the cream canvas (no watercolor wash).
 *
 * The source SVG (/public/bt-aws-lockup.svg) is white artwork, so we paint it
 * with a CSS mask: the SVG defines the shape, `bg-[#153E35]` gives the colour.
 * This keeps it crisp at any size and lets the colour be changed in one place.
 *
 * Sizing: ~30% smaller than the original lockup (w-32 / sm:w-36).
 */
const MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage: "url(/bt-aws-lockup.svg)",
  maskImage: "url(/bt-aws-lockup.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
};

export function LockupFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`flex shrink-0 justify-center px-6 py-7 ${className}`}
      aria-label="Elevating Banyan Tree — AWS 2026"
    >
      {/* aspect ratio matches the SVG viewBox (341×139) */}
      <div
        role="img"
        aria-label="Elevating Banyan Tree — AWS 2026"
        className="aspect-[341/139] w-32 bg-[#153E35] sm:w-36"
        style={MASK_STYLE}
      />
    </footer>
  );
}
