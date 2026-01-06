import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import PDFDocument from "pdfkit";

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

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    const difficultyLabels: Record<string, string> = {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    };

    // Title
    doc.fontSize(24).font("Helvetica-Bold").text(path.title, { align: "center" });
    doc.moveDown();

    // Difficulty and Duration
    const metadata: string[] = [];
    if (path.difficulty) {
      metadata.push(`Difficulty: ${difficultyLabels[path.difficulty] || path.difficulty}`);
    }
    if (path.duration_hours) {
      metadata.push(`Duration: ${path.duration_hours} hours`);
    }
    if (metadata.length > 0) {
      doc.fontSize(14).font("Helvetica").fillColor("#666666").text(metadata.join(" • "), { align: "center" });
      doc.moveDown();
    }

    // Description
    if (path.description) {
      doc.fontSize(12).font("Helvetica").fillColor("black").text(path.description);
      doc.moveDown(2);
    }

    // Learning Path Steps
    doc.fontSize(14).font("Helvetica-Bold").text("Learning Path Steps");
    doc.moveDown(0.5);

    const sortedSteps = (path.steps as Array<{
      order: number;
      entity_type: string;
      entity_slug: string;
      label: string;
    }>)
      .filter((step) => step.order && step.entity_type && step.entity_slug)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    sortedSteps.forEach((step, idx) => {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#3b82f6").text(`Step ${step.order || idx + 1}`);
      doc.moveDown(0.3);
      doc.fontSize(11).font("Helvetica").fillColor("black").text(step.label);
      doc.moveDown(0.2);
      doc.fontSize(9).fillColor("#666666").text(`${step.entity_type.replace(/_/g, " ")} • ${step.entity_slug}`);
      doc.moveDown();
    });

    // Metadata
    doc.moveDown();
    doc.fontSize(9).fillColor("#666666").text(`Created: ${new Date(path.created_at).toLocaleDateString()}`);
    if (path.updated_at !== path.created_at) {
      doc.text(`Updated: ${new Date(path.updated_at).toLocaleDateString()}`);
    }

    // Finalize PDF
    doc.end();

    // Wait for PDF to be generated
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const buffers: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);
    });

    return new NextResponse(buffer as unknown as BodyInit, {
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

