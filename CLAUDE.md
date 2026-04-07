# Banyan Tree Luxury Hotel Activity Calendar

## Project Overview
This project is a white-label, multi-tenant Luxury Hotel Activity Calendar for the Banyan Tree Group. It serves as a public-facing activity schedule for guests and an internal management dashboard for hotel admins.

## Tech Stack
- **Framework:** Next.js 14+ (App Router, Server Components, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (mobile-first, fully responsive)
- **UI Components:** Shadcn/UI, Radix UI, Lucide React
- **Animations:** Framer Motion (Apple-level smooth animations, 300ms spring)
- **Database/Auth/Storage:** Supabase 
    - **CRITICAL:** Use `@supabase/ssr` for App Router compatibility. DO NOT use the deprecated `@supabase/auth-helpers-nextjs`.
- **Forms/Validation:** React Hook Form, Zod
- **Date Handling:** `date-fns`
- **Toasts:** Sonner
- **Deployment:** AWS Amplify

## Design & UI/UX Guidelines (Strict)
This project is designed for a non-developer UX/UI designer. Code must be clean and highly commented for easy CSS/Tailwind tweaks.
- **Aesthetic:** Apple Human Interface Guidelines (generous whitespace, large touch targets ≥44px, crisp typography, subtle depth).
- **Colors:** 
  - Background: Warm neutral `#F8F5F0`
  - Text: Dark brown `#2C2118`
  - Accents: Gold/Bronze `#C5A26F`
- **Shapes:** Strict square aesthetics. NO rounded corners anywhere. Use `rounded-none` (0px radius) for absolutely everything: buttons, cards, images, modals, input fields, tabs, tooltips, etc.
- **Responsiveness:** Mobile-first approach (bottom nav, stacked cards, bottom sheets). Tablet (split views/collapsible sidebar). Desktop (masonry view, hover states).
- **Accessibility:** WCAG 2.2 AA compliant, full keyboard navigation, reduced motion support.
- **Timezones:** Use `date-fns` to ensure the frontend always renders activities relative to the hotel's local time, NOT the user's browser timezone. A guest in London must see the exact hotel local time.

## Architecture & Routing
- **Routing Strategy:** Path-based multi-tenancy (`/[slug]`).
  - Example: `activities.banyantree.com/bintan` loads the Bintan hotel context.
- **Public Frontend:** `app/[slug]/page.tsx`. Segmented by "This Week" (7-day stacked) and "Upcoming" (monthly grid).
- **Admin Dashboard:** `app/admin/[slug]` or global `app/admin` protected by Supabase Session Middleware. RLS policies control data visibility (Property Admin vs. Master Admin).
- **Private Sessions:** Client-side only modal. Dynamically builds a pre-filled WhatsApp/mailto link using `hotel.private_session_cta_base` + form data.

## Supabase Development Rules
- **Schema:** Use the exact SQL schema provided in `claude_instructions/project_brief.md`.
- **Storage:** Use the `activity-images` bucket for all activity image uploads. Ensure drag-and-drop capability in the admin portal.
- **RLS:** Always assume Row Level Security is enabled. Do not bypass RLS unless explicitly needed via a service role (rare).

## Build & Deployment
- The deployment target is AWS Amplify.
- Ensure an `amplify.yml` exists with Next.js SSR build instructions. 

## Claude Development Rules
- Generate code step-by-step. Do not overwhelm the user with massive, multi-file rewrites unless asked.
- Add comments explaining *why* certain UI decisions were made to aid the UX designer.
- Validate all Zod schemas against the Supabase DB schema.
- Before writing extensive code, review `claude_instructions/project_brief.md` for the exact implementation sequence.
- **NEVER ask the user to run commands you can run yourself.** Always use the Bash tool to execute terminal commands (dev server restarts, installs, builds, etc.) directly.
