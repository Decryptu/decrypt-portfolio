import { Redis } from "@upstash/redis";
import { allExperiments } from "contentlayer/generated";
import React from "react";
import { Card } from "../components/card";
import { Article } from "./article";

// Determine if we're in a production environment
const isProduction = process.env.NODE_ENV === "production";

// Initialize Redis only if in a production environment
const redis = isProduction ? Redis.fromEnv() : null;

export const revalidate = 60;

// Define a type for the views object
type ViewsType = {
  [key: string]: number;
};

export default async function ExperimentsPage() {
  let views: ViewsType; // Use the ViewsType for the views object

  if (redis) {
    try {
      const viewsData = await redis.mget<number[]>(
        ...allExperiments.map((p) =>
          ["pageviews", "projects", p.slug].join(":")
        )
      );
      views = viewsData.reduce((acc: ViewsType, v, i) => {
        acc[allExperiments[i].slug] = v ?? 0;
        return acc;
      }, {});
    } catch (error) {
      console.error("Failed to fetch views from Redis:", error);
      // Fallback or default views handling
      views = allExperiments.reduce((acc: ViewsType, experiment) => {
        acc[experiment.slug] = 0; // Fallback to 0 views in case of error
        return acc;
      }, {});
    }
  } else {
    // Mocked views for development
    views = allExperiments.reduce((acc: ViewsType, experiment) => {
      acc[experiment.slug] = 0; // Or use a mock value as needed
      return acc;
    }, {});
  }

  // Sort all experiments by published date
  const sortedExperiments = allExperiments
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    );

  return (
    <div className="relative pb-16">
      <div className="p-6 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-12 lg:pt-16">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Laboratory
          </h2>
          <p className="mt-4 text-zinc-400">
            Explore this section for code snippets focused on cool UI designs,
            primarily using React, NextJS, and Tailwind CSS.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />
        <div className="grid grid-cols-1 gap-4 mx-auto md:grid-cols-3 lg:mx-0">
          {[0, 1, 2].map((column) => (
            <div key={column} className="grid grid-cols-1 gap-4">
              {sortedExperiments
                .filter((_, i) => i % 3 === column)
                .map((experiment) => (
                  <Card key={experiment.slug}>
                    <Article
                      experiment={experiment}
                      views={views[experiment.slug] ?? 0}
                    />
                  </Card>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
