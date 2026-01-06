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
  stepContainer: {
    marginBottom: 15,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 4,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#3b82f6",
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 3,
  },
  stepMeta: {
    fontSize: 9,
    color: "#666",
    marginTop: 3,
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

interface LearningPathDocumentProps {
  path: {
    title: string;
    description: string | null;
    difficulty: string | null;
    duration_hours: number | null;
    steps: Array<{
      order: number;
      entity_type: string;
      entity_slug: string;
      label: string;
    }>;
    created_at: string;
    updated_at: string;
  };
}

function LearningPathDocument({ path }: LearningPathDocumentProps) {
  const difficultyLabels: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{path.title}</Text>
        <View style={{ flexDirection: "row", marginBottom: 20, gap: 10 }}>
          {path.difficulty && (
            <Text style={styles.subtitle}>
              Difficulty: {difficultyLabels[path.difficulty] || path.difficulty}
            </Text>
          )}
          {path.duration_hours && (
            <Text style={styles.subtitle}>
              Duration: {path.duration_hours} hours
            </Text>
          )}
        </View>

        {path.description && (
          <View style={styles.section}>
            <Text style={styles.text}>{path.description}</Text>
          </View>
        )}

        {/* Learning Path Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Path Steps</Text>
          {path.steps
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((step, idx) => (
              <View key={idx} style={styles.stepContainer}>
                <Text style={styles.stepNumber}>
                  Step {step.order || idx + 1}
                </Text>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <Text style={styles.stepMeta}>
                  {step.entity_type.replace(/_/g, " ")} • {step.entity_slug}
                </Text>
              </View>
            ))}
        </View>

        {/* Metadata */}
        <View style={[styles.section, { marginTop: 30 }]}>
          <Text style={styles.metadata}>
            Created: {new Date(path.created_at).toLocaleDateString()}
          </Text>
          {path.updated_at !== path.created_at && (
            <Text style={styles.metadata}>
              Updated: {new Date(path.updated_at).toLocaleDateString()}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pathId: string }> }
) {
  const { pathId } = await params;
  const supabase = await createClient();

  try {
    // Fetch learning path by slug
    const path = await getEntityBySlug(supabase, "learning_paths", pathId);

    if (!path || !path.published) {
      return NextResponse.json(
        { error: "Learning path not found" },
        { status: 404 }
      );
    }

    if (!path.steps || path.steps.length === 0) {
      return NextResponse.json(
        { error: "No steps available for this learning path" },
        { status: 400 }
      );
    }

    // Generate PDF
    const doc = (
      <LearningPathDocument
        path={{
          title: path.title,
          description: path.description,
          difficulty: path.difficulty,
          duration_hours: path.duration_hours,
          steps: path.steps as LearningPathDocumentProps["path"]["steps"],
          created_at: path.created_at,
          updated_at: path.updated_at,
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
        "Content-Disposition": `attachment; filename="${path.slug}-learning-path.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating Learning Path PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate learning path PDF", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

