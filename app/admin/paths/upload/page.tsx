import { UploadForm } from "@/components/admin/UploadForm";
import { uploadLearningPaths } from "./actions";

const exampleLearningPath = {
  title: "AI in Beauty: Fundamentals",
  slug: "ai-beauty-fundamentals",
  description: "Introduction to AI in beauty industry",
  difficulty: "beginner",
  duration_hours: 8,
  steps: [
    {
      order: 1,
      entity_type: "use_cases",
      entity_slug: "virtual-try-on",
      label: "Understand Virtual Try-On"
    }
  ],
  tags: ["foundations", "beginner"],
  published: true,
};

export default function UploadLearningPathsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Learning Paths</h1>
        <p className="text-muted-foreground mt-1">
          Bulk import learning paths from a JSON or CSV file
        </p>
      </div>

      <UploadForm
        entityType="learning-paths"
        entityLabel="Learning Paths"
        onUpload={uploadLearningPaths}
        exampleJson={exampleLearningPath}
      />
    </div>
  );
}

