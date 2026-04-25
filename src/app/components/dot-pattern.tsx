import clsx from "clsx";
import { type SVGProps, useId } from "react";

interface DotPatternProps extends SVGProps<SVGSVGElement> {
  className?: string;
  cr?: number;
  cx?: number;
  cy?: number;
  height?: number;
  width?: number;
  x?: number;
  y?: number;
}

export const DotPattern = ({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}: DotPatternProps) => {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/80",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          height={height}
          id={id}
          patternContentUnits="userSpaceOnUse"
          patternUnits="userSpaceOnUse"
          width={width}
          x={x}
          y={y}
        >
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect fill={`url(#${id})`} height="100%" width="100%" />
    </svg>
  );
};

export default DotPattern;
