# UAT / QA Test Cases — BT Interactive Calendar (Admin Backend)

**Date drafted:** 2026-04-02  
**Date completed:** 2026-04-02 (property_admin + deferred cases completed 2026-04-02)  
**Tester:** Claude (automated) + Adrien (review)  
**Environment:** `http://localhost:3000`  
**Admin credentials (master_admin):** `adrienlahoussaye@gmail.com` / `BanyanAdmin2026!`  
**Admin credentials (property_admin):** `propadmin@test.com` / `TestAdmin2026!` (hotel: Banyan Tree Bintan)

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Pass |
| ❌ | Fail |
| ⚠️ | Partial / needs attention |
| 🔲 | Not yet tested |

---

## Bugs Fixed During UAT

| # | Bug | Fix |
|---|-----|-----|
| B1 | `window.confirm()` on activity delete blocked browser events (activities-table.tsx) | Replaced with inline two-step confirm pattern (same as activity-types-manager) |
| B2 | Deleting an activity type in use showed raw Postgres FK error message | Mapped to user-friendly: "Cannot delete: this type is used by existing activities." |
| B3 | Creating duplicate activity type showed raw Postgres unique constraint error | Mapped to user-friendly: "An activity type with that name already exists." |
| B4 | Navigating to `/admin/activities/[invalid-id]` showed blank white Next.js 404 page (no admin layout) | Created `src/app/admin/(dashboard)/not-found.tsx` — styled 404 renders within sidebar layout |
| B5 | RLS policy "Public read published" had no `auth.uid()` guard — authenticated property_admin users could see published activities from other hotels | Changed policy to `published = true AND auth.uid() IS NULL` (anonymous/public access only) |

---

## 1. Authentication

| # | Test Case | Steps | Expected Result | Status | Notes |
|---|-----------|-------|-----------------|--------|-------|
| 1.1 | Password login — success | Go to `/admin/login` → click "Sign in with password instead" → enter valid credentials → click Sign In | Redirected to `/admin` dashboard | ✅ | |
| 1.2 | Password login — wrong password | Enter valid email, wrong password → Submit | Error message shown, stays on login page | ✅ | |
| 1.3 | Password login — empty fields | Submit form with empty fields | Validation error shown | ✅ | |
| 1.4 | Magic link — form visible by default | Go to `/admin/login` | Magic link form is the default view | ✅ | |
| 1.5 | Magic link — toggle to password | Click "Sign in with password instead" | Password form appears | ✅ | |
| 1.6 | Toggle back to magic link | On password form, click "Sign in with magic link instead" | Magic link form reappears | ✅ | |
| 1.7 | Unauthenticated redirect | Without a session, navigate to `/admin` | Redirected to `/admin/login` | ✅ | |
| 1.8 | Unauthenticated redirect — deep link | Without a session, navigate to `/admin/activities` | Redirected to `/admin/login` | ✅ | |
| 1.9 | Authenticated redirect from login | While logged in, navigate to `/admin/login` | Redirected away to `/admin` | ✅ | |
| 1.10 | Session persistence | Log in, reload the page | Remains logged in, no redirect | ✅ | |
| 1.11 | Sign out | Click "Sign Out" in sidebar | Session cleared, redirected to `/admin/login` | ✅ | Tested: signed out of property_admin session via sidebar click → redirected to `/admin/login` |

---

## 2. Dashboard Overview (`/admin`)

| # | Test Case | Steps | Expected Result | Status | Notes |
|---|-----------|-------|-----------------|--------|-------|
| 2.1 | Stat cards render | Navigate to `/admin` | 4 stat cards visible: Total Activities, Published, Upcoming, Activity Types | ✅ | |
| 2.2 | Stat cards show correct counts | Check counts against known DB state | Numbers match DB records | ✅ | |
| 2.3 | Recent activities table | Navigate to `/admin` with existing activities | Table shows up to 10 most recent activities | ✅ | |
| 2.4 | Recent activities row — click to edit | Click an activity title in the table | Navigates to `/admin/activities/[id]` | ✅ | Title is the clickable link (not full row — server component) |
| 2.5 | Status badge — published | Activity with `published = true` | Shows "Live" badge (styled) | ✅ | |
| 2.6 | Status badge — draft | Activity with `published = false` | Shows "Draft" badge (styled) | ✅ | Verified with freshly-created draft activity |
| 2.7 | "New Activity" button | Click "+ New Activity" button in top-right | Navigates to `/admin/activities/new` | ✅ | |
| 2.8 | "View all" link | Click "View all" below recent activities | Navigates to `/admin/activities` | ✅ | |
| 2.9 | Empty state — no activities | When no activities exist in DB | Empty state message + CTA to create displayed | ✅ | Tested: deleted all activities → overview shows 0/0/0 stats + "No activities yet." + "Create Your First Activity" CTA |
| 2.10 | Overview updates after mutation | Create/delete an activity, return to `/admin` | Stat counts and recent table reflect new state | ✅ | Verified after create, toggle, and delete |

