# Banyan Tree Luxury Hotel Activity Calendar - Instructions for Claude

**ATTENTION CLAUDE:** 
You are an expert full-stack developer. Your task is to build the complete Next.js 14 project exactly as specified below. 
You must read this entire document, understand the requirements, and then proceed to write the code and execute it step-by-step. 
Generate clean, production-ready code. The user is a non-developer (UX/UI designer) so keep every file simple, well-commented, and ready to run with minimal changes. Use only the tech stack listed. Do not add extra dependencies unless explicitly allowed.

## PROJECT NAME
Luxury Hotel Activity Calendar – Banyan Tree Group

## TECH STACK (use exactly these)
- Next.js 14+ App Router + Server Components + Server Actions
- TypeScript
- Tailwind CSS (mobile-first, fully responsive)
- Shadcn/UI + Radix UI + Lucide React + Framer Motion (for Apple-level smooth animations)
- Supabase (Auth with email OTP, Postgres, Storage for images). **CRITICAL: Use the modern `@supabase/ssr` package for App Router auth, NOT the deprecated auth-helpers.**
- date-fns, Zod, React Hook Form, Sonner for toasts
- Framer Motion for all micro-interactions
- Deployment target: AWS Amplify (generate an `amplify.yml` build config for Next.js SSR)

## DESIGN & UX/UI QUALITY
- Apple Human Interface Guidelines level: generous whitespace, large touch targets (≥44px), crisp typography, subtle depth, 300ms spring animations.
- Hospitality luxury feel: warm neutrals (#F8F5F0 background, #2C2118 text, #C5A26F accents), soft rounded corners (12-20px), high-res imagery with gentle gradients.
- FULLY RESPONSIVE: mobile-first (bottom nav, stacked cards, bottom sheets), tablet (split views, collapsible sidebar), desktop (masonry + hover states).
- WCAG 2.2 AA compliant, keyboard navigation, reduced motion support.
- **Timezones:** Be mindful of dates/times using `date-fns`; ensure the frontend always renders activities relative to the hotel's local time (or absolute times) so a user in London always sees the activity at the exact local time it happens at the hotel.

## DATABASE SCHEMA (run this exact SQL in Supabase SQL editor first)
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,                    -- e.g. 'bintan', 'phuket'
  name TEXT NOT NULL,
  logo_url TEXT,
  private_session_cta_base TEXT,                -- e.g. "https://wa.me/6512345678?text="
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  hotel_id UUID REFERENCES hotels(id),
  role TEXT NOT NULL CHECK (role IN ('master_admin', 'property_admin')),
  full_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activity_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES hotels(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type_id UUID REFERENCES activity_types(id) NOT NULL,
  time_of_day TEXT CHECK (time_of_day IN ('Rise', 'Shine', 'Rest', 'Revel')),
  activity_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  practitioner TEXT,
  equipment TEXT,
  image_urls TEXT[],
  tags TEXT[],
  cta_link TEXT,
  published BOOLEAN DEFAULT FALSE,
  auto_deactivate_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_activities_hotel_published ON activities(hotel_id, published);
CREATE INDEX idx_activities_date ON activities(activity_date);

ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Public read published activities
CREATE POLICY "Public read published" ON activities FOR SELECT USING (published = true);

-- Property admins manage own hotel
CREATE POLICY "Property manage own" ON activities FOR ALL USING (
  hotel_id = (SELECT hotel_id FROM profiles WHERE id = auth.uid() AND role = 'property_admin')
);

-- Master admin full access
CREATE POLICY "Master full access" ON activities FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master_admin')
);

-- Activity types
CREATE POLICY "Read types" ON activity_types FOR SELECT USING (true);
CREATE POLICY "Master manage types" ON activity_types FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master_admin')
);

-- Profiles & hotels
CREATE POLICY "Users own profile" ON profiles FOR ALL USING (id = auth.uid());
CREATE POLICY "Master view profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master_admin')
);
CREATE POLICY "Master manage hotels" ON hotels FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master_admin')
);

