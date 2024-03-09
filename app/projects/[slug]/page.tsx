import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { Redis } from "@upstash/redis";

export const revalidate = 60;

type Props = {
    params: {
        slug: string;
    };
};

const isRedisConfigured = Boolean(process.env.UPSTASH_REDIS_REST_URL);
const redis = isRedisConfigured ? Redis.fromEnv() : null;

export async function generateStaticParams(): Promise<Props["params"][]> {
    return allProjects
        .filter((p) => p.published)
        .map((p) => ({
            slug: p.slug,
        }));
}

export default async function PostPage({ params }: Props) {
    const slug = params?.slug;
    const project = allProjects.find((project) => project.slug === slug);

    if (!project) {
        notFound();
        return; // Ensure the function exits after calling notFound()
    }

    let views = 0; // Default views count for local development

    if (redis) {
        // Safely fetch views from Redis only when it's available
        const fetchedViews = await redis.get<number>(["pageviews", "projects", slug].join(":"));
        views = fetchedViews ?? 0;
    } else {
        // Optionally, log a message to indicate that the views count is mocked in development
        console.log(`Using mock views count for slug: ${slug}`);
    }

    return (
        <div className="bg-zinc-50 min-h-screen">
            <Header project={project} views={views} />
            <ReportView slug={project.slug} />

            <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
                <Mdx code={project.body.code} />
            </article>
        </div>
    );
}
