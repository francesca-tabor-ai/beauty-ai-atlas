import { UploadForm } from "@/components/admin/UploadForm";
import { uploadJobRoles } from "./actions";

const exampleJobRole = {
  title: "AI Product Manager",
  slug: "ai-product-manager",
  description: "Manages AI-powered beauty products",
  department: "Product",
  seniority_level: "Mid-level",
  ai_impact_level: "high",
  emerging: true,
  skills_required: ["machine-learning", "product-management"],
  tags: ["ai", "product"],
  published: true,
};

export default function UploadJobRolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Job Roles</h1>
        <p className="text-muted-foreground mt-1">
          Bulk import job roles from a JSON or CSV file
        </p>
      </div>

      <UploadForm
        entityType="job-roles"
        entityLabel="Job Roles"
        onUpload={uploadJobRoles}
        exampleJson={exampleJobRole}
      />
    </div>
  );
}