-- Setup Storage for Images
INSERT INTO storage.buckets (id, name, public) VALUES ('activity-images', 'activity-images', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public Image Access" ON storage.objects FOR SELECT USING (bucket_id = 'activity-images');
CREATE POLICY "Admin Image Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'activity-images' AND auth.role() = 'authenticated'
);
```

## ROUTING & MULTI-TENANCY
- Public site: Uses path-based routing `/[slug]` (e.g., `activities.banyantree.com/bintan`). A dynamic route loads the matching hotel and shows only that hotel’s activities. 
- Admin: `/admin/[slug]` or global `/admin` where RLS determines data visibility.

## PUBLIC FRONTEND (root of path /[slug])
- Sticky header with hotel logo + name
- Hero banner
- Segmented tabs: This Week | Upcoming Months
- Filters (top bar desktop/tablet, bottom sheet mobile): activity type chips (dynamic), time-of-day toggles (Rise/Shine/Rest/Revel), date picker
- This Week view: vertical 7-day stacked sections
- Upcoming view: responsive monthly grid with activity count dots
- Masonry activity cards → full-screen modal with image carousel (swipeable), all details, CTA button using cta_link
- Floating “Request Private Session” button (mobile FAB, desktop top right)
- Private session modal: type dropdown, date range, time-of-day, participants, notes → generates prefilled WhatsApp/mailto link using hotel.private_session_cta_base

## ADMIN DASHBOARD (/admin)
- Responsive sidebar (bottom nav on mobile)
- Sections: Overview, Activities, Activity Types (master only), Hotels (master only), Users (master only)
- Activities: responsive table or card list, full CRUD form with drag-and-drop image upload to Supabase Storage, custom cta_link field, publish toggle, auto-deactivate picker
- Master-only: simple CRUD for activity types

## PRIVATE SESSIONS
- Client-side only (no DB table yet)
- Modal form → dynamically builds link from hotel.private_session_cta_base + form data
- Success toast + optional .ics download

## DETAILED IMPLEMENTATION PLAN (Step-by-Step)
Claude, please execute these steps sequentially. Do not skip any steps. Verify each step as you progress.

1. **Project Initialization**
   - Scaffold the Next.js 14 App Router project with TypeScript.
   - Install and configure Tailwind CSS.
   - Install Radix UI, Lucide React, and Framer Motion.
   - Initialize Shadcn/UI and add necessary components (buttons, dialogs, forms, toasts).

2. **Supabase Integration & Configuration**
   - Add `@supabase/ssr` and Supabase JS client.
   - Create Server and Client clients in `lib/supabase/*`.
   - Inform the user to run the provided SQL script in the Supabase SQL editor.
   - *Checkpoint*: Verify the Supabase environment variables are properly typed and configured.

3. **Authentication & Middleware**
   - Create App Router middleware (`middleware.ts`) for session management and route protection (especially for `/admin` routes).
   - Build a login page with email OTP or password auth to support `role` assignments.

4. **Global Layout & Styling Foundation**
   - Apply the luxury hospitality design system (colors, typography, spacing).
   - Integrate page transition animations and micro-interactions using Framer Motion.
   - Set up the main layout frame ensuring mobile-first responsiveness.

5. **Public Calendar Page (`app/[slug]/page.tsx`)**
   - Fetch hotel context dynamically based on the slug.
   - Build the Hero banner and sticky header.
   - Implement the segmentation tabs (This Week vs Upcoming).
   - Build the filter section (chips, toggles, date picker).
   - Implement the "This Week" 7-day stacked layout.
   - Implement the "Upcoming" monthly grid.
   - Ensure timezone parsing accurately reflects local hotel time using `date-fns`.

6. **Activity Modals & Details**
   - Create the masonry activity cards.
   - Build the full-screen modal with image carousel for activity details.
   - Add the CTA button handling based on the `cta_link`.

7. **Admin Dashboard Layout (`/admin`)**
   - Build the protected `/admin` layout with a responsive sidebar (bottom nav on mobile).
   - Setup navigation between Overview, Activities, Activity Types, Hotels, and Users.

8. **Activities CRUD (Admin)**
   - Create tables/card lists for managing activities.
   - Build the "Add/Edit Activity" form using `react-hook-form` and `zod`.
   - Implement drag-and-drop image upload to Supabase Storage `activity-images` bucket.
   - Include publish toggles and auto-deactivate pickers.

9. **Master Admin Features**
   - Implement simple CRUD for Activity Types.
   - Ensure RLS rules restrict this to `master_admin` roles.

10. **Private Session Modal & CTA handling**
    - Build the Floating Action Button for "Request Private Session".
    - Implement the client-side modal form capturing (type, date range, time-of-day, participants, notes).
    - Generate the custom WhatsApp/mailto link dynamically based on `hotel.private_session_cta_base`.
    - Provide success feedback (`sonner` toasts) and an option to download an `.ics` file.

11. **Deployment Configuration**
    - Generate an `amplify.yml` build configuration file properly structured for Next.js SSR.

12. **Final Polish & QA**
    - Audit for WCAG 2.2 AA accessibility (ARIAs, keyboard nav).
    - Add skeleton loaders for async data boundaries.
    - Confirm all `framer-motion` animations feel "Apple-level" (e.g., 300ms spring).
    - Ensure code is fully commented for the UX/UI designer to easily tweak styles.
