import { Redis } from "@upstash/redis";
import { type NextRequest, NextResponse } from "next/server";
import { experiments, projects } from "#site/content";
import { shouldUseRedis } from "@/lib/redis-guard";

type ViewType = "projects" | "experiments";

function isViewType(type: string | null): type is ViewType {
  return type === "projects" || type === "experiments";
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const type = request.nextUrl.searchParams.get("type");

  if (!isViewType(type)) {
    return NextResponse.json(
      { error: "Type not found or invalid" },
      { status: 400 }
    );
  }

  const entries = type === "projects" ? projects : experiments;
  const emptyViews = Object.fromEntries(
    entries.map((entry) => [entry.slugAsParams, 0])
  );

  if (!shouldUseRedis()) {
    return NextResponse.json(emptyViews, { headers: noStoreHeaders });
  }

  try {
    const redis = Redis.fromEnv();
    const values = await redis.mget<number[]>(
      ...entries.map((entry) =>
        ["pageviews", type, entry.slugAsParams].join(":")
      )
    );

    const views = values.reduce<Record<string, number>>(
      (result, value, index) => {
        result[entries[index].slugAsParams] = value ?? 0;
        return result;
      },
      {}
    );

    return NextResponse.json(views, { headers: noStoreHeaders });
  } catch (error) {
    console.error(`Failed to fetch ${type} views from Redis:`, error);
    return NextResponse.json(emptyViews, { headers: noStoreHeaders });
  }
}

const noStoreHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
};
