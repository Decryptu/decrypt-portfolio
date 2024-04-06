import * as LucideIcons from "lucide-react";
import type React from "react";

// Adjust the type to ensure it's recognized as a component
const IconMapper: React.FC<{ name: string; className?: string }> = ({
	name,
	className,
}) => {
	// Ensure the name is a valid key of LucideIcons, or fallback to a default
	const IconComponent = (LucideIcons as any)[name] || LucideIcons.Feather;

	// Check if the IconComponent is valid
	if (!IconComponent) {
		console.warn(`Icon ${name} not found, rendering default.`);
		return null;
	}

	return <IconComponent className={className} />;
};

export default IconMapper;
