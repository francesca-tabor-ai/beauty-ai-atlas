"use client";

import { useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

interface UploadFormProps {
  entityType: string;
  entityLabel: string;
  onUpload: (data: unknown[]) => Promise<{ success: boolean; message: string; errors?: string[] }>;
  exampleJson?: Record<string, unknown>;
}

export function UploadForm({ entityType, entityLabel, onUpload, exampleJson }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; errors?: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const text = await file.text();
      let data: unknown[];

      // Try to parse as JSON
      try {
        const parsed = JSON.parse(text);
        data = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // If not JSON, try CSV
        data = parseCSV(text);
      }

      const uploadResult = await onUpload(data);
      setResult(uploadResult);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to process file",
      });
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (csvText: string): unknown[] => {
    const lines = csvText.split("\n").filter((line) => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    const rows: unknown[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      rows.push(row);
    }

    return rows;
  };

  const downloadExample = () => {
    if (!exampleJson) return;
    const jsonStr = JSON.stringify([exampleJson], null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entityType}-example.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload {entityLabel}</CardTitle>
        <CardDescription>
          Upload a JSON or CSV file to bulk import {entityLabel.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">File (JSON or CSV)</Label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium"
                required
              />
              {exampleJson && (
                <Button type="button" variant="outline" onClick={downloadExample}>
                  <FileText className="mr-2 h-4 w-4" />
                  Download Example
                </Button>
              )}
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>
                {result.message}
                {result.errors && result.errors.length > 0 && (
                  <ul className="mt-2 list-disc list-inside">
                    {result.errors.map((error, idx) => (
                      <li key={idx} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={!file || loading} className="w-full">
            {loading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {entityLabel}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

