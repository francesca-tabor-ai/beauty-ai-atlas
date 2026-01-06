"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteBrand } from "./actions";

interface DeleteBrandButtonProps {
  brandId: string;
  brandName: string;
}

export function DeleteBrandButton({ brandId, brandName }: DeleteBrandButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${brandName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteBrand(brandId);
    
    if (result?.error) {
      alert(`Error: ${result.error}`);
      setIsDeleting(false);
    } else {
      router.refresh();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

