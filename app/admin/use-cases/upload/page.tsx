import { UploadForm } from "@/components/admin/UploadForm";
import { uploadUseCases } from "./actions";

const exampleUseCase = {
  title: "AI-Powered Skin Analysis",
  slug: "ai-powered-skin-analysis",
  description: "Automated skin condition assessment using AI",
  category: "diagnostic",
  maturity_level: "growing",
  impact_score: 8,
  tags: ["computer-vision", "healthcare"],
  published: true,
};

export default function UploadUseCasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Use Cases</h1>
        <p className="text-muted-foreground mt-1">
          Bulk import use cases from a JSON or CSV file
        </p>
      </div>

      <UploadForm
        entityType="use-cases"
        entityLabel="Use Cases"
        onUpload={uploadUseCases}
        exampleJson={exampleUseCase}
      />
    </div>
  );
}

