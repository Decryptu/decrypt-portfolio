"use client";

import { useEffect, useState } from "react";

type ViewType = "projects" | "experiments";
type Views = Record<string, number>;

const viewRequests = new Map<ViewType, Promise<Views>>();

function getViews(type: ViewType): Promise<Views> {
  const cachedRequest = viewRequests.get(type);
  if (cachedRequest) {
    return cachedRequest;
  }

  const request = fetch(`/api/views?type=${type}`, { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} views`);
      }
      return (await response.json()) as Views;
    })
    .catch((error) => {
      viewRequests.delete(type);
      throw error;
    });

  viewRequests.set(type, request);
  return request;
}

interface Props {
  slug: string;
  type: ViewType;
}

export function ViewCount({ slug, type }: Props) {
  const [views, setViews] = useState(0);

  useEffect(() => {
    let ignore = false;

    getViews(type)
      .then((data) => {
        if (!ignore) {
          setViews(data[slug] ?? 0);
        }
      })
      .catch(() => {
        // Keep the static fallback at zero when analytics are unavailable.
      });

    return () => {
      ignore = true;
    };
  }, [slug, type]);

  return Intl.NumberFormat("en-US", { notation: "compact" }).format(views);
}
