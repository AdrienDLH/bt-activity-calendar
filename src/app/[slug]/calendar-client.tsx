/**
 * CALENDAR CLIENT PAGE COMPONENT
 *
 * Client-side interactive wrapper for the calendar page.
 * Handles all user interactions: filtering, tab switching, modals.
 *
 * TAB LAYOUT:
 * - List    → All activities in chronological order (filters active here)
 * - Weekly  → 7-column × 4 time-of-day matrix view (no filters)
 * - Monthly → Calendar grid with activity lists per day (no filters)
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CalendarHeader,
  HeroBanner,
  FilterBar,
  WeekView,
  MonthView,
  WeeklyTableView,
  ActivityDetailModal,
  PrivateSessionFab,
  PrivateSessionModal,
} from "@/components/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Hotel, Activity, ActivityType, TimeOfDay } from "@/types/database";

interface CalendarClientPageProps {
  /** Hotel data for branding */
  hotel: Hotel;
  /** Available activity types for filtering */
  activityTypes: ActivityType[];
  /** Activities to display */
  activities: Activity[];
}

/**
 * CalendarClientPage
 *
 * Main interactive calendar component.
 * Manages all client-side state and user interactions.
 */
export function CalendarClientPage({
  hotel,
  activityTypes,
  activities,
}: CalendarClientPageProps) {
  // ========================================
  // STATE MANAGEMENT
  // ========================================

  // Active tab: "list" | "weekly" | "monthly"
  const [activeTab, setActiveTab] = useState<string>("list");

  // Filter state — applies to the List tab only
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<TimeOfDay[]>([]);

  // Modal state
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  // ========================================
  // COMPUTED VALUES
  // ========================================

  /** Map of activity type ID → ActivityType for quick lookup */
  const activityTypesMap = useMemo(() => {
    return new Map(activityTypes.map((type) => [type.id, type]));
  }, [activityTypes]);

  /**
   * Filtered activities — used only by the List tab.
   * Weekly and Monthly receive the full unfiltered list so their
   * own structure (time-of-day rows / calendar grid) stays intact.
   */
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(activity.type_id)) return false;
      if (
        selectedTimes.length > 0 &&
        activity.time_of_day &&
        !selectedTimes.includes(activity.time_of_day)
      )
        return false;
      return true;
    });
  }, [activities, selectedTypes, selectedTimes]);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handleTypeChange = useCallback((typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  }, []);

  const handleTimeChange = useCallback((time: TimeOfDay) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedTypes([]);
    setSelectedTimes([]);
  }, []);

  const handleActivityClick = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    // Delay clearing selection for exit animation
    setTimeout(() => setSelectedActivity(null), 300);
  }, []);

  const handleRequestSession = useCallback(() => {
    setIsSessionModalOpen(true);
  }, []);

  const handleCloseSessionModal = useCallback(() => {
    setIsSessionModalOpen(false);
  }, []);

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header with hotel branding */}
      <CalendarHeader hotel={hotel} onRequestSession={handleRequestSession} />

      {/* ========================================
          TABS ROOT wraps both the hero and the main content
          so that TabsList (inside HeroBanner) and TabsContent
          (in main) share the same Radix context.
          ======================================== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

        {/* Hero banner — tab switcher lives in the right slot */}
        <HeroBanner hotelName={hotel.name}>
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </HeroBanner>

        {/* Main content */}
        <main className="container mx-auto px-4 pt-0 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* ----------------------------------------
                FILTERS — List tab only
                Weekly structures by time-of-day rows.
                Monthly structures by calendar date.
                Neither benefits from the filter bar.
                ---------------------------------------- */}
            {activeTab === "list" && (
              <div className="flex items-end justify-between gap-4 mb-4 overflow-hidden">
                {/* min-w-0 prevents the flex item from overflowing its container */}
                <div className="min-w-0 flex-1">
                <FilterBar
                  activityTypes={activityTypes}
                  selectedTypes={selectedTypes}
                  selectedTimes={selectedTimes}
                  onTypeChange={handleTypeChange}
                  onTimeChange={handleTimeChange}
                  onClearFilters={handleClearFilters}
                />
                </div>
                {/* Right column: Clear filters (top) + activity count (bottom) */}
                <div className="flex flex-col items-end gap-2 shrink-0 pb-4">
                  {(selectedTypes.length > 0 || selectedTimes.length > 0) && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleClearFilters}
                      className="text-sm text-[#A7ABA1] hover:text-[#85754E] transition-colors"
                    >
                      Clear filters
                    </motion.button>
                  )}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-[#153E35]"
                  >
                    Showing{" "}
                    <span className="font-medium text-[#153E35]">
                      {filteredActivities.length}
                    </span>{" "}
                    activit{filteredActivities.length === 1 ? "y" : "ies"}
                  </motion.p>
                </div>
              </div>
            )}

            {/* ========================================
                LIST TAB
                All activities in chronological order
                ======================================== */}
            <TabsContent value="list">
              <WeekView
                activities={filteredActivities}
                activityTypesMap={activityTypesMap}
                onActivityClick={handleActivityClick}
              />
            </TabsContent>

            {/* ========================================
                WEEKLY TAB
                7-column × 4 time-of-day matrix
                ======================================== */}
            <TabsContent value="weekly">
              <WeeklyTableView
                activities={activities}
                activityTypesMap={activityTypesMap}
                onActivityClick={handleActivityClick}
              />
            </TabsContent>

            {/* ========================================
                MONTHLY TAB
                Calendar grid with per-day activity lists
                ======================================== */}
            <TabsContent value="monthly">
              <MonthView
                activities={activities}
                activityTypesMap={activityTypesMap}
                onActivityClick={handleActivityClick}
              />
            </TabsContent>

          </motion.div>
        </main>

      </Tabs>

      {/* Floating Action Button — mobile only */}
      <PrivateSessionFab onClick={handleRequestSession} />

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          activityType={activityTypesMap.get(selectedActivity.type_id)}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
        />
      )}

      {/* Private Session Request Modal */}
      <PrivateSessionModal
        isOpen={isSessionModalOpen}
        onClose={handleCloseSessionModal}
        hotel={hotel}
        activityTypes={activityTypes}
      />
    </div>
  );
}
