import Image from "next/image";

interface Pair {
  readonly id: string;
  readonly label: string;
}

const PAIRS: readonly Pair[] = [
  { id: "thumb-1", label: "News article thumbnail" },
  { id: "thumb-2", label: "Guide thumbnail" },
  { id: "thumb-3", label: "Market update thumbnail" },
  { id: "thumb-4", label: "Project review thumbnail" },
] as const;

interface Stat {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

const STATS: readonly Stat[] = [
  { id: "cost-before", value: "€4,000/yr", label: "Before, with stock photos" },
  { id: "cost-after", value: "~€300/yr", label: "After, bot + API costs" },
  { id: "time", value: "~5 min/article", label: "Editor time saved" },
  { id: "satisfaction", value: "Editor-approved", label: "Quality preserved" },
] as const;

export const CaseStudy: React.FC = () => (
  <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm text-zinc-400 uppercase tracking-wide">
        Case study
      </p>
      <h2 className="mt-2 font-bold font-display text-3xl text-zinc-100 tracking-tight sm:text-4xl">
        Cryptoast: thumbnails on autopilot
      </h2>
      <p className="mt-4 text-zinc-400">
        A Discord bot. Editors paste a title, get back an optimized thumbnail in
        WebP, watermarked, SEO-named, compressed, correct dimensions. Same look,
        zero stock library subscription.
      </p>
    </div>

    <div className="mt-10 grid gap-4 md:grid-cols-4">
      {STATS.map((stat) => (
        <div
          className="rounded-xl border border-zinc-700 bg-zinc-900/40 p-5"
          key={stat.id}
        >
          <p className="font-bold font-display text-2xl text-zinc-100">
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-zinc-400 uppercase tracking-wide">
            {stat.label}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-12 grid gap-6 sm:grid-cols-2">
      {PAIRS.map((pair) => (
        <div
          className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-5"
          key={pair.id}
        >
          <p className="mb-3 text-xs text-zinc-400 uppercase tracking-wide">
            {pair.label}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <BeforeAfterImage
              label="Before"
              src={`/automations/case-study/${pair.id}-before.webp`}
            />
            <BeforeAfterImage
              label="After"
              src={`/automations/case-study/${pair.id}-after.webp`}
            />
          </div>
        </div>
      ))}
    </div>
  </section>
);

interface BeforeAfterImageProps {
  readonly label: string;
  readonly src: string;
}

const BeforeAfterImage: React.FC<BeforeAfterImageProps> = ({ label, src }) => (
  <div className="relative aspect-video overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
    <Image
      alt={`${label} placeholder`}
      className="object-cover"
      fill
      sizes="(min-width: 768px) 25vw, 50vw"
      src={src}
    />
    <span className="absolute bottom-2 left-2 rounded bg-zinc-900/80 px-2 py-0.5 text-xs text-zinc-200">
      {label}
    </span>
  </div>
);
