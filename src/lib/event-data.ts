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
    "We are delighted to host you for the 2026 Elevating Banyan Tree AWS from June 7 to June 10.",
    "Prepare for a cohesive fusion of productive meetings, inspiring events, and meaningful reconnection — all set to elevate your experience against the immersive backdrop of Chinese charm and culture.",
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
        "Leisure clothes, comfortable shoes, smart-casual attire for evening events. For the final Gala dinner, a traditional outfit will be provided.",
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
  venue: "BT Bridge Floating Platforms",
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
      venue: "Phoenix Ballroom",
    },
    { time: "10:45–11:00", title: COFFEE, venue: "Phoenix Ballroom" },
    {
      time: "11:00–12:30",
      title: "Competency: How we Lead in Complexity",
      details: [
        "Playback of 360 survey and workshop on elevating our strategic agility and use of data intelligence",
      ],
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
      venue: "Phoenix Ballroom",
    },
    { time: "15:00–15:15", title: COFFEE, venue: "Phoenix Ballroom" },
    {
      time: "15:15–17:15",
      title: "Visions from the Field: The Future of Banyan Tree",
      details: ["GM & DOSM team presentations, and sharing from all"],
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
      venue: "Phoenix Ballroom",
    },
    { time: "9:45–10:45", title: COFFEE, venue: "Phoenix Ballroom" },
    {
      time: "10:45–12:15",
      title: "Leadership Commitments",
      details: [
        "Individual and group work to solidify insights, lock in commitments and unlock resources",
      ],
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
    venue: "Phoenix Ballroom",
  },
  {
    time: "10:30–11:00",
    title: "Keynote: Navigating the New Era of Luxury Travel in Greater China",
    details: ["Speaker Ms. Irene Lee, GM Virtuoso China"],
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
      details: ["Our new signature spaces and design elements for Banyan Tree"],
      venue: "Phoenix Ballroom",
    },
    { time: "15:30–16:00", title: COFFEE, venue: "Phoenix Ballroom" },
    {
      time: "16:00–17:30",
      title: "Hotel of the Future",
      details: ["Operating for Profit, People and the Planet in the age of AI"],
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
      title: "New Budget 2027 Template",
      details: ["Process and Presentation Expectations"],
      venue: "Zi Gui + Gu Xian",
    },
    {
      time: "13:00–14:00",
      title: "Bento Lunch & Gallery Showcase",
      details: ["Reenergising Activity"],
      venue: "Ballroom Foyer / Garden / Lobby Lounge",
    },
    { time: "14:00–15:00", title: "Redefining Luxury Sales", venue: "Zi Gui" },
    {
      time: "15:00–15:30",
      title: "Story by Design",
      details: ["Design rare experiences and learn how to activate them across your marketing ecosystem"],
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
      venue: "Qiong Zhi",
    },
    {
      time: "15:00–15:30",
      title: "Maximising CoStar Platform",
      details: ["Tools & tricks on understanding your market & comp set"],
      venue: "Qiong Zhi",
    },
    { time: "15:30–16:00", title: COFFEE, venue: "Phoenix Ballroom" },
    {
      time: "16:00–16:30",
      title: "Leveraging with Banyan",
      details: ["How to capitalise on members to drive total revenue"],
      venue: "Qiong Zhi",
    },
    {
      time: "16:30–17:30",
      title: "Pricing Toolkits for Total RM",
      details: [
        "Group Workshop - Develop Buyout Pricing, Corporate Retreat Pricing, Wellbeing Practicioner Toolkits",
      ],
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
