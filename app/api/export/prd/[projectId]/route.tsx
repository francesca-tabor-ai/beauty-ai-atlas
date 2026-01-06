import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { renderToStream } from "@react-pdf/renderer";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 15,
    borderBottom: "1px solid #ccc",
    paddingBottom: 5,
  },
  listItem: {
    marginBottom: 5,
    marginLeft: 20,
  },
  text: {
    marginBottom: 8,
    lineHeight: 1.5,
  },
  metadata: {
    fontSize: 9,
    color: "#666",
    marginBottom: 5,
  },
});

interface PRDDocumentProps {
  project: {
    title: string;
    description: string | null;
    category: string | null;
    prd: {
      user_stories?: string[];
      functional_requirements?: string[];
      non_functional?: string[];
      risks?: Array<string | { description: string; severity?: string; mitigation?: string }>;
      ethics_compliance?: string | string[];
    };
    created_at: string;
    updated_at: string;
  };
}

function PRDDocument({ project }: PRDDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{project.title}</Text>
        {project.category && (
          <Text style={styles.subtitle}>Category: {project.category}</Text>
        )}
        {project.description && (
          <View style={styles.section}>
            <Text style={styles.text}>{project.description}</Text>
          </View>
        )}

        {/* User Stories */}
        {project.prd.user_stories && project.prd.user_stories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Stories</Text>
            {project.prd.user_stories.map((story, idx) => (
              <Text key={idx} style={styles.listItem}>
                {idx + 1}. {story}
              </Text>
            ))}
          </View>
        )}

        {/* Functional Requirements */}
        {project.prd.functional_requirements &&
          project.prd.functional_requirements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Functional Requirements</Text>
              {project.prd.functional_requirements.map((req, idx) => (
                <Text key={idx} style={styles.listItem}>
                  • {req}
                </Text>
              ))}
            </View>
          )}

        {/* Non-Functional Requirements */}
        {project.prd.non_functional && project.prd.non_functional.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Non-Functional Requirements</Text>
            {project.prd.non_functional.map((req, idx) => (
              <Text key={idx} style={styles.listItem}>
                • {req}
              </Text>
            ))}
          </View>
        )}

        {/* Risks */}
        {project.prd.risks && project.prd.risks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risks</Text>
            {project.prd.risks.map((risk, idx) => {
              if (typeof risk === "string") {
                return (
                  <Text key={idx} style={styles.listItem}>
                    • {risk}
                  </Text>
                );
              }
              return (
                <View key={idx} style={{ marginBottom: 8, marginLeft: 20 }}>
                  <Text style={styles.text}>
                    • {risk.description}
                    {risk.severity && ` (Severity: ${risk.severity})`}
                  </Text>
                  {risk.mitigation && (
                    <Text style={[styles.text, { marginLeft: 10, fontSize: 10, color: "#666" }]}>
                      Mitigation: {risk.mitigation}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Ethics & Compliance */}
        {project.prd.ethics_compliance && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ethics & Compliance</Text>
            {Array.isArray(project.prd.ethics_compliance) ? (
              project.prd.ethics_compliance.map((item, idx) => (
                <Text key={idx} style={styles.listItem}>
                  • {item}
                </Text>
              ))
            ) : (
              <Text style={styles.text}>{project.prd.ethics_compliance}</Text>
            )}
          </View>
        )}

        {/* Metadata */}
        <View style={[styles.section, { marginTop: 30 }]}>
          <Text style={styles.metadata}>
            Created: {new Date(project.created_at).toLocaleDateString()}
          </Text>
          {project.updated_at !== project.created_at && (
            <Text style={styles.metadata}>
              Updated: {new Date(project.updated_at).toLocaleDateString()}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const supabase = await createClient();

  try {
    // Fetch project by slug
    const project = await getEntityBySlug(supabase, "projects", projectId);

    if (!project || !project.published) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (!project.prd || Object.keys(project.prd).length === 0) {
      return NextResponse.json(
        { error: "PRD not available for this project" },
        { status: 400 }
      );
    }

    // Generate PDF
    const doc = (
      <PRDDocument
        project={{
          title: project.title,
          description: project.description,
          category: project.category,
          prd: project.prd as PRDDocumentProps["project"]["prd"],
          created_at: project.created_at,
          updated_at: project.updated_at,
        }}
      />
    );

    const stream = await renderToStream(doc);
    const chunks: Uint8Array[] = [];
    
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${project.slug}-prd.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PRD PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PRD", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