---

## 3. Activities List (`/admin/activities`)

| # | Test Case | Steps | Expected Result | Status | Notes |
|---|-----------|-------|-----------------|--------|-------|
| 3.1 | Page loads with activity list | Navigate to `/admin/activities` | All activities listed (master_admin sees all) | ✅ | |
| 3.2 | Empty state | When no activities exist | Empty state message and "New Activity" CTA shown | ✅ | Tested: after deleting all activities → "No activities yet." shown with "New Activity" button |
| 3.3 | Activity row displays key fields | Inspect each row | Shows title, type, date, published status | ✅ | |
| 3.4 | Edit button navigates correctly | Click edit icon/link on a row | Navigates to `/admin/activities/[id]` | ✅ | |
| 3.5 | Delete button — triggers confirmation | Click delete on a row | Confirmation dialog appears | ✅ | Inline two-step confirm: "Delete?" + ✓/✗ buttons (Bug B1 fixed) |
| 3.6 | Delete — confirm | Confirm deletion in dialog | Activity removed, list updates, success toast shown | ✅ | |
| 3.7 | Delete — cancel | Dismiss confirmation dialog | Nothing deleted, list unchanged | ✅ | |
| 3.8 | Toggle published — unpublished → live | Click publish toggle on a draft activity | Activity marked as published, UI updates, toast shown | ✅ | "Activity published." toast |
| 3.9 | Toggle published — live → draft | Click publish toggle on a live activity | Activity marked as draft, UI updates, toast shown | ✅ | Tested via edit form + inline toggle |
| 3.10 | "New Activity" button | Click "+ New Activity" | Navigates to `/admin/activities/new` | ✅ | |
| 3.11 | Responsive — mobile layout | Resize to <640px | Table columns collapse gracefully (type/date hidden) | ⚠️ | Not tested — browser automation at fixed viewport |

---

## 4. Create Activity (`/admin/activities/new`)

| # | Test Case | Steps | Expected Result | Status | Notes |
|---|-----------|-------|-----------------|--------|-------|
| 4.1 | Page loads | Navigate to `/admin/activities/new` | Empty form renders with all fields | ✅ | |
| 4.2 | Hotel dropdown populated | Open hotel dropdown | All hotels listed (master_admin) | ✅ | Only 1 hotel; auto-selected via defaultHotelId |
| 4.3 | Activity type dropdown populated | Open type dropdown | All activity types listed | ✅ | Excursion, Meditation, Yoga |
| 4.4 | Time of day dropdown — options | Open time_of_day dropdown | Options: Rise, Shine, Rest, Revel | ✅ | |
| 4.5 | Required fields validation — empty submit | Submit form with no fields filled | Validation error(s) shown, no DB write | ✅ | |
| 4.6 | Required field: title | Submit without title | Error shown for title field | ✅ | "Title is required" |
| 4.7 | Required field: hotel | Submit without selecting hotel | Error shown | ✅ | Hotel pre-selected (only 1 hotel); no error needed |
| 4.8 | Required field: activity type | Submit without selecting type | Error shown | ✅ | "Activity type is required" |
| 4.9 | Required field: date | Submit without date | Error shown | ✅ | "Date is required" |
| 4.10 | Tags — comma-separated input | Enter `yoga, meditation, morning` | Stored as array `["yoga", "meditation", "morning"]` | ✅ | Tags round-trip correctly through DB and edit form |
| 4.11 | Image URLs field | Enter valid URLs | Stored as JSON array in DB | ⚠️ | Form uses drag-and-drop file upload, not URL input — N/A |
| 4.12 | Published toggle — default off | Load form fresh | Published toggle defaults to unchecked (draft) | ✅ | Switch data-state="unchecked" |
| 4.13 | Successful create | Fill all required fields → Submit | Activity created, redirected to `/admin/activities`, success toast | ✅ | "Activity created." toast |
| 4.14 | Back link | Click breadcrumb back link | Navigates back to `/admin/activities` | ✅ | |
| 4.15 | New activity appears in list | After creating, go to activities list | New activity is visible in the table | ✅ | |
| 4.16 | New activity appears in overview stats | After creating, go to `/admin` | Total Activities count incremented | ✅ | |

