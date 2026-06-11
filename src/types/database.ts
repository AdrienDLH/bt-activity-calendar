/**
 * DATABASE TYPES
 *
 * TypeScript types matching the Supabase database schema.
 * These ensure type safety when working with database queries.
 *
 * SCHEMA REFERENCE:
 * - hotels: Hotel properties with branding
 * - profiles: User profiles with roles
 * - activity_types: Categories for activities
 * - activities: Individual activity listings
 */

/**
 * Hotel - A Banyan Tree property
 *
 * Each hotel has its own slug for multi-tenant routing.
 * The private_session_cta_base is used for WhatsApp/mailto links.
 */
export interface Hotel {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  private_session_cta_base: string | null;
  created_at: string;
}

/**
 * Profile - User profile linked to Supabase Auth
 *
 * Roles determine access levels:
 * - master_admin: Full access to all hotels
 * - property_admin: Access to assigned hotel only
 */
export interface Profile {
  id: string;
  hotel_id: string | null;
  role: "master_admin" | "property_admin";
  full_name: string | null;
  updated_at: string;
  /**
   * When true, the user is forced to /admin/change-password on next login.
   * Set to true when a master admin invites a new user with a temporary
   * password; cleared after the user picks their own password.
   */
  must_reset_password: boolean;
}

/**
 * ActivityType - Category for grouping activities
 *
 * Examples: Yoga, Meditation, Excursion, Spa, Dining
 */
export interface ActivityType {
  id: string;
  name: string;
  created_at: string;
}

/**
 * TimeOfDay - Activity time segments
 *
 * Used for filtering activities by time of day:
 * - Rise: Early morning activities (6am-9am)
 * - Shine: Morning to midday (9am-12pm)
 * - Rest: Afternoon (12pm-5pm)
 * - Revel: Evening activities (5pm onwards)
 */
export type TimeOfDay = "Rise" | "Shine" | "Rest" | "Revel";

/**
 * Activity - A scheduled hotel activity
 *
 * Contains all details needed for display and booking.
 * The time_of_day provides quick filtering capability.
 */
export interface Activity {
  id: string;
  hotel_id: string;
  title: string;
  description: string | null;
  type_id: string;
  time_of_day: TimeOfDay | null;
  activity_date: string; // ISO date string (YYYY-MM-DD)
  start_time: string | null; // Time string (HH:MM:SS)
  end_time: string | null; // Time string (HH:MM:SS)
  location: string | null;
  practitioner: string | null;
  equipment: string | null;
  image_urls: string[] | null;
  tags: string[] | null;
  cta_link: string | null;
  published: boolean;
  auto_deactivate_at: string | null;
  created_at: string;
}

/**
 * ActivityWithType - Activity joined with its type
 *
 * Used when displaying activities with their category name.
 */
export interface ActivityWithType extends Activity {
  activity_type: ActivityType;
}

/**
 * AwsSeat - A single attendee's seat assignments for the AWS 2026 event.
 *
 * Looked up by normalised email. Lives in a deny-all-RLS table queried only
 * via the service-role server action — never exposed to the client.
 */
export interface AwsSeat {
  id: string;
  email: string;
  name: string;
  jun_8: string | null;
  jun_9_morning: string | null;
  jun_9_afternoon: string | null;
  jun_10: string | null;
  created_at: string;
}

/**
 * AwsFeedback - One anonymous feedback submission for the AWS 2026 event.
 *
 * Three open-text answers, no identifying fields. Lives in a deny-all-RLS table
 * written only via the service-role server action — never read by the client.
 */
export interface AwsFeedback {
  id: string;
  enjoyed: string | null;
  improve: string | null;
  other: string | null;
  user_agent: string | null;
  created_at: string;
}

/**
 * Database schema type for Supabase client
 *
 * This provides full type safety for all database operations.
 */
export interface Database {
  public: {
    Tables: {
      hotels: {
        Row: Hotel;
        Insert: Omit<Hotel, "id" | "created_at">;
        Update: Partial<Omit<Hotel, "id" | "created_at">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "updated_at">;
        Update: Partial<Omit<Profile, "id" | "updated_at">>;
      };
      activity_types: {
        Row: ActivityType;
        Insert: Omit<ActivityType, "id" | "created_at">;
        Update: Partial<Omit<ActivityType, "id" | "created_at">>;
      };
      activities: {
        Row: Activity;
        Insert: Omit<Activity, "id" | "created_at">;
        Update: Partial<Omit<Activity, "id" | "created_at">>;
      };
      aws_seats: {
        Row: AwsSeat;
        Insert: Omit<AwsSeat, "id" | "created_at">;
        Update: Partial<Omit<AwsSeat, "id" | "created_at">>;
      };
      aws_feedback: {
        Row: AwsFeedback;
        Insert: Omit<AwsFeedback, "id" | "created_at">;
        Update: Partial<Omit<AwsFeedback, "id" | "created_at">>;
      };
    };
  };
}
