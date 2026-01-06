import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateBrand } from "../actions";
import { BrandForm } from "../brand-form";
import { DeleteBrandButton } from "../delete-button";

interface EditBrandPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: brand, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !brand) {
    notFound();
  }

  const updateBrandWithId = async (formData: FormData) => {
    "use server";
    return updateBrand(id, formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Brand</h1>
          <p className="text-muted-foreground mt-1">
            Update brand information
          </p>
        </div>
        <DeleteBrandButton brandId={brand.id} brandName={brand.name} />
      </div>

      <BrandForm action={updateBrandWithId} initialData={brand} />
    </div>
  );
}