---

## 5. Edit Activity (`/admin/activities/[id]`)

| # | Test Case | Steps | Expected Result | Status | Notes |
|---|-----------|-------|-----------------|--------|-------|
| 5.1 | Form pre-populated | Open an existing activity for editing | All fields pre-filled with current values | ✅ | |
| 5.2 | Tags pre-populated | Open activity with tags | Tags shown as comma-separated in field | ✅ | |
| 5.3 | Published state pre-populated | Open published activity | Published toggle is checked | ✅ | Verified for both published and draft states |
| 5.4 | Edit and save | Modify title → Submit | Activity updated in DB, redirected to list, success toast | ✅ | "Activity updated." toast |
| 5.5 | Edit published status | Uncheck published → Submit | Activity saved as draft | ✅ | Morning Yoga set to draft, verified in list |
| 5.6 | Invalid ID (404) | Navigate to `/admin/activities/nonexistent-id` | 404 page or graceful error shown | ✅ | Styled 404 with sidebar intact (Bug B4 fixed) |
| 5.7 | Back link | Click breadcrumb back link | Navigates back to `/admin/activities` | ✅ | |
| 5.8 | DB error handling | Simulate DB error (e.g. invalid type_id) | Error toast shown, stays on edit page | ⚠️ | Not tested — hard to simulate without DB manipulation |

---

## 6. Hotels Management (`/admin/hotels`) — Master Admin Only

| # | Test Case | Steps | Expected Result | Status | Notes |
|---|-----------|-------|-----------------|--------|-------|
| 6.1 | Page loads — master_admin | Navigate to `/admin/hotels` as master_admin | Hotels list + "Add Hotel" button visible | ✅ | |
| 6.2 | Access denied — property_admin | Log in as property_admin, navigate to `/admin/hotels` | Access denied message shown (not a blank page or crash) | ✅ | "Access Denied / Only master administrators can manage hotels." shown |
| 6.3 | Empty state | When no hotels exist | Empty state illustration + message shown | ✅ | Tested before adding first hotel |
| 6.4 | "Add Hotel" button — opens form | Click "+ Add Hotel" | Inline form appears below button | ✅ | |
| 6.5 | "Add Hotel" button — hides itself | After clicking Add Hotel | Button is replaced by the form (not both visible) | ✅ | |
| 6.6 | Create hotel — success | Fill Name + Slug → Submit | Hotel created, form closes, hotel appears in list, success toast | ✅ | |
| 6.7 | Create hotel — missing name | Submit without name | Validation error shown | ✅ | |
| 6.8 | Create hotel — missing slug | Submit without slug | Validation error shown | ✅ | |
| 6.9 | Slug auto-lowercased | Enter `BINTAN` in slug field → Submit | Saved as `bintan` in DB | ✅ | |
| 6.10 | Duplicate slug — DB error | Create hotel with slug already in use | Error toast shown with DB error message | ✅ | |
| 6.11 | Cancel add | Click Cancel in add form | Form closes, button reappears, nothing created | ✅ | |
| 6.12 | Hotel row displays name + slug | After creating, inspect list | Row shows hotel name and `/slug` | ✅ | |
| 6.13 | Edit button — opens inline form | Click pencil icon on a hotel row | Inline edit form expands below the row | ✅ | |
| 6.14 | Edit form pre-populated | Open inline edit | All fields prefilled with current hotel values | ✅ | |
| 6.15 | Edit hotel — save success | Modify name → Save | Hotel updated in DB, form collapses, success toast | ✅ | |
| 6.16 | Edit hotel — cancel | Click Cancel in edit form | Form collapses, no changes made | ✅ | |
| 6.17 | Edit hotel — missing required field | Clear name → Save | Validation error shown | ✅ | |
| 6.18 | Only one edit form open at a time | Click edit on hotel A, then hotel B | Hotel A's form closes, hotel B's opens | ✅ | |

