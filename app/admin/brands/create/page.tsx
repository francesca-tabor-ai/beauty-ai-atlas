import { createBrand, generateSlug } from "../actions";
import { BrandForm } from "../brand-form";

export default function CreateBrandPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Brand</h1>
        <p className="text-muted-foreground mt-1">
          Add a new brand to the Beauty × AI Atlas
        </p>
      </div>

      <BrandForm action={createBrand} />
    </div>
  );
}

