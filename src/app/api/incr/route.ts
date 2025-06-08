import { Redis } from "@upstash/redis";
import { ipAddress } from "@vercel/functions";
import { type NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

export const runtime = "edge";

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		// Check content type
		if (request.headers.get("Content-Type") !== "application/json") {
			return new NextResponse("must be json", {
				status: 400,
			});
		}

		const body = await request.json();
		const slug = body?.slug;

		if (!slug || typeof slug !== "string") {
			return new NextResponse("Slug not found", {
				status: 400,
			});
		}

		const ip = ipAddress(request);
		if (ip) {
			// Hash the IP in order to not store it directly in your db.
			const buf = await crypto.subtle.digest(
				"SHA-256",
				new TextEncoder().encode(ip),
			);
			const hash = Array.from(new Uint8Array(buf))
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");

			// deduplicate the ip for each slug
			const isNew = await redis.set(["deduplicate", hash, slug].join(":"), true, {
				nx: true,
				ex: 24 * 60 * 60,
			});

			if (!isNew) {
				return new NextResponse(null, { status: 202 });
			}
		}

		await redis.incr(["pageviews", "projects", slug].join(":"));
		return new NextResponse(null, { status: 202 });
	} catch (error) {
		console.error("Error in incr API:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

// Handle other methods
export async function GET() {
	return new NextResponse("Method not allowed", { status: 405 });
}

export async function PUT() {
	return new NextResponse("Method not allowed", { status: 405 });
}

export async function DELETE() {
	return new NextResponse("Method not allowed", { status: 405 });
}