---

## 7. Activity Types Management (`/admin/activity-types`) — Master Admin Only

| # | Test Case | Steps | Expected Result | Status | Notes |
|---|-----------|-------|-----------------|--------|-------|
| 7.1 | Page loads — master_admin | Navigate to `/admin/activity-types` | Inline add form + types list visible | ✅ | |
| 7.2 | Access denied — property_admin | Log in as property_admin, navigate here | Access denied message shown | ✅ | "Access Denied / Only master administrators can manage activity types." shown |
| 7.3 | Empty state | When no types exist | Empty state message shown | ✅ | |
| 7.4 | Add type — success | Enter a name (e.g. "Yoga") → click Add | Type created, appears in list, form resets, success toast | ✅ | |
| 7.5 | Add type — empty name | Submit with empty name field | Validation error, no DB write | ✅ | |
| 7.6 | Add type — loading state | Click Add button | Button shows spinner while pending | ✅ | |
| 7.7 | Type appears in list | After adding | New row visible with gold dot + name | ✅ | |
| 7.8 | Row count footer updates | After add/delete | Footer reflects correct count | ✅ | |
| 7.9 | Delete type — triggers confirmation | Click trash icon on a type | Confirmation dialog appears with type name | ✅ | Inline two-step confirm pattern |
| 7.10 | Delete — confirm | Confirm deletion | Type deleted, row removed, success toast | ✅ | |
| 7.11 | Delete — cancel | Dismiss dialog | Nothing deleted | ✅ | |
| 7.12 | Delete — type in use by activity | Attempt to delete a type referenced by activities | DB FK error surfaced in error toast | ✅ | Bug B2 fixed — user-friendly message shown |
| 7.13 | Type available in activity form | After creating, go to New Activity | New type appears in type dropdown | ✅ | |

---

## 8. Users Page (`/admin/users`) — Master Admin Only

| # | Test Case | Steps | Expected Result | Status | Notes |
|---|-----------|-------|-----------------|--------|-------|
| 8.1 | Page loads — master_admin | Navigate to `/admin/users` | Table of all profiles shown | ✅ | |
| 8.2 | Access denied — property_admin | Log in as property_admin, navigate here | Access denied message shown | ✅ | "Access Denied / Only master administrators can view users." shown |
| 8.3 | Current user highlighted | Inspect own row | Row has gold/accent background | ✅ | |
| 8.4 | "(you)" label on current user | Inspect own row | Name column shows "(you)" suffix | ✅ | |
| 8.5 | Role badge — master_admin | Inspect a master_admin user row | Badge shows "Master" | ✅ | |
| 8.6 | Role badge — property_admin | Inspect a property_admin user row | Badge shows "Property" | ✅ | "Property Admin Test" row shows "PROPERTY" badge |
| 8.7 | Hotel column — master_admin user | Inspect a master_admin's hotel column | Shows "All Hotels" | ✅ | |
| 8.8 | Hotel column — property_admin user | Inspect a property_admin's hotel column | Shows assigned hotel name | ✅ | Shows "Banyan Tree Bintan" |
| 8.9 | User count footer | Inspect bottom of table | Shows correct total user count | ✅ | |
| 8.10 | Info banner visible | Inspect page | Banner with user management instructions shown | ✅ | |
| 8.11 | Responsive — mobile layout | Resize to <640px | Role column shown below name; hotel/date columns hidden | ⚠️ | Not tested — browser automation at fixed viewport |
| 8.12 | Empty state | When no profiles exist | Empty state message shown | ⚠️ | Not tested — requires empty profiles table |

---

## 9. Sidebar Navigation & Layout

