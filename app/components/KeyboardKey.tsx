import type React from "react";

interface KeyboardKeyProps {
	character: string;
}

const KeyboardKey: React.FC<KeyboardKeyProps> = ({ character }) => {
	return (
		<kbd
			className="inline-flex items-center justify-center mx-1 px-3 py-2.5 text-sm font-semibold text-zinc-900 bg-zinc-100 rounded-lg cursor-pointer select-none
                 border border-zinc-50
                 transition-all duration-50
                 shadow-[inset_0px_-4px_0px_0px_#0000000F,0px_0px_0px_2px_#E5E6E880]
                 active:shadow-[inset_0px_-1px_0px_0px_#0000000F,0px_0px_0px_2px_#E5E6E890] active:translate-y-1 active:bg-zinc-200
                 focus:outline-none"
		>
			{character}
		</kbd>
	);
};

export default KeyboardKey;
