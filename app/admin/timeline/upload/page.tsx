import { UploadForm } from "@/components/admin/UploadForm";
import { uploadTimelineEvents } from "./actions";

const exampleTimelineEvent = {
  title: "EU AI Act Impacts Beauty Tech",
  slug: "eu-ai-act-impacts-beauty-tech",
  year: 2024,
  month: 3,
  description: "EU AI Act comes into effect",
  event_type: "regulation",
  significance: "high",
  tags: ["regulation", "compliance"],
  published: true,
};

export default function UploadTimelineEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Timeline Events</h1>
        <p className="text-muted-foreground mt-1">
          Bulk import timeline events from a JSON or CSV file
        </p>
      </div>

      <UploadForm
        entityType="timeline-events"
        entityLabel="Timeline Events"
        onUpload={uploadTimelineEvents}
        exampleJson={exampleTimelineEvent}
      />
    </div>
  );
}

