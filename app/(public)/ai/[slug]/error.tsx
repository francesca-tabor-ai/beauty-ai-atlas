"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("AI Specialism page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading AI Specialism</AlertTitle>
          <AlertDescription className="mt-2">
            {error.message || "An unexpected error occurred while loading this AI specialism."}
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-4">
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
          <Button asChild variant="outline">
            <a href="/ai">Back to AI Specialisms</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

