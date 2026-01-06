import { UploadForm } from "@/components/admin/UploadForm";
import { uploadBrands } from "./actions";

const exampleBrand = {
  name: "Example Brand",
  slug: "example-brand",
  description: "An example brand description",
  website: "https://example.com",
  logo_url: "https://example.com/logo.png",
  category: "Luxury",
  headquarters: "New York, USA",
  founded_year: 2020,
  tags: ["luxury", "skincare"],
  published: true,
};

export default function UploadBrandsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Brands</h1>
        <p className="text-muted-foreground mt-1">
          Bulk import brands from a JSON or CSV file
        </p>
      </div>

      <UploadForm
        entityType="brands"
        entityLabel="Brands"
        onUpload={uploadBrands}
        exampleJson={exampleBrand}
      />
    </div>
  );
}

