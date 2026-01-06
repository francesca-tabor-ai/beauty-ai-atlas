import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import PDFDocument from "pdfkit";

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

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // Title
    doc.fontSize(24).font("Helvetica-Bold").text(project.title, { align: "center" });
    doc.moveDown();

    // Category
    if (project.category) {
      doc.fontSize(14).font("Helvetica").fillColor("#666666").text(`Category: ${project.category}`, { align: "center" });
      doc.moveDown();
    }

    // Description
    if (project.description) {
      doc.fontSize(12).font("Helvetica").fillColor("black").text(project.description);
      doc.moveDown(2);
    }

    // User Stories
    if (project.prd.user_stories && project.prd.user_stories.length > 0) {
      doc.fontSize(14).font("Helvetica-Bold").text("User Stories");
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica");
      project.prd.user_stories.forEach((story: string, idx: number) => {
        doc.text(`${idx + 1}. ${story}`);
        doc.moveDown(0.3);
      });
      doc.moveDown();
    }

    // Functional Requirements
    if (project.prd.functional_requirements && project.prd.functional_requirements.length > 0) {
      doc.fontSize(14).font("Helvetica-Bold").text("Functional Requirements");
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica");
      project.prd.functional_requirements.forEach((req: string) => {
        doc.text(`• ${req}`);
        doc.moveDown(0.3);
      });
      doc.moveDown();
    }

    // Non-Functional Requirements
    if (project.prd.non_functional && project.prd.non_functional.length > 0) {
      doc.fontSize(14).font("Helvetica-Bold").text("Non-Functional Requirements");
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica");
      project.prd.non_functional.forEach((req: string) => {
        doc.text(`• ${req}`);
        doc.moveDown(0.3);
      });
      doc.moveDown();
    }

    // Risks
    if (project.prd.risks && project.prd.risks.length > 0) {
      doc.fontSize(14).font("Helvetica-Bold").text("Risks");
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica");
      project.prd.risks.forEach((risk: string | { description: string; severity?: string; mitigation?: string }) => {
        if (typeof risk === "string") {
          doc.text(`• ${risk}`);
        } else {
          doc.text(`• ${risk.description}${risk.severity ? ` (Severity: ${risk.severity})` : ""}`);
          if (risk.mitigation) {
            doc.fontSize(10).fillColor("#666666").text(`  Mitigation: ${risk.mitigation}`, { indent: 20 });
            doc.fillColor("black");
          }
        }
        doc.moveDown(0.3);
      });
      doc.moveDown();
    }

    // Ethics & Compliance
    if (project.prd.ethics_compliance) {
      doc.fontSize(14).font("Helvetica-Bold").text("Ethics & Compliance");
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica");
      if (Array.isArray(project.prd.ethics_compliance)) {
        project.prd.ethics_compliance.forEach((item: string) => {
          doc.text(`• ${item}`);
          doc.moveDown(0.3);
        });
      } else {
        doc.text(project.prd.ethics_compliance);
      }
      doc.moveDown();
    }

    // Metadata
    doc.moveDown();
    doc.fontSize(9).fillColor("#666666").text(`Created: ${new Date(project.created_at).toLocaleDateString()}`);
    if (project.updated_at !== project.created_at) {
      doc.text(`Updated: ${new Date(project.updated_at).toLocaleDateString()}`);
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

