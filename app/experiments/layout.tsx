// app/experiments/layout.tsx
import type React from "react";

interface ExperimentsLayoutProps {
	children: React.ReactNode;
}

const ExperimentsLayout: React.FC<ExperimentsLayoutProps> = ({ children }) => {
	return (
		<main className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900">
			{children}
		</main>
	);
};

export default ExperimentsLayout;
