import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: {} }, { status: 200 });
  }

  const supabase = await createClient();

  try {
    // Call the search_all_entities function
    const { data, error } = await supabase.rpc("search_all_entities", {
      search_term: query.trim(),
    });

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json(
        { error: "Search failed", message: error.message },
        { status: 500 }
      );
    }

    // Group results by entity type
    const grouped: Record<
      string,
      Array<{ id: string; title: string; slug: string; rank: number }>
    > = {};

    if (data) {
      for (const result of data) {
        const entityType = result.entity_type;
        if (!grouped[entityType]) {
          grouped[entityType] = [];
        }
        grouped[entityType].push({
          id: result.entity_id,
          title: result.title,
          slug: result.slug,
          rank: result.rank,
        });
      }
    }

    return NextResponse.json({ results: grouped }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

