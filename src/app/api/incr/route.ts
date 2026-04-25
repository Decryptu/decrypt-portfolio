import { Redis } from "@upstash/redis";
import { ipAddress } from "@vercel/functions";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

type ViewType = "projects" | "experiments";

function getRedis() {
  if (
    !(
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    )
  ) {
    throw new Error("Upstash Redis env vars are not configured");
  }

  return Redis.fromEnv();
}

function isViewType(type: unknown): type is ViewType {
  return type === "projects" || type === "experiments";
}

function revalidateViewTags(type: ViewType, slug: string) {
  if (type === "projects") {
    revalidateTag(`project-views-${slug}`, "max");
    revalidateTag("projects-views", "max");
    return;
  }

  revalidateTag(`experiment-views-${slug}`, "max");
  revalidateTag("experiments-views", "max");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check content type
    if (!request.headers.get("Content-Type")?.includes("application/json")) {
      return new NextResponse("must be json", {
        status: 400,
      });
    }

    const body = await request.json();
    const slug = body?.slug;
    const type = body?.type;

    if (!slug || typeof slug !== "string") {
      return new NextResponse("Slug not found", { status: 400 });
    }

    if (!isViewType(type)) {
      return new NextResponse("Type not found or invalid", { status: 400 });
    }

    const redis = getRedis();
    const pageviewsKey = ["pageviews", type, slug].join(":");

    const ip = ipAddress(request);
    if (ip) {
      // Hash the IP in order to not store it directly in your db.
      const buf = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(ip)
      );
      const hash = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // deduplicate the ip for each slug
      const isNew = await redis.set(
        ["deduplicate", type, hash, slug].join(":"),
        true,
        {
          nx: true,
          ex: 24 * 60 * 60,
        }
      );

      if (!isNew) {
        const views = (await redis.get<number>(pageviewsKey)) ?? 0;
        return NextResponse.json({ views }, { status: 202 });
      }
    }

    const views = await redis.incr(pageviewsKey);
    revalidateViewTags(type, slug);

    return NextResponse.json({ views }, { status: 202 });
  } catch (error) {
    console.error("Error in incr API:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Handle other methods
export function GET() {
  return new NextResponse("Method not allowed", { status: 405 });
}

export function PUT() {
  return new NextResponse("Method not allowed", { status: 405 });
}

export function DELETE() {
  return new NextResponse("Method not allowed", { status: 405 });
}
