/**
 * EVENT DATA — Elevating Banyan Tree AWS 2026
 *
 * Single source of truth for the event microsite content. All copy here was
 * transcribed from the original (image-only) micecube event pages so the rebuilt
 * site is fully text-based, responsive and editable.
 *
 * FOR THE DESIGNER / EDITOR:
 * - To change any session, simply edit the strings below — no layout code to touch.
 * - `details` is a list of secondary lines shown under the session title.
 * - `dressCode` (optional) renders as a highlighted "Dress code:" line.
 * - The agenda is keyed by ROLE (gm / dosm / rm) then by DAY. Days 7, 8 and 10 are
 *   identical across roles, so they are shared via `SHARED_*` constants; only Day 2
 *   (June 9) differs per role.
 */

export const EVENT = {
  title: "Elevating Banyan Tree",
  subtitle: "AWS 2026",
  dateText: "June 7–10",
  locationText: "Zhuhai, China",
  // The Photo Live-Stream still points to the external album (Chinese host).
  liveStreamUrl: "https://live.pailixiang.com/album/a12480808767",
} as const;

/* ------------------------------------------------------------------ */
/* TIME & PLACE                                                        */
/* ------------------------------------------------------------------ */

export const TIME_AND_PLACE = {
  welcomeKicker: "Welcome to",
  welcomeTitle: "Banyan Tree Zhuhai Phoenix Bay",
  intro: [
    "We are delighted to host you for the 2026 Elevating Banyan Tree AWS from 7 to 10 June.",
    "Prepare for a cohesive fusion of productive meetings, inspiring events, and meaningful reconnection — paced by the light, tide, and quiet of Phoenix Bay.",
    "We look forward to welcoming you to our Sanctuary for the Senses.",
  ],
  about: {
    title: "About Zhuhai Phoenix Bay",
    body: "Immersed in the vibrant heritage of South China, beside the pristine waters along the South Sea coast, Zhuhai Phoenix Bay — situated a 50-minute drive from Macau and a 1.5-hour drive from Shenzhen — is a hidden pearl celebrated for its serene atmosphere, profound culture and stunning landscapes.",
  },
  // Two-column "General Information" grid.
  info: [
    {
      title: "Airport & Train Station",
      lines: [
        "Macao International Airport: 25km",
        "Hongkong International Airport: 75km",
        "Zhuhai Jinwan Airport: 55km",
        "Shenzhen International Airport: 80km",
        "Mingzhu Station: 13km",
        "Zhuhai North Station: 15km",
        "Zhuhai Station: 18km",
      ],
    },
    {
      title: "Weather",
      lines: [
        "In June, the weather in Zhuhai is hot, humid and rainy.",
        "Average high: 31°C — Average low: 26°C",
      ],
    },
    {
      title: "What to pack",
      lines: [
        "Leisure clothes, comfortable shoes, smart-casual attire for evening events. For the dinner on the final night on 9 June, a special Chinese season-inspired vest will be provided.",
      ],
    },
    {
      title: "Time Zone during June",
      lines: ["China Standard Time (CST) all year round — UTC+8"],
    },
    {
      title: "Communication",
      lines: ["China country code +86"],
    },
    {
      title: "Currency",
      lines: ["Chinese Yuan CNY"],
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* AGENDA                                                              */
/* ------------------------------------------------------------------ */

export interface Session {
  time: string;
  title: string;
  details?: string[];
  /**
   * Optional "Thought Starter" — a short reflective prompt shown under the
   * session (Column D of the source agenda). Rendered as a bronze-accented
   * callout in the agenda timeline.
   */
  description?: string;
  dressCode?: string;
  venue: string;
}

export interface DayAgenda {
  /** URL-friendly id, e.g. "jun-7" */
  id: string;
  /** Short label for the day tab, e.g. "Jun 7" */
  tab: string;
  /** Weekday under the tab, e.g. "Sunday" */
  weekday: string;
  /** Pill shown next to the date, e.g. "Arrival Day" / "Day 1" */
  dayLabel: string;
  /** Full date heading, e.g. "07 June Sunday" */
  date: string;
  /** Optional daily theme, e.g. "Leadership in the Making" */
  theme?: string;
  sessions: Session[];
}

export type RoleId = "gm" | "dosm" | "rm";

export const ROLES: { id: RoleId; label: string; full: string }[] = [
  { id: "gm", label: "GM", full: "General Manager" },
  { id: "dosm", label: "DOSM", full: "Director of Sales & Marketing" },
  { id: "rm", label: "RM", full: "Revenue Manager" },
];

const COFFEE = "Coffee Break — The Rhythm of Seasons";
const CULINARY_FESTIVAL: Session = {
  time: "19:00–22:00",
  title: "A Culinary Festival — The Rhythm of Seasons",
  details: [
    "Dress code: a Chinese season inspired vest will be provided. Wear neutral monotone colours such as all white, black or beige",
  ],
  venue: "Bridge Floating Platforms",
};

/* --- Arrival Day (June 7) — shared across all roles --- */
const DAY_ARRIVAL: DayAgenda = {
  id: "jun-7",
  tab: "Jun 7",
  weekday: "Sunday",
  dayLabel: "Arrival Day",
  date: "07 June Sunday",
  sessions: [
    {
      time: "18:15–20:30",
      title: "Welcome Reception",
      details: ["Showcase of Remedy Bar, YueZui, JiaYao and Saffron"],
      dressCode: "Smart casual",
      venue: "BANG Bar",
    },
  ],
};

/* --- Day 1 (June 8) — shared across all roles --- */
const DAY_ONE: DayAgenda = {
  id: "jun-8",
  tab: "Jun 8",
  weekday: "Monday",
  dayLabel: "Day 1",
  date: "08 June Monday",
  theme: "Leadership in the Making",
  sessions: [
    {
      time: "6:30–8:30",
      title: "Breakfast 2.0",
      details: ["At own leisure"],
      venue: "RONG Dim Sum Restaurant",
    },
    {
      time: "7:15–8:00",
      title: "Morning Activity (Optional)",
      details: ["Taiji Ba Duan Jin by Vivian Ni"],
      venue: "6F Lawn",
    },
    { time: "8:45–9:00", title: "Arrival", venue: "Phoenix Ballroom" },
    { time: "9:00–9:10", title: "Welcome Address", venue: "Phoenix Ballroom" },
    {
      time: "9:15–10:45",
      title: "Signals from the Field: What's Working, What's Not",
      details: ["Playback on survey, listening circles and shareback"],
      description:
        "A commitment to two-way accountability between the field and the corporate / regional support layers. Forward-facing session to identify what we need to start, stop and continue across our global functions.",
      venue: "Phoenix Ballroom",
    },
    { time: "10:45–11:00", title: COFFEE, venue: "Phoenix Ballroom" },
    {
      time: "11:00–12:30",
      title: "Competency: How we Lead in Complexity",
      details: [
        "Playback of 360 survey and workshop on elevating our strategic agility and use of data intelligence",
      ],
      description:
        "As leaders, it is challenging to make sense and take better decisions in a world which is more and more Volatile, Uncertain, Complex and Ambiguous. How you use data as a leverage is part of the answer: are you and your team data-driven yet?",
      venue: "Phoenix Ballroom",
    },
    {
      time: "12:30–13:30",
      title: "Bento Lunch",
      details: ["Reenergising activity"],
      venue: "Ballroom Foyer / Garden / Lobby Lounge",
    },
    {
      time: "13:30–15:00",
      title: "Culture: How we Lead the Banyan Tree Way",
      details: [
        "Playback of 360 survey and workshop on linking team culture and the guest experience",
      ],
      description:
        "Top leaders bring together People & Culture and Guest Impact into a single symbiotic capability. Not two skills. One capability, expressed in two domains. How will we co-shape the way we lead The Banyan Tree Way? 3 case studies to be shared with participants to pre-read before the discussion during the session.",
      venue: "Phoenix Ballroom",
    },
    { time: "15:00–15:15", title: COFFEE, venue: "Phoenix Ballroom" },
    {
      time: "15:15–17:15",
      title: "Visions from the Field: The Future of Banyan Tree",
      details: ["GM & DOSM team presentations, and sharing from all"],
      description:
        "In 2030, what will Banyan Tree mean to a guest that no other brand can offer? What does your property need to become to deliver that? Come prepared to co-create the future of our brand together.",
      venue: "Phoenix Ballroom",
    },
    { time: "17:15–17:30", title: "Group Photo Session", venue: "Phoenix Ballroom" },
    {
      time: "18:15–20:30",
      title: "Beach BBQ Feast",
      details: ["Showcase of Chinese, Western and Thai Flavours + Battle of the Remedies"],
      dressCode: "Floral-inspired beachwear",
      venue: "East Beach",
    },
  ],
};

/* --- Day 3 (June 10) — shared across all roles --- */
const DAY_THREE: DayAgenda = {
  id: "jun-10",
  tab: "Jun 10",
  weekday: "Wednesday",
  dayLabel: "Day 3",
  date: "10 June Wednesday",
  theme: "From Vision to Action",
  sessions: [
    {
      time: "6:30–8:30",
      title: "Breakfast 2.0",
      details: ["At own leisure"],
      venue: "Phoenix Ballroom",
    },
    { time: "8:30–9:00", title: "Arrival", venue: "Phoenix Ballroom" },
    {
      time: "9:00–9:45",
      title: "Founders Fireside",
      details: ["Panel + Q&A"],
      description:
        "An intimate session with our Founders. What would you like to learn about Banyan Group?",
      venue: "Phoenix Ballroom",
    },
    { time: "9:45–10:45", title: COFFEE, venue: "Phoenix Ballroom" },
    {
      time: "10:45–12:15",
      title: "Leadership Commitments",
      details: [
        "Individual and group work to solidify insights, lock in commitments and unlock resources",
      ],
      description:
        "Following 2.5 days of engagement, learning, collaboration and alignment — this is the moment to move from insight to intention, and from intention to action. The brand does not transform in meetings. It transforms through the daily choices of us as its leaders.",
      venue: "Phoenix Ballroom",
    },
    {
      time: "12:15–12:30",
      title: "Reflections & Closing Session",
      venue: "Phoenix Ballroom",
    },
  ],
};

/* --- Day 2 (June 9) — common morning shared by every role --- */
const DAY_TWO_META = {
  id: "jun-9",
  tab: "Jun 9",
  weekday: "Tuesday",
  dayLabel: "Day 2",
  date: "09 June Tuesday",
  theme: "Designing for the Future",
} as const;

const DAY_TWO_MORNING: Session[] = [
  {
    time: "6:30–8:30",
    title: "Breakfast 2.0",
    details: ["At own leisure"],
    venue: "RONG Dim Sum Restaurant",
  },
  {
    time: "7:15–8:00",
    title: "Morning Activity (Optional)",
    details: ["WingChen Chinese Martial Arts by Max Zhu"],
    venue: "H3 Lawn",
  },
  { time: "8:45–9:00", title: "Arrival", venue: "Phoenix Ballroom" },
  {
    time: "9:00–10:30",
    title: "Desire by Design: Shaping Marketing Experiences for the Banyan Tree Guests",
    details: ["Define your ideal guests and shape an experience-led pricing strategy"],
    description:
      "The guest standing at your door today is not the same person who stood there five years ago. What has changed about what they need, what they expect, and what they are willing to pay for? And what does your property need to change, preserve, or reimagine to stay relevant to them for the next decade?",
    venue: "Phoenix Ballroom",
  },
  {
    time: "10:30–11:00",
    title: "Keynote: Navigating the New Era of Luxury Travel in Greater China",
    details: ["Speaker Ms. Irene Lee, GM Virtuoso China"],
    description:
      "Learn about the landscape of luxury travel in Greater China and take this opportunity to ask questions of one of our most important partners.",
    venue: "Phoenix Ballroom",
  },
  { time: "11:00–11:15", title: COFFEE, venue: "Phoenix Ballroom" },
];

const DAY_TWO_GM: DayAgenda = {
  ...DAY_TWO_META,
  sessions: [
    ...DAY_TWO_MORNING,
    {
      time: "11:15–12:30",
      title: "Experience by Design: Shaping Signature Guest Moments",
      details: ["Design meaningful guest moments that build emotional connection"],
      venue: "Phoenix Ballroom",
    },
    {
      time: "12:30–14:00",
      title: "Bento Lunch & Gallery Showcase",
      details: ["Reenergising Activity"],
      venue: "Ballroom Foyer / Garden / Lobby Lounge",
    },
    {
      time: "14:00–15:30",
      title: "Place by Design: Shaping Signature Spaces & Elements",
      details: ["Our new signature spaces and design elements"],
      venue: "Phoenix Ballroom",
    },
    { time: "15:30–16:00", title: COFFEE, venue: "Phoenix Ballroom" },
    {
      time: "16:00–17:30",
      title: "Hotel of the Future",
      details: ["Operating for Profit, People and the Planet in the age of AI"],
      description:
        "Is operating a hotel different today than 30 years ago? And what about in 10 years? Taking a step back, what are the shifts you perceive, what should be preserved and what should evolve for the next chapter of Banyan Tree?",
      venue: "Phoenix Ballroom",
    },
    CULINARY_FESTIVAL,
  ],
};

const DAY_TWO_DOSM: DayAgenda = {
  ...DAY_TWO_META,
  sessions: [
    ...DAY_TWO_MORNING,
    {
      time: "11:15–12:00",
      title: "Winning in the China Market",
      details: [
        "The Value Proposition of the Chinese Market Empowered by Social Marketing, Distribution Channel and Luxury Business",
      ],
      description:
        "China is our largest feeder market. How do we engage the Chinese guest in their own preferred channels and on social media? Luxury Travel Advisors are fast growing in China — whom do they want to do business with?",
      venue: "Zi Gui + Gu Xian",
    },
    {
      time: "12:00–12:40",
      title: "Commercial Strategies in a Tumultous World",
      details: ["Rethinking a refreshed playbook"],
      description:
        "2026 has brought new macro-economic challenges and being able to find new sources of business is important. What is something new you tried recently that worked or didn't work?",
      venue: "Zi Gui + Gu Xian",
    },
    {
      time: "12:40–13:00",
      title: "New Budget 2027 Template",
      details: ["Process and Presentation Expectations"],
      description:
        "A new Commercial Strategy Template for Budget 2027 that guides our thinking. Are you ready to start planning for 2027?",
      venue: "Zi Gui + Gu Xian",
    },
    {
      time: "13:00–14:00",
      title: "Bento Lunch & Gallery Showcase",
      details: ["Reenergising Activity"],
      venue: "Ballroom Foyer / Garden / Lobby Lounge",
    },
    {
      time: "14:00–15:00",
      title: "Redefining Luxury Sales",
      description:
        "Luxury travel is a $168 Trillion market in 2026. The question is not whether there's opportunity — it's whether you move before your competitor does.",
      venue: "Zi Gui",
    },
    {
      time: "15:00–15:30",
      title: "Story by Design",
      details: ["Design rare experiences and learn how to activate them across your marketing ecosystem"],
      description:
        "The way a guest discovers, chooses, books, and advocates for a hotel has been completely rewritten in the last five years. Looking at your own property, what is working in how you reach and convert the right guest, what is broken, and what does a truly connected brand story look like across every channel and every team in the next chapter of Banyan Tree?",
      venue: "Zi Gui",
    },
    { time: "15:30–16:00", title: COFFEE, venue: "Phoenix Ballroom" },
    {
      time: "16:00–17:30",
      title: "Story by Design, cont'd",
      details: ["Design rare experiences and learn how to activate them across your marketing ecosystem"],
      venue: "Zi Gui",
    },
    { time: "17:30–17:45", title: "3 Commitments", venue: "Zi Gui" },
    CULINARY_FESTIVAL,
  ],
};

const DAY_TWO_RM: DayAgenda = {
  ...DAY_TWO_META,
  sessions: [
    ...DAY_TWO_MORNING,
    {
      time: "11:15–12:00",
      title: "Winning in the China Market",
      details: [
        "Value Proposition of the Chinese Market Empowered by Social Marketing, Distribution Channel and Luxury Business",
      ],
      description:
        "China is our largest feeder market. How do we engage the Chinese guest in their own preferred channels and on social media? Luxury Travel Advisors are fast growing in China — whom do they want to do business with?",
      venue: "Zi Gui + Gu Xian",
    },
    {
      time: "12:00–12:40",
      title: "Commercial Strategies in a Tumultous World",
      details: ["Rethinking a refreshed playbook"],
      venue: "Zi Gui + Gu Xian",
    },
    {
      time: "12:40–13:00",
      title: "Bento Lunch & Gallery Showcase",
      details: ["Reenergising Activity"],
      venue: "Zi Gui + Gu Xian",
    },
    { time: "13:00–14:00", title: "Bento Lunch & Gallery", venue: "Phoenix Ballroom" },
    {
      time: "14:00–15:00",
      title: "Maximising Distribution",
      details: ["Future Roadmap and Maximizing Opportunities"],
      description:
        "Our global distribution landscape presents new opportunities — do you know all the channels available for you to maximize?",
      venue: "Qiong Zhi",
    },
    {
      time: "15:00–15:30",
      title: "Maximising CoStar Platform",
      details: ["Tools & tricks on understanding your market & comp set"],
      description:
        "CoStar is a tool we all use to monitor our competitors — how do we use it to understand market, competitors and find new opportunities?",
      venue: "Qiong Zhi",
    },
    { time: "15:30–16:00", title: COFFEE, venue: "Phoenix Ballroom" },
    {
      time: "16:00–16:30",
      title: "Leveraging with Banyan",
      details: ["How to capitalise on members to drive total revenue"],
      description:
        "Our best guests have already stayed with us. With a new platform launched in 2025/2026, how are we ensuring we work with our teams to drive total revenue?",
      venue: "Qiong Zhi",
    },
    {
      time: "16:30–17:30",
      title: "Pricing Toolkits for Total RM",
      details: [
        "Group Workshop - Develop Buyout Pricing, Corporate Retreat Pricing, Wellbeing Practicioner Toolkits",
      ],
      description:
        "3 case studies to help us think through all the considerations required to design an effective pricing toolkit for different scenarios.",
      venue: "Qiong Zhi",
    },
    {
      time: "17:30–18:00",
      title: "Geek Reflections: Sharing from the past 2 days",
      venue: "Qiong Zhi",
    },
    CULINARY_FESTIVAL,
  ],
};

/** Agenda keyed by role → ordered list of days. */
export const AGENDA: Record<RoleId, DayAgenda[]> = {
  gm: [DAY_ARRIVAL, DAY_ONE, DAY_TWO_GM, DAY_THREE],
  dosm: [DAY_ARRIVAL, DAY_ONE, DAY_TWO_DOSM, DAY_THREE],
  rm: [DAY_ARRIVAL, DAY_ONE, DAY_TWO_RM, DAY_THREE],
};

/* ------------------------------------------------------------------ */
/* SEAT INQUIRY                                                        */
/* ------------------------------------------------------------------ */

export interface SeatResult {
  name: string;
  rows: { label: string; value: string }[];
}

/**
 * MOCK seat-assignment lookup.
 *
 * The original "Seat Inquiry" is backed by a database (to be wired up later).
 * For now this returns demo data for the test name "lisa" so the UI flow can be
 * reviewed end-to-end. Replace `lookupSeat` with a real fetch/Supabase query
 * when the backend is ready — the return shape (`SeatResult`) stays the same.
 */
const MOCK_SEATS: Record<string, SeatResult> = {
  lisa: {
    name: "lisa",
    rows: [
      { label: "Jun. 8", value: "No.1 Table" },
      { label: "Jun. 9 Morning", value: "No.2 Table" },
      { label: "Jun. 9 Afternoon", value: "No.3 Table" },
      { label: "Jun. 10", value: "No.5 Table" },
    ],
  },
};

export function lookupSeat(name: string): SeatResult | null {
  return MOCK_SEATS[name.trim().toLowerCase()] ?? null;
}

/* ------------------------------------------------------------------ */
/* WECHAT SETUP & VERIFICATION GUIDE                                   */
/* ------------------------------------------------------------------ */

/**
 * Step-by-step guide for setting up WeChat in China and recovering from the
 * common "Security Verification Failed" error. Rendered at /aws/wechat and
 * linked from the Time & Place page.
 *
 * FOR THE EDITOR:
 * - Each `step` becomes its own numbered card.
 * - A step can carry an optional `intro` line and one or more `groups`.
 * - Each `group` is a bullet list with an optional `subtitle` + `intro`.
 * - A step can end with an optional `cta` (external link button).
 */
export interface GuideGroup {
  /** Optional sub-heading within a step (e.g. "Phone Number & SMS Verification"). */
  subtitle?: string;
  /** Optional lead-in sentence shown above the bullet points. */
  intro?: string;
  points: string[];
}

export interface GuideStep {
  title: string;
  /** Optional lead-in sentence shown under the step title. */
  intro?: string;
  groups: GuideGroup[];
  /** Optional external-link button at the end of the step. */
  cta?: { label: string; href: string };
}

export interface WechatGuide {
  kicker: string;
  title: string;
  intro: string;
  /** Official app-store download links (used by the WeChatDownload buttons). */
  downloads: { ios: string; android: string };
  steps: GuideStep[];
  proTip: string;
}

export const WECHAT_GUIDE: WechatGuide = {
  kicker: "Staying Connected",
  title: "WeChat Setup & Verification",
  intro:
    "WeChat is the primary way to stay connected in China. If you run into a “Security Verification Failed / Incorrect information. Enter again.” message while setting up, follow this step-by-step guide to resolve it.",
  /** Official app-store download links (used by the WeChatDownload buttons). */
  downloads: {
    ios: "https://apps.apple.com/app/wechat/id414478124",
    android: "https://play.google.com/store/apps/details?id=com.tencent.mm",
  },
  steps: [
    {
      title: "Stop Re-trying Immediately",
      groups: [
        {
          points: [
            "Tap “Later” to exit the verification screen.",
            "Do NOT tap “Try again” repeatedly for the next 24 hours. Multiple failed attempts trigger stricter security controls and may temporarily lock your account.",
          ],
        },
      ],
    },
    {
      title: "Check the Most Common Mistakes",
      intro: "These are the highest-priority things to get right.",
      groups: [
        {
          subtitle: "Phone Number & SMS Verification",
          points: [
            "Select the correct country/region code from the list (e.g. +1 for the US, +44 for the UK).",
            "Do NOT re-enter the country code in the phone number field — enter only the pure local digits.",
            "Confirm your phone line is active, not roaming-restricted, and can receive international SMS.",
          ],
        },
        {
          subtitle: "ID / Identity Verification (if applicable)",
          intro: "If you are verifying with a passport or government ID:",
          points: [
            "Make sure the photo is clear, unobstructed, and free of glare.",
            "Double-check that your full name, ID number, and expiration date exactly match the information linked to your WeChat account.",
            "Ensure your ID document is still valid (not expired).",
          ],
        },
      ],
    },
    {
      title: "Fix Your Environment",
      intro: "A clean network and an up-to-date app help you avoid automatic security blocks.",
      groups: [
        {
          subtitle: "Restart your phone & update WeChat",
          points: [
            "Reboot your device.",
            "Open your app store and update WeChat to the latest version — outdated versions often cause verification issues.",
          ],
        },
        {
          subtitle: "Use a stable, private network",
          points: [
            "Avoid public Wi-Fi, VPNs, or proxy connections during verification.",
            "Switch to a strong home Wi-Fi or a reliable mobile data connection.",
          ],
        },
      ],
    },
    {
      title: "Troubleshoot by Scenario",
      groups: [
        {
          subtitle: "Scenario A — Registering a new WeChat account",
          intro:
            "For non-Chinese users, new registrations almost always require Friend Verification: an existing WeChat user scans your QR code to confirm your registration. The helper must:",
          points: [
            "Have a WeChat account in good standing for at least 6 months.",
            "Have verified their account with a Chinese mainland phone number.",
            "Not have helped others register too recently.",
          ],
        },
        {
          subtitle: "Scenario B — Logging into an existing account",
          points: [
            "If you know your password, try “Password Login” to skip the verification step temporarily.",
            "Once logged in, go to Me → Settings → Account & Security to double-check your linked phone number and identity information.",
            "If you are logging in on a new device, you may need Friend Confirmation — ask a contact in your WeChat list to help verify your login.",
          ],
        },
      ],
    },
    {
      title: "Contact WeChat Support",
      intro: "If the problem persists, submit a request to official support.",
      groups: [
        {
          points: [
            "On the error screen, tap “Submit Feedback” to send a report directly.",
            "Or visit the official WeChat Help Center and go to Account & Security → Login & Verification to submit your account details and a screenshot of the error.",
            "The support team usually responds within 1–3 business days.",
          ],
        },
      ],
      cta: { label: "Visit WeChat Help Center", href: "https://help.wechat.com" },
    },
  ],
  proTip:
    "After resolving the issue, complete WeChat’s official identity verification (with your passport or a supported bank card) to avoid future verification blocks.",
};

/* ------------------------------------------------------------------ */
/* RESORT MAP                                                          */
/* ------------------------------------------------------------------ */

/**
 * Resort map shown on the Time & Place page. The centre illustration is the
 * cropped artwork (the original's coloured side panels are dropped); the two
 * numbered legends below are recreated here as responsive, bilingual lists so
 * they stay legible on every screen size.
 *
 * FOR THE EDITOR:
 * - `art` is the displayed image; `artLarge` opens in the tap-to-zoom overlay.
 * - Each legend `items` entry is { zh, en } and is numbered automatically by
 *   its position (1, 2, 3 …), matching the markers drawn on the map artwork.
 */
export interface MapLegendItem {
  zh: string;
  en: string;
}

export interface MapLegend {
  brand: string;
  brandZh: string;
  items: MapLegendItem[];
}

export const RESORT_MAP = {
  art: "/aws/resort-map-art.jpg",
  artLarge: "/aws/resort-map-art-large.jpg",
  legends: [
    {
      brand: "Banyan Tree",
      brandZh: "悦榕庄",
      items: [
        { zh: "大堂入口", en: "Lobby Entrance" },
        { zh: "镜·酒廊", en: "Mirror Lobby Lounge" },
        { zh: "庆典草坪", en: "Rooftop Lawn" },
        { zh: "悦榕阁", en: "Banyan Tree Gallery" },
        { zh: "凤凰厅", en: "Phoenix Ballroom" },
        { zh: "糖颂·饼店", en: "The Butter" },
        { zh: "鲜·闽菜餐厅", en: "Xun Restaurant" },
        { zh: "榕·点心餐厅", en: "Rong Restaurant" },
        { zh: "悦榕Spa", en: "Banyan Tree Spa" },
        { zh: "拱桥", en: "Arch Bridge" },
        { zh: "五栋客房", en: "Building 5 Guest Rooms" },
        { zh: "健身房", en: "Gym" },
        { zh: "三栋客房", en: "Building 3 Guest Rooms" },
        { zh: "户外无边泳池", en: "Infinity Pool" },
        { zh: "有马铁泉", en: "Arima Hot Spring" },
        { zh: "箱根温泉", en: "Hakone Hot Spring" },
        { zh: "二栋客房", en: "Building 2 Guest Rooms" },
        { zh: "一栋客房", en: "Building 1 Guest Rooms" },
        { zh: "蚌·炭火酒馆", en: "Bang Bar" },
      ],
    },
    {
      brand: "Angsana",
      brandZh: "悦椿",
      items: [
        { zh: "出入口", en: "Entrance & Exit" },
        { zh: "白鹭厅", en: "Egret Ballroom" },
        { zh: "大堂", en: "Lobby" },
        { zh: "米宴·东南亚餐厅", en: "Rice Bowl" },
        { zh: "影吧·悬崖酒吧", en: "Shadow Bar" },
        { zh: "食集·自助餐厅", en: "Market Place" },
        { zh: "网红水池", en: "Iconic Pool" },
        { zh: "中庭草坪", en: "Infinity Garden" },
        { zh: "石崖草坪", en: "Infinity Edge" },
        { zh: "悬崖沙滩", en: "Cliff Beach" },
        { zh: "珍珠沙滩", en: "Pearl Beach" },
        { zh: "户外泳池", en: "Outdoor Swimming Pool" },
        { zh: "Cavaya池畔吧", en: "Cavaya Poolside Bar" },
        { zh: "儿童乐园", en: "Kid's Club" },
      ],
    },
  ] satisfies MapLegend[],
} as const;
