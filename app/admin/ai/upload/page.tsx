import { UploadForm } from "@/components/admin/UploadForm";
import { uploadAISpecialisms } from "./actions";

const exampleAISpecialism = {
  name: "Computer Vision",
  slug: "computer-vision",
  description: "AI systems that interpret visual data",
  category: "computer_vision",
  maturity_timeline: {
    "2020": "deep-learning",
    "2023": "multimodal-vision"
  },
  tags: ["image-analysis", "facial-recognition"],
  published: true,
};

export default function UploadAISpecialismsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload AI Specialisms</h1>
        <p className="text-muted-foreground mt-1">
          Bulk import AI specialisms from a JSON or CSV file
        </p>
      </div>

      <UploadForm
        entityType="ai-specialisms"
        entityLabel="AI Specialisms"
        onUpload={uploadAISpecialisms}
        exampleJson={exampleAISpecialism}
      />
    </div>
  );
}

