import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import { ROICalculator } from "@/components/projects/ROICalculator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface PlaygroundPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PlaygroundPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const project = await getEntityBySlug(supabase, "projects", slug);

  if (!project || !project.published) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} - ROI Playground | Beauty × AI Atlas`,
    description: `Interactive ROI calculator for ${project.title}`,
  };
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const project = await getEntityBySlug(supabase, "projects", slug);

  if (!project || !project.published) {
    notFound();
  }

  // Extract investment range from business_case
  const businessCase = project.business_case as
    | {
        investment_low?: number;
        investment_high?: number;
        investment_range?: string;
      }
    | null
    | undefined;

  const investmentLow = businessCase?.investment_low;
  const investmentHigh = businessCase?.investment_high;
  const investmentRange = businessCase?.investment_range;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/projects/${slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
          <h2 className="text-2xl text-muted-foreground">ROI Playground</h2>
          <p className="mt-4 text-muted-foreground">
            Model ROI assumptions interactively. Adjust the sliders below to see
            how different assumptions impact the business case.
          </p>
        </div>

        {/* ROI Calculator */}
        <ROICalculator
          investmentLow={investmentLow}
          investmentHigh={investmentHigh}
          investmentRange={investmentRange}
        />

        {/* Info Section */}
        <div className="mt-12 p-6 rounded-lg border bg-muted/30">
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Incremental Revenue:</strong> Additional revenue from
              improved conversion rates and higher average order values.
            </p>
            <p>
              <strong>Cost Savings:</strong> Savings from reduced return rates,
              which decrease the cost of processing returns and restocking.
            </p>
            <p>
              <strong>Payback Period:</strong> Time (in months) to recover the
              initial investment based on monthly benefits.
            </p>
            <p>
              <strong>ROI:</strong> Return on investment percentage, calculated
              as (Total Benefit - Investment) / Investment × 100.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

