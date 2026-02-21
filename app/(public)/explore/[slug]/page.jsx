"use client";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { CATEGORIES } from "@/lib/data";
import { parseLocationSlug } from "@/lib/location-utils";
import { Loader2 } from "lucide-react";
import { notFound, useParams,useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import React from "react";

const DynamicExplorePage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const categoryInfo = CATEGORIES.find((cat) => cat.id === slug);
  const isCategory = !!categoryInfo;

  const { city, state, isValid } = !isCategory
    ? parseLocationSlug(slug)
    : { city: null, state: null, isvalid: false };

  if (!isCategory && !isValid) {
    notFound();
  }

  const { data: events, isLoading } = useConvexQuery(
    isCategory
      ? api.explore.getEventsByCategory
      : api.explore.getEventsByLocation,
    isCategory
      ? { category: slug, limit: 50 }
      : city && state
        ? { city, state, limit: 50 }
        : "skip",
  );

  const handleEventClick = (eventSlug) => {
    router.push(`/events/${eventSlug}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  if (isCategory) {
    return (
      <>
        <div className="pb-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{categoryInfo.icon}</div>
            <div>
            <h1 className="text-5xl md:text-6xl font-bold">
              {categoryInfo.label}
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              {categoryInfo.description}
            </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <div>dynamic explore page</div>;
};

export default DynamicExplorePage;