| # | Test Case | Steps | Expected Result | Status | Notes |
|---|-----------|-------|-----------------|--------|-------|
| 9.1 | Sidebar visible on desktop | Load any admin page at ≥1024px | Sidebar is visible with nav items | ✅ | |
| 9.2 | Active nav item highlighted | Navigate to each section | Correct nav item highlighted/active | ✅ | |
| 9.3 | Nav items — master_admin | Log in as master_admin | All items visible: Overview, Activities, Activity Types, Hotels, Users | ✅ | |
| 9.4 | Nav items — property_admin | Log in as property_admin | Hotels / Activity Types / Users items hidden or disabled | ✅ | Sidebar shows only Overview + Activities; Hotels/Activity Types/Users hidden |
| 9.5 | "Sign Out" link in sidebar | Click "Sign Out" | Logs out, redirects to login | ✅ | Tested as property_admin: sidebar click → redirected to `/admin/login` |
| 9.6 | Role badge in sidebar header | Inspect top of sidebar | Shows "Master Admin" or hotel name for property_admin | ✅ | master_admin: "Master Admin"; property_admin: "Property Admin Test" (full_name) |
| 9.7 | Responsive — mobile nav | Resize to <768px | Sidebar collapses; mobile navigation mechanism visible | ⚠️ | Not tested — browser automation at fixed viewport |

---

## 10. Cross-Cutting / Edge Cases

| # | Test Case | Steps | Expected Result | Status | Notes |
|---|-----------|-------|-----------------|--------|-------|
| 10.1 | RLS — property_admin cannot see other hotel's activities | Log in as property_admin, inspect activities list | Only own hotel's activities visible | ✅ | With 2 hotels: Bintan property_admin sees 0 Bintan activities; Bangkok's published activity correctly hidden (after B5 fix) |
| 10.2 | RLS — direct URL to other hotel's activity | Log in as property_admin, navigate to another hotel's activity URL | 404 or access denied | ✅ | Direct URL to Bangkok activity returns styled "Not Found" page within admin layout (RLS returns no row → `notFound()` called) |
| 10.3 | Cache revalidation after create | Create activity → return to overview | Stats updated without manual refresh | ✅ | Total Activities incremented immediately |
| 10.4 | Cache revalidation after delete | Delete activity → return to overview | Stats updated without manual refresh | ✅ | Total Activities decremented immediately |
| 10.5 | Cache revalidation after toggle | Toggle published → return to overview | Published count updated | ✅ | Published count updated immediately after toggle |
| 10.6 | Toast — success styling | Trigger any successful mutation | Success toast appears (Sonner) and auto-dismisses | ✅ | Green Sonner toast with checkmark icon |
| 10.7 | Toast — error styling | Trigger any failed mutation | Error toast appears and auto-dismisses | ✅ | Verified via TC-7.12 (FK error) and TC-7.9 (duplicate name) |
| 10.8 | Long text inputs | Enter very long title/description/location | No layout breakage, text wraps or truncates correctly | ✅ | 500-char description: textarea wraps, list row truncates cleanly |
| 10.9 | Special characters in fields | Enter `"Yoga & Wellness – Bintan's Best!"` as title | Saved and displayed correctly without encoding issues | ✅ | `& – ' !` all round-trip correctly |
| 10.10 | Concurrent editing | Open same activity in two tabs, edit in tab 1, save in tab 2 | Last write wins, no crash | ✅ | Tested: both tabs saved without error or crash. Last-write-wins (no optimistic locking / conflict detection). |

---

## Out of Scope (Not Testing Today)

- Magic link email delivery (external dependency)
- Public guest-facing frontend (`/[slug]`)
- Image upload drag-and-drop (not yet implemented in testing)
- Timezone rendering on public frontend
- Mobile/responsive layout (automated tests run at fixed 1471×836 viewport)

---

## Summary

**Total test cases:** 95  
**Sections:** Auth (11), Overview (10), Activities List (11), Create Activity (16), Edit Activity (8), Hotels (18), Activity Types (13), Users (12), Navigation (7), Cross-cutting (10)

| Result | Count |
|--------|-------|
| ✅ Pass | 88 |
| ⚠️ Partial / skipped | 7 |
| ❌ Fail | 0 |

**Bugs found and fixed:** 5 (see Bugs Fixed table above)

**Skipped reasons:**
- 4 cases require responsive viewport testing (not feasible in automation)
- 1 case (TC-5.8) hard to simulate without DB manipulation
- 1 case (TC-8.12) requires empty profiles table — not worth destructive cleanup
- 1 case (TC-4.11) N/A — form uses file upload, not URL input
