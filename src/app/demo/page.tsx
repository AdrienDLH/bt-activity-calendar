/**
 * DEMO PAGE - /demo
 *
 * Demo calendar page with mock data.
 * Shows the calendar functionality without requiring Supabase.
 * Useful for development, testing, and showcasing.
 */

import { Suspense } from "react";
import { CalendarClientPage } from "@/app/[slug]/calendar-client";
import { addDays, format } from "date-fns";
import type { Hotel, Activity, ActivityType } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo | Banyan Tree",
  description: "Experience the Banyan Tree Experience Calendar demo with sample activities.",
};

/**
 * Generate mock data for demo purposes
 */
function generateMockData() {
  // Mock hotel
  const hotel: Hotel = {
    id: "demo-hotel-id",
    slug: "demo",
    name: "Banyan Tree Bintan",
    logo_url: null,
    private_session_cta_base: "https://wa.me/6512345678?text=",
    created_at: new Date().toISOString(),
  };

  // Mock activity types — the 5 official Banyan Tree activity categories
  const activityTypes: ActivityType[] = [
    { id: "type-1", name: "Culture & Community",    created_at: new Date().toISOString() },
    { id: "type-2", name: "Gastronomy",              created_at: new Date().toISOString() },
    { id: "type-3", name: "Wellbeing & Movement",    created_at: new Date().toISOString() },
    { id: "type-4", name: "Nature & Stewardship",    created_at: new Date().toISOString() },
    { id: "type-5", name: "Seasonal Experiences",    created_at: new Date().toISOString() },
  ];

  // Base date for activities (today)
  const baseDate = new Date();

  // Mock activities
  const activities: Activity[] = [
    // Day 1 (Today)
    {
      id: "act-1",
      hotel_id: hotel.id,
      title: "Sunrise Beach Yoga",
      description: "Start your day with a rejuvenating yoga session on our pristine beach. Our experienced instructor will guide you through flowing sequences as the sun rises over the horizon. Suitable for all levels.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Rise",
      activity_date: format(baseDate, "yyyy-MM-dd"),
      start_time: "06:30:00",
      end_time: "07:30:00",
      location: "Main Beach Pavilion",
      practitioner: "Guru Priya",
      equipment: "Yoga mat (provided), comfortable clothing",
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE90CXXKB5F0DE02GCE07BN.jpg",
      ],
      tags: ["Beginner Friendly", "Outdoor", "Wellness"],
      cta_link: "https://example.com/book/yoga",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-2",
      hotel_id: hotel.id,
      title: "Sound Bath",
      description: "Immerse yourself in the healing vibrations of Tibetan singing bowls and crystal gongs. Lie back and let resonant sound waves melt away tension, restore balance, and guide you into a deep meditative state.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Shine",
      activity_date: format(baseDate, "yyyy-MM-dd"),
      start_time: "09:00:00",
      end_time: "10:00:00",
      location: "Zen Garden",
      practitioner: "Master Chen",
      equipment: "Mat & blanket (provided)",
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE2MX2YF0NKPKP5RYVERABN.jpg",
      ],
      tags: ["Sound Healing", "Relaxation"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-3",
      hotel_id: hotel.id,
      title: "Thai Cooking Class",
      description: "Learn the secrets of authentic Thai cuisine with our executive chef. Create three signature dishes using fresh local ingredients from our garden.",
      type_id: "type-2", // Gastronomy
      time_of_day: "Shine",
      activity_date: format(baseDate, "yyyy-MM-dd"),
      start_time: "10:30:00",
      end_time: "13:00:00",
      location: "Cooking School",
      practitioner: "Chef Somchai",
      equipment: "Apron provided",
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE2PTCQ5GRM3FQDX8A8K816.jpg",
      ],
      tags: ["Culinary", "Hands-on", "Cultural"],
      cta_link: "https://example.com/book/cooking",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-4",
      hotel_id: hotel.id,
      title: "Jamu Making Workshop",
      description: "Discover the ancient art of Jamu — Indonesia's traditional herbal medicine. Led by our resident healer, you will blend fresh roots, spices, and botanicals to craft your own personalised wellness tonic to take home.",
      type_id: "type-1", // Culture & Community
      time_of_day: "Revel",
      activity_date: format(baseDate, "yyyy-MM-dd"),
      start_time: "17:00:00",
      end_time: "18:30:00",
      location: "Spice Garden Pavilion",
      practitioner: "Ibu Sari",
      equipment: "Apron provided",
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNEB6F6K2J5P77YAZZ9K6KG8.jpg",
      ],
      tags: ["Cultural", "Hands-on", "Wellness"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },

    // Day 2
    {
      id: "act-5",
      hotel_id: hotel.id,
      title: "Morning Pilates",
      description: "Strengthen your core and improve flexibility with our Pilates class overlooking the ocean.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Rise",
      activity_date: format(addDays(baseDate, 1), "yyyy-MM-dd"),
      start_time: "07:00:00",
      end_time: "08:00:00",
      location: "Fitness Pavilion",
      practitioner: "Sarah Lin",
      equipment: "Mat provided",
      image_urls: [
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
      ],
      tags: ["Core", "Strength", "Flexibility"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-6",
      hotel_id: hotel.id,
      title: "Mangrove Eco Tour",
      description: "Discover the fascinating ecosystem of our local mangroves with our expert naturalist guide.",
      type_id: "type-4", // Nature & Stewardship
      time_of_day: "Shine",
      activity_date: format(addDays(baseDate, 1), "yyyy-MM-dd"),
      start_time: "09:30:00",
      end_time: "12:00:00",
      location: "Marina",
      practitioner: "Dr. Tan",
      equipment: "Sunscreen, hat, camera",
      image_urls: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      ],
      tags: ["Nature", "Educational", "Photography"],
      cta_link: "https://example.com/book/eco-tour",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-7",
      hotel_id: hotel.id,
      title: "Traditional Spa Ritual",
      description: "Experience our signature 90-minute spa treatment combining ancient techniques with modern luxury.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Rest",
      activity_date: format(addDays(baseDate, 1), "yyyy-MM-dd"),
      start_time: "14:00:00",
      end_time: "15:30:00",
      location: "Banyan Tree Spa",
      practitioner: null,
      equipment: null,
      image_urls: [
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
      ],
      tags: ["Spa", "Relaxation", "Luxury"],
      cta_link: "https://example.com/book/spa",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },

    // Day 3
    {
      id: "act-8",
      hotel_id: hotel.id,
      title: "Stand Up Paddleboarding",
      description: "Learn the basics of SUP in our calm lagoon waters. Perfect for beginners!",
      type_id: "type-4", // Nature & Stewardship
      time_of_day: "Shine",
      activity_date: format(addDays(baseDate, 2), "yyyy-MM-dd"),
      start_time: "10:00:00",
      end_time: "11:30:00",
      location: "Water Sports Center",
      practitioner: "Coach Mike",
      equipment: "Board and paddle provided",
      image_urls: [
        "https://images.unsplash.com/photo-1526485856375-9110812fbf35?w=800",
      ],
      tags: ["Water Sports", "Beginner", "Fun"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },

    // Day 4
    {
      id: "act-9",
      hotel_id: hotel.id,
      title: "Vinyasa Flow Yoga",
      description: "Dynamic flowing yoga practice to energize your body and mind.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Rise",
      activity_date: format(addDays(baseDate, 3), "yyyy-MM-dd"),
      start_time: "06:30:00",
      end_time: "07:30:00",
      location: "Beach Pavilion",
      practitioner: "Guru Priya",
      equipment: "Mat provided",
      image_urls: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      ],
      tags: ["Intermediate", "Energizing"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-10",
      hotel_id: hotel.id,
      title: "Wine & Cheese Evening",
      description: "An evening of fine wines paired with artisanal cheeses, hosted by our sommelier.",
      type_id: "type-2", // Gastronomy
      time_of_day: "Revel",
      activity_date: format(addDays(baseDate, 3), "yyyy-MM-dd"),
      start_time: "18:00:00",
      end_time: "20:00:00",
      location: "Wine Cellar",
      practitioner: "Sommelier Jean",
      equipment: null,
      image_urls: [
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
      ],
      tags: ["Social", "Gourmet", "Evening"],
      cta_link: "https://example.com/book/wine",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },

    // Day 5
    {
      id: "act-11",
      hotel_id: hotel.id,
      title: "Sound Bath Meditation",
      description: "Immerse yourself in healing vibrations of Tibetan singing bowls and gongs.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Rest",
      activity_date: format(addDays(baseDate, 4), "yyyy-MM-dd"),
      start_time: "15:00:00",
      end_time: "16:00:00",
      location: "Meditation Hall",
      practitioner: "Master Chen",
      equipment: null,
      image_urls: [
        "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?w=800",
      ],
      tags: ["Healing", "Sound Therapy"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },

    // Day 6
    {
      id: "act-12",
      hotel_id: hotel.id,
      title: "Island Hopping Adventure",
      description: "Visit three stunning nearby islands with snorkeling and beach time included.",
      type_id: "type-4", // Nature & Stewardship
      time_of_day: "Shine",
      activity_date: format(addDays(baseDate, 5), "yyyy-MM-dd"),
      start_time: "09:00:00",
      end_time: "16:00:00",
      location: "Marina",
      practitioner: null,
      equipment: "Sunscreen, swimwear, camera",
      image_urls: [
        "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800",
      ],
      tags: ["Full Day", "Adventure", "Snorkeling"],
      cta_link: "https://example.com/book/island-hopping",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },

    // ── Past days (Mon Mar 30 → Sat Apr 4) ──────────────────────────────────
    // Mon Mar 30  (baseDate - 6)
    {
      id: "act-13",
      hotel_id: hotel.id,
      title: "Sunrise Beach Meditation",
      description: "Begin the week with a guided mindfulness session at the water's edge, breathing in the sea air as the sun climbs above the horizon.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Rise",
      activity_date: format(addDays(baseDate, -6), "yyyy-MM-dd"),
      start_time: "06:30:00",
      end_time: "07:15:00",
      location: "Main Beach",
      practitioner: "Guru Priya",
      equipment: "Yoga mat (provided)",
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE90CXXKB5F0DE02GCE07BN.jpg",
      ],
      tags: ["Mindfulness", "Outdoor", "Wellness"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-14",
      hotel_id: hotel.id,
      title: "Batik Dyeing Workshop",
      description: "Uncover the centuries-old Indonesian art of wax-resist batik. Apply traditional motifs to fabric using copper tjanting tools and natural dyes.",
      type_id: "type-1", // Culture & Community
      time_of_day: "Shine",
      activity_date: format(addDays(baseDate, -6), "yyyy-MM-dd"),
      start_time: "10:00:00",
      end_time: "12:00:00",
      location: "Arts & Crafts Studio",
      practitioner: "Ibu Ratna",
      equipment: "Apron provided",
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNEB6F6K2J5P77YAZZ9K6KG8.jpg",
      ],
      tags: ["Craft", "Cultural", "Hands-on"],
      cta_link: "https://example.com/book/batik",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-15",
      hotel_id: hotel.id,
      title: "Sunset Cocktail Class",
      description: "Learn to mix three signature tropical cocktails with our head bartender, using house-infused spirits and fresh local fruits.",
      type_id: "type-2", // Gastronomy
      time_of_day: "Revel",
      activity_date: format(addDays(baseDate, -6), "yyyy-MM-dd"),
      start_time: "17:30:00",
      end_time: "19:00:00",
      location: "Treehouse Bar",
      practitioner: "Barista Marco",
      equipment: null,
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE2PTCQ5GRM3FQDX8A8K816.jpg",
      ],
      tags: ["Social", "Cocktails", "Evening"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },

    // Tue Mar 31  (baseDate - 5)
    {
      id: "act-16",
      hotel_id: hotel.id,
      title: "Forest Bathing Walk",
      description: "A slow, sensory immersion through the resort's tropical forest guided by our resident naturalist. Reconnect with nature through sight, scent, and sound.",
      type_id: "type-4", // Nature & Stewardship
      time_of_day: "Rise",
      activity_date: format(addDays(baseDate, -5), "yyyy-MM-dd"),
      start_time: "07:00:00",
      end_time: "08:30:00",
      location: "Rainforest Trail",
      practitioner: "Dr. Tan",
      equipment: "Comfortable shoes",
      image_urls: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      ],
      tags: ["Nature", "Walking", "Mindfulness"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-17",
      hotel_id: hotel.id,
      title: "Aqua Aerobics",
      description: "A fun, low-impact full-body workout in the resort pool led by our certified fitness instructor. Suitable for all ages and fitness levels.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Shine",
      activity_date: format(addDays(baseDate, -5), "yyyy-MM-dd"),
      start_time: "09:30:00",
      end_time: "10:30:00",
      location: "Infinity Pool",
      practitioner: "Sarah Lin",
      equipment: "Swimwear",
      image_urls: [
        "https://images.unsplash.com/photo-1526485856375-9110812fbf35?w=800",
      ],
      tags: ["Pool", "Fitness", "Beginner Friendly"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-18",
      hotel_id: hotel.id,
      title: "Balinese Massage Demo",
      description: "Our senior therapist shares the history and key techniques of traditional Balinese massage, followed by a hands-on practice session with a partner.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Rest",
      activity_date: format(addDays(baseDate, -5), "yyyy-MM-dd"),
      start_time: "14:30:00",
      end_time: "15:30:00",
      location: "Banyan Tree Spa",
      practitioner: null,
      equipment: null,
      image_urls: [
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
      ],
      tags: ["Wellness", "Spa", "Educational"],
      cta_link: "https://example.com/book/massage-demo",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },

    // Wed Apr 1  (baseDate - 4)
    {
      id: "act-19",
      hotel_id: hotel.id,
      title: "Yin Yoga & Breathwork",
      description: "A deeply restorative morning practice combining long-held yin poses with pranayama breathing techniques to release tension and cultivate inner stillness.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Rise",
      activity_date: format(addDays(baseDate, -4), "yyyy-MM-dd"),
      start_time: "06:30:00",
      end_time: "07:30:00",
      location: "Zen Garden",
      practitioner: "Guru Priya",
      equipment: "Mat & bolster (provided)",
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE2MX2YF0NKPKP5RYVERABN.jpg",
      ],
      tags: ["Yoga", "Restorative", "Breathwork"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-20",
      hotel_id: hotel.id,
      title: "Reef Snorkel Safari",
      description: "Guided snorkelling over the resort's protected coral garden. Spot reef fish, sea turtles, and vibrant coral formations with our marine biologist.",
      type_id: "type-4", // Nature & Stewardship
      time_of_day: "Shine",
      activity_date: format(addDays(baseDate, -4), "yyyy-MM-dd"),
      start_time: "10:00:00",
      end_time: "12:00:00",
      location: "House Reef",
      practitioner: "Dr. Tan",
      equipment: "Snorkel gear provided",
      image_urls: [
        "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800",
      ],
      tags: ["Ocean", "Marine Life", "Adventure"],
      cta_link: "https://example.com/book/snorkel",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-21",
      hotel_id: hotel.id,
      title: "Private Dining Degustation",
      description: "A five-course tasting menu served under the stars, curated by our executive chef using seasonal local produce and paired with selected wines.",
      type_id: "type-2", // Gastronomy
      time_of_day: "Revel",
      activity_date: format(addDays(baseDate, -4), "yyyy-MM-dd"),
      start_time: "19:00:00",
      end_time: "21:30:00",
      location: "Garden Terrace",
      practitioner: "Chef Somchai",
      equipment: null,
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE2PTCQ5GRM3FQDX8A8K816.jpg",
      ],
      tags: ["Fine Dining", "Seasonal", "Evening"],
      cta_link: "https://example.com/book/degustation",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },

    // Thu Apr 2  (baseDate - 3)
    {
      id: "act-22",
      hotel_id: hotel.id,
      title: "Morning Tai Chi",
      description: "Flowing tai chi sequences practiced at the ocean's edge to ground body and mind, guided by Master Chen. Suitable for all abilities.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Rise",
      activity_date: format(addDays(baseDate, -3), "yyyy-MM-dd"),
      start_time: "07:00:00",
      end_time: "08:00:00",
      location: "Beachfront Deck",
      practitioner: "Master Chen",
      equipment: null,
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE90CXXKB5F0DE02GCE07BN.jpg",
      ],
      tags: ["Tai Chi", "Beginner Friendly", "Outdoor"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-23",
      hotel_id: hotel.id,
      title: "Spice Garden Tour",
      description: "Walk through the resort's working spice garden with our herbalist, discovering the origins and culinary uses of over 30 tropical plants and herbs.",
      type_id: "type-1", // Culture & Community
      time_of_day: "Shine",
      activity_date: format(addDays(baseDate, -3), "yyyy-MM-dd"),
      start_time: "09:00:00",
      end_time: "10:00:00",
      location: "Spice Garden",
      practitioner: "Ibu Sari",
      equipment: null,
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNEB6F6K2J5P77YAZZ9K6KG8.jpg",
      ],
      tags: ["Botanical", "Educational", "Guided"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-24",
      hotel_id: hotel.id,
      title: "Kayak Sunset Paddle",
      description: "Paddle along the coastline as the sun sets in a blaze of colour. Small groups of up to 8 guests; all experience levels welcome.",
      type_id: "type-4", // Nature & Stewardship
      time_of_day: "Revel",
      activity_date: format(addDays(baseDate, -3), "yyyy-MM-dd"),
      start_time: "17:00:00",
      end_time: "18:30:00",
      location: "Water Sports Center",
      practitioner: "Coach Mike",
      equipment: "Kayak & PFD provided",
      image_urls: [
        "https://images.unsplash.com/photo-1526485856375-9110812fbf35?w=800",
      ],
      tags: ["Kayaking", "Sunset", "Outdoor"],
      cta_link: "https://example.com/book/kayak",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },

    // Fri Apr 3  (baseDate - 2)
    {
      id: "act-25",
      hotel_id: hotel.id,
      title: "Ashtanga Mysore",
      description: "A self-paced Ashtanga practice with individual adjustments from our senior instructor. Ideal for practitioners familiar with the primary series.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Rise",
      activity_date: format(addDays(baseDate, -2), "yyyy-MM-dd"),
      start_time: "06:30:00",
      end_time: "08:00:00",
      location: "Beach Pavilion",
      practitioner: "Guru Priya",
      equipment: "Mat provided",
      image_urls: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      ],
      tags: ["Ashtanga", "Intermediate", "Yoga"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-26",
      hotel_id: hotel.id,
      title: "Sushi Rolling Class",
      description: "Master the art of Japanese sushi with our visiting chef. Guests prepare and enjoy their own platter of nigiri, maki, and temaki rolls.",
      type_id: "type-2", // Gastronomy
      time_of_day: "Shine",
      activity_date: format(addDays(baseDate, -2), "yyyy-MM-dd"),
      start_time: "11:00:00",
      end_time: "13:00:00",
      location: "Cooking School",
      practitioner: "Chef Kenji",
      equipment: "Apron provided",
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE2PTCQ5GRM3FQDX8A8K816.jpg",
      ],
      tags: ["Culinary", "Japanese", "Hands-on"],
      cta_link: "https://example.com/book/sushi",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-27",
      hotel_id: hotel.id,
      title: "Gong Meditation",
      description: "A deeply immersive sound journey using a 38-inch orchestral gong. Lie back and allow resonant frequencies to dissolve stress and restore equilibrium.",
      type_id: "type-3", // Wellbeing & Movement
      time_of_day: "Rest",
      activity_date: format(addDays(baseDate, -2), "yyyy-MM-dd"),
      start_time: "15:30:00",
      end_time: "16:30:00",
      location: "Meditation Hall",
      practitioner: "Master Chen",
      equipment: "Blanket & eye pillow (provided)",
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE2MX2YF0NKPKP5RYVERABN.jpg",
      ],
      tags: ["Sound Healing", "Relaxation", "Deep Rest"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },

    // Sat Apr 4  (baseDate - 1)
    {
      id: "act-28",
      hotel_id: hotel.id,
      title: "Open Water Kayaking",
      description: "An invigorating morning paddle around the headland with panoramic views of the Bintan coastline. Suitable for intermediate paddlers.",
      type_id: "type-4", // Nature & Stewardship
      time_of_day: "Rise",
      activity_date: format(addDays(baseDate, -1), "yyyy-MM-dd"),
      start_time: "07:00:00",
      end_time: "08:30:00",
      location: "Water Sports Center",
      practitioner: "Coach Mike",
      equipment: "Kayak & PFD provided",
      image_urls: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      ],
      tags: ["Kayaking", "Ocean", "Intermediate"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-29",
      hotel_id: hotel.id,
      title: "Seasonal Fruit Tasting",
      description: "An intimate guided tasting of rare tropical fruits sourced from local farms, led by our sommelier. Discover exotic flavours and their culinary applications.",
      type_id: "type-5", // Seasonal Experiences
      time_of_day: "Shine",
      activity_date: format(addDays(baseDate, -1), "yyyy-MM-dd"),
      start_time: "10:30:00",
      end_time: "11:30:00",
      location: "Garden Terrace",
      practitioner: "Sommelier Jean",
      equipment: null,
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNE2PTCQ5GRM3FQDX8A8K816.jpg",
      ],
      tags: ["Seasonal", "Tasting", "Farm-to-Table"],
      cta_link: null,
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
    {
      id: "act-30",
      hotel_id: hotel.id,
      title: "Indigo Natural Dyeing",
      description: "Explore the ancient craft of natural dyeing using hand-harvested indigo. Create a unique tie-dye piece to take home as a memorable keepsake.",
      type_id: "type-1", // Culture & Community
      time_of_day: "Rest",
      activity_date: format(addDays(baseDate, -1), "yyyy-MM-dd"),
      start_time: "14:00:00",
      end_time: "16:00:00",
      location: "Arts & Crafts Studio",
      practitioner: "Ibu Ratna",
      equipment: "Apron provided",
      image_urls: [
        "https://workers.paper.design/file-assets/01KNCPBMKCJ7872B3JAWPA47GT/01KNEB6F6K2J5P77YAZZ9K6KG8.jpg",
      ],
      tags: ["Craft", "Cultural", "Souvenir"],
      cta_link: "https://example.com/book/indigo",
      published: true,
      auto_deactivate_at: null,
      created_at: new Date().toISOString(),
    },
  ];

  return { hotel, activityTypes, activities };
}

/**
 * DemoPage
 *
 * Renders the calendar with mock data for demonstration.
 */
export default function DemoPage() {
  const { hotel, activityTypes, activities } = generateMockData();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">Loading Demo Calendar...</div>}>
      <CalendarClientPage
        hotel={hotel}
        activityTypes={activityTypes}
        activities={activities}
      />
    </Suspense>
  );
}
