import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import { EntityHeader } from "@/components/entities/EntityHeader";
import { RelatedContent } from "@/components/graph/RelatedContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Download, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const project = await getEntityBySlug(supabase, "projects", slug);

  if (!project || !project.published) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Beauty × AI Atlas`,
    description:
      project.description ||
      `Learn about ${project.title} and its impact on beauty AI.`,
    openGraph: {
      title: project.title,
      description: project.description || undefined,
      type: "website",
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const project = await getEntityBySlug(supabase, "projects", slug);

  if (!project || !project.published) {
    notFound();
  }

  const maturityLabels: Record<string, string> = {
    concept: "Concept",
    pilot: "Pilot",
    production: "Production",
  };

  const maturityColors: Record<string, string> = {
    concept: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    pilot: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    production: "bg-green-500/10 text-green-700 dark:text-green-400",
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <EntityHeader
          title={project.title}
          category={project.category}
          tags={project.tags}
          createdAt={project.created_at}
          updatedAt={project.updated_at}
        />

        {/* Maturity Badge */}
        {project.maturity && (
          <div className="mt-6">
            <Badge
              className={maturityColors[project.maturity] || ""}
            >
              {maturityLabels[project.maturity] || project.maturity}
            </Badge>
          </div>
        )}

        {/* Description */}
        {project.description && (
          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <p className="text-lg leading-relaxed">{project.description}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          {project.prd && Object.keys(project.prd).length > 0 && (
            <Button variant="outline" asChild>
              <a href={`/api/export/prd/${project.slug}`} download>
                <Download className="mr-2 h-4 w-4" />
                Download PRD
              </a>
            </Button>
          )}
          {project.business_case && (
            <Button variant="outline" asChild>
              <Link href={`/projects/${slug}/playground`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Playground
              </Link>
            </Button>
          )}
        </div>

        {/* Project Documentation */}
        {(project.business_case || project.prd) && (
          <div className="mt-12">
            <Accordion type="multiple" defaultValue={["business-case"]}>
              {/* Business Case Section */}
              {project.business_case &&
                Object.keys(project.business_case).length > 0 && (
                  <AccordionItem value="business-case" title="Business Case">
                    <div className="space-y-6">
                      {/* Problem Statement */}
                      {project.business_case.problem && (
                        <div>
                          <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                            Problem Statement
                          </h3>
                          <p className="text-sm leading-relaxed">
                            {project.business_case.problem}
                          </p>
                        </div>
                      )}

                      {/* Objective */}
                      {project.business_case.objective && (
                        <div>
                          <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                            Objective
                          </h3>
                          <p className="text-sm leading-relaxed">
                            {project.business_case.objective}
                          </p>
                        </div>
                      )}

                      {/* Investment Range */}
                      {(project.business_case.investment_low ||
                        project.business_case.investment_high ||
                        project.business_case.investment_range) && (
                        <div>
                          <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                            Investment Range
                          </h3>
                          {typeof project.business_case.investment_low ===
                            "number" &&
                          typeof project.business_case.investment_high ===
                            "number" ? (
                            <p className="text-sm">
                              $
                              {project.business_case.investment_low.toLocaleString()}{" "}
                              - $
                              {project.business_case.investment_high.toLocaleString()}
                            </p>
                          ) : (
                            <p className="text-sm">
                              {project.business_case.investment_range}
                            </p>
                          )}
                        </div>
                      )}

                      {/* ROI Assumptions */}
                      {project.business_case.roi_assumptions &&
                        (Array.isArray(project.business_case.roi_assumptions) ? (
                          <div>
                            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                              ROI Assumptions
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {project.business_case.roi_assumptions.map(
                                (assumption: string, idx: number) => (
                                  <li key={idx}>{assumption}</li>
                                )
                              )}
                            </ul>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                              ROI Assumptions
                            </h3>
                            <p className="text-sm">
                              {project.business_case.roi_assumptions}
                            </p>
                          </div>
                        ))}

                      {/* KPIs */}
                      {project.business_case.kpis &&
                        project.business_case.kpis.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                              Key Performance Indicators (KPIs)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {project.business_case.kpis.map(
                                (
                                  kpi: string | { name: string; target: string },
                                  idx: number
                                ) => {
                                  if (typeof kpi === "string") {
                                    return (
                                      <Card key={idx}>
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-sm">
                                            {kpi}
                                          </CardTitle>
                                        </CardHeader>
                                      </Card>
                                    );
                                  }
                                  return (
                                    <Card key={idx}>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">
                                          {kpi.name}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-sm font-medium text-primary">
                                          {kpi.target}
                                        </p>
                                      </CardContent>
                                    </Card>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </AccordionItem>
                )}

              {/* PRD Section */}
              {project.prd && Object.keys(project.prd).length > 0 && (
                <AccordionItem value="prd" title="Product Requirements Document (PRD)">
                  <div className="space-y-6">
                    {/* User Stories */}
                    {project.prd.user_stories &&
                      project.prd.user_stories.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                            User Stories
                          </h3>
                          <ol className="list-decimal list-inside space-y-2 text-sm">
                            {project.prd.user_stories.map(
                              (story: string, idx: number) => (
                                <li key={idx} className="leading-relaxed">
                                  {story}
                                </li>
                              )
                            )}
                          </ol>
                        </div>
                      )}

                    {/* Functional Requirements */}
                    {project.prd.functional_requirements &&
                      project.prd.functional_requirements.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                            Functional Requirements
                          </h3>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {project.prd.functional_requirements.map(
                              (req: string, idx: number) => (
                                <li key={idx}>{req}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Non-Functional Requirements */}
                    {project.prd.non_functional &&
                      project.prd.non_functional.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                            Non-Functional Requirements
                          </h3>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {project.prd.non_functional.map(
                              (req: string, idx: number) => (
                                <li key={idx}>{req}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Risks */}
                    {project.prd.risks && project.prd.risks.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                          Risks
                        </h3>
                        <div className="space-y-3">
                          {project.prd.risks.map(
                            (
                              risk:
                                | string
                                | {
                                    description: string;
                                    severity?: string;
                                    mitigation?: string;
                                  },
                              idx: number
                            ) => {
                              if (typeof risk === "string") {
                                return (
                                  <div key={idx} className="text-sm">
                                    • {risk}
                                  </div>
                                );
                              }
                              return (
                                <Card key={idx}>
                                  <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-sm">
                                        {risk.description}
                                      </CardTitle>
                                      {risk.severity && (
                                        <Badge
                                          variant={
                                            risk.severity === "high"
                                              ? "destructive"
                                              : risk.severity === "medium"
                                              ? "default"
                                              : "secondary"
                                          }
                                          className="text-xs"
                                        >
                                          {risk.severity}
                                        </Badge>
                                      )}
                                    </div>
                                  </CardHeader>
                                  {risk.mitigation && (
                                    <CardContent>
                                      <p className="text-xs text-muted-foreground">
                                        <span className="font-medium">
                                          Mitigation:
                                        </span>{" "}
                                        {risk.mitigation}
                                      </p>
                                    </CardContent>
                                  )}
                                </Card>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {/* Ethics & Compliance */}
                    {project.prd.ethics_compliance && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                          Ethics & Compliance
                        </h3>
                        {Array.isArray(project.prd.ethics_compliance) ? (
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {project.prd.ethics_compliance.map(
                              (item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm leading-relaxed">
                            {project.prd.ethics_compliance}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        )}

        {/* Related Content */}
        <div className="mt-12 pt-8 border-t">
          <RelatedContent entityType="projects" entityId={project.id} />
        </div>
      </article>
    </div>
  );
}
