/**
 * WECHAT DOWNLOAD BUTTONS
 *
 * A small shared block of two store-download buttons (Apple App Store +
 * Google Play). Used on both the WeChat guide (/aws/wechat) and the Time &
 * Place page so the links stay in sync. Reuses the shared bronze `Button`
 * (filled default variant) per the Banyan Tree design system — no bespoke styles.
 *
 * Store URLs live in WECHAT_GUIDE.downloads (src/lib/event-data.ts).
 */
import { IconBrandApple, IconBrandGooglePlay } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { WECHAT_GUIDE } from "@/lib/event-data";

export function WechatDownload({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* Two equal buttons; stack on the smallest screens, side-by-side on sm+ */}
      <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row">
        <Button asChild>
          <a href={WECHAT_GUIDE.downloads.ios} target="_blank" rel="noopener noreferrer">
            <IconBrandApple aria-hidden />
            App Store
          </a>
        </Button>
        <Button asChild>
          <a href={WECHAT_GUIDE.downloads.android} target="_blank" rel="noopener noreferrer">
            <IconBrandGooglePlay aria-hidden />
            Google Play
          </a>
        </Button>
      </div>
    </div>
  );
}
