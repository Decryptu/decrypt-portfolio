import type React from "react";

interface KeyboardKeyProps {
  character: string;
}

const KeyboardKey: React.FC<KeyboardKeyProps> = ({ character }) => (
  <kbd className="mx-1 inline-flex cursor-pointer select-none items-center justify-center rounded-lg border border-zinc-50 bg-zinc-100 px-3 py-2.5 font-semibold text-sm text-zinc-900 shadow-[inset_0px_-4px_0px_0px_#0000000F,0px_0px_0px_2px_#E5E6E880] transition-all duration-50 focus:outline-none active:translate-y-1 active:bg-zinc-200 active:shadow-[inset_0px_-1px_0px_0px_#0000000F,0px_0px_0px_2px_#E5E6E890]">
    {character}
  </kbd>
);

export default KeyboardKey;
