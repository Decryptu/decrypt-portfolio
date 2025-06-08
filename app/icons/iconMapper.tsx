import { icons, type LucideIcon } from "lucide-react";
import type React from "react";

interface IconMapperProps {
	name: string;
	className?: string;
}

const IconMapper: React.FC<IconMapperProps> = ({ name, className }) => {
	// Use the icons object from lucide-react which contains all icons
	const IconComponent = icons[name as keyof typeof icons] as LucideIcon;

	// Check if the icon exists
	if (!IconComponent) {
		console.warn(`Icon "${name}" not found in Lucide icons, using default Feather icon.`);
		// Use icons.Feather as fallback
		const FallbackIcon = icons.Feather;
		return <FallbackIcon className={className} />;
	}

	return <IconComponent className={className} />;
};

export default IconMapper;