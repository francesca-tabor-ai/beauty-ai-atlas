import { createClient } from "@/lib/supabase/server";
import { getPublishedEntities } from "@/lib/supabase/queries";
import { RelatedContent } from "@/components/graph/RelatedContent";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/entities/EmptyState";
import { isAdmin } from "@/lib/auth/isAdmin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default async function TimelinePage() {
  const supabase = await createClient();
  const userIsAdmin = await isAdmin();

  // Fetch all published timeline events ordered by year DESC, month DESC
  const events = await getPublishedEntities(supabase, "timeline_events", {
    published: true,
    orderBy: "year",
    orderDirection: "desc",
  });

  // Sort by year DESC, then month DESC (null months go last)
  const sortedEvents = [...events].sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year; // DESC
    }
    // If year is same, sort by month DESC (null months go last)
    if (a.month === null && b.month === null) return 0;
    if (a.month === null) return 1;
    if (b.month === null) return -1;
    return b.month - a.month; // DESC
  });

  // Group events by year for year markers
  type TimelineEventType = (typeof sortedEvents)[0];
  const eventsByYear = sortedEvents.reduce(
    (acc: Record<number, TimelineEventType[]>, event: TimelineEventType) => {
      if (!acc[event.year]) {
        acc[event.year] = [];
      }
      acc[event.year].push(event);
      return acc;
    },
    {} as Record<number, TimelineEventType[]>
  );

  const eventTypeLabels: Record<string, string> = {
    technology: "Technology",
    regulation: "Regulation",
    market: "Market",
    cultural: "Cultural",
  };

  const eventTypeColors: Record<string, string> = {
    technology: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    regulation: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    market: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    cultural: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  };

  const significanceColors: Record<string, string> = {
    low: "bg-gray-200 dark:bg-gray-700",
    medium: "bg-gray-300 dark:bg-gray-600",
    high: "bg-gray-400 dark:bg-gray-500",
    critical: "bg-gray-600 dark:bg-gray-400",
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (sortedEvents.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Timeline</h1>
          <p className="text-muted-foreground">
            Explore key events and milestones in beauty AI
          </p>
        </div>
        <EmptyState
          title="No timeline events found"
          description="Timeline events will appear here once they are published."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Timeline</h1>
          <p className="text-muted-foreground text-lg">
            Evolution of AI in Beauty — Key events and milestones
          </p>
        </div>
        {userIsAdmin && (
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/timeline/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Timeline Events
            </Link>
          </Button>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line (desktop only) */}
        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-12">
          {Object.entries(eventsByYear)
            .sort(([a], [b]) => Number(b) - Number(a)) // Sort years DESC
            .map(([year, yearEvents]) => (
              <div key={year} className="relative">
                {/* Year Marker */}
                <div className="sticky top-8 z-10 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="hidden md:block w-16 text-right">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {year}
                      </div>
                    </div>
                    <div className="md:hidden">
                      <h2 className="text-3xl font-bold">{year}</h2>
                    </div>
                    <div className="hidden md:block flex-1">
                      <h2 className="text-3xl font-bold">{year}</h2>
                      <div className="h-0.5 bg-border mt-2" />
                    </div>
                  </div>
                </div>

                {/* Events for this year */}
                <div className="space-y-8 md:ml-24">
                  {yearEvents.map((event) => (
                    <div key={event.id} className="relative">
                      {/* Mobile: Simple card layout */}
                      <div className="md:hidden">
                        <Card>
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">
                                  {event.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                  {event.month && (
                                    <span>{monthNames[event.month - 1]}</span>
                                  )}
                                  <span>{event.year}</span>
                                </div>
                              </div>
                              {event.event_type && (
                                <Badge
                                  variant="outline"
                                  className={eventTypeColors[event.event_type]}
                                >
                                  {eventTypeLabels[event.event_type] ||
                                    event.event_type}
                                </Badge>
                              )}
                            </div>
                            {event.significance && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  Significance:
                                </span>
                                <div className="flex gap-1">
                                  {["low", "medium", "high", "critical"].map(
                                    (level) => (
                                      <div
                                        key={level}
                                        className={`h-2 w-2 rounded-full ${
                                          level === event.significance
                                            ? significanceColors[level]
                                            : "bg-muted"
                                        }`}
                                        aria-hidden="true"
                                      />
                                    )
                                  )}
                                </div>
                                <span className="text-xs capitalize">
                                  {event.significance}
                                </span>
                              </div>
                            )}
                          </CardHeader>
                          <CardContent>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mb-4">
                                {event.description}
                              </p>
                            )}
                            <RelatedContent
                              entityType="timeline_events"
                              entityId={event.id}
                            />
                          </CardContent>
                        </Card>
                      </div>

                      {/* Desktop: Two-column layout */}
                      <div className="hidden md:grid md:grid-cols-12 gap-6">
                        {/* Left column: Date + Badge */}
                        <div className="col-span-3">
                          <div className="sticky top-8">
                            <div className="text-sm font-medium text-muted-foreground mb-2">
                              {event.month
                                ? `${monthNames[event.month - 1]} ${event.year}`
                                : event.year}
                            </div>
                            {event.event_type && (
                              <Badge
                                variant="outline"
                                className={`${eventTypeColors[event.event_type]} mb-2`}
                              >
                                {eventTypeLabels[event.event_type] ||
                                  event.event_type}
                              </Badge>
                            )}
                            {event.significance && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {event.significance}
                                </span>
                                <div className="flex gap-1">
                                  {["low", "medium", "high", "critical"].map(
                                    (level) => (
                                      <div
                                        key={level}
                                        className={`h-1.5 w-1.5 rounded-full ${
                                          level === event.significance
                                            ? significanceColors[level]
                                            : "bg-muted"
                                        }`}
                                        aria-hidden="true"
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right column: Content */}
                        <div className="col-span-9">
                          <Card>
                            <CardHeader>
                              <h3 className="text-xl font-semibold">
                                {event.title}
                              </h3>
                            </CardHeader>
                            <CardContent>
                              {event.description && (
                                <p className="text-muted-foreground mb-6">
                                  {event.description}
                                </p>
                              )}
                              <RelatedContent
                                entityType="timeline_events"
                                entityId={event.id}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
