// app/experiments/[slug]/view.tsx
"use client";

import { useEffect } from "react";

export const ReportView: React.FC<{ slug: string }> = ({ slug }) => {
	useEffect(() => {
		fetch("/api/incr", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ 
				slug,
				type: "experiments" // Add type to distinguish from projects
			}),
		}).catch((error) => {
			console.error("Failed to report view:", error);
		});
	}, [slug]);

	return null;
};