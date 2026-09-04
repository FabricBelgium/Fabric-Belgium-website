import { Button } from "@/components/common/Button";
import { ShaderBackground } from "@/components/ui/hero-shader";

/**
 * Decorative node graph, echoing the network motif inside the Fabric Belgium
 * logo mark. Purely visual — hidden from assistive tech.
 */
function NetworkMotif({ className = "" }: { className?: string }) {
  const nodes = [
    [60, 20],
    [140, 55],
    [20, 95],
    [100, 120],
    [175, 140],
    [55, 185],
    [140, 210],
  ] as const;
  const edges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 5],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 6],
    [5, 6],
  ] as const;

  return (
    <svg viewBox="0 0 200 230" className={className} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.5" opacity="0.5">
        {edges.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            x1={nodes[from][0]}
            y1={nodes[from][1]}
            x2={nodes[to][0]}
            y2={nodes[to][1]}
          />
        ))}
      </g>
      <g fill="currentColor">
        {nodes.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" />
        ))}
      </g>
    </svg>
  );
}

interface HeroProps {
  /** Optional line above the headline, e.g. the date of the next meetup */
  eyebrow?: string;
}

/**
 * Follows the 1.txt demo's hero layout: a full-height shader panel with the
 * header overlaid at the top and the copy anchored to the bottom-left, rather
 * than a centred band. The eyebrow is the demo's frosted glass pill, and the
 * headline pairs an italic serif word against the bold sans line.
 */
export function Hero({ eyebrow }: HeroProps) {
  return (
    <ShaderBackground minHeight="100svh" className="flex flex-col">
      <NetworkMotif className="pointer-events-none absolute right-[6%] top-1/4 hidden h-[380px] w-[330px] text-text-inverse/10 lg:block" />

      {/*
        The shader dissolves into the page background instead of stopping at a
        hard edge — this is what keeps the hero and the content below reading
        as one surface. Sits above the canvases, below the copy.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-64 bg-gradient-to-b from-transparent via-transparent to-surface"
      />

      {/* pt-20 clears the overlaid header; mt-auto pins the block to the bottom */}
      {/* pb clears the bottom fade so the copy never sits on the cream ramp */}
      <div className="container-site relative z-10 mt-auto w-full pb-36 pt-32 md:pb-44">
        <div className="max-w-2xl">
          {eyebrow && (
            <div
              className="relative mb-6 inline-flex items-center rounded-full bg-text-inverse/10 px-4 py-1.5 backdrop-blur-sm"
              style={{ filter: "url(#glass-effect)" }}
            >
              <div className="absolute left-1 right-1 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span className="relative z-10 text-xs font-medium uppercase tracking-wider text-text-inverse">
                {eyebrow}
              </span>
            </div>
          )}

          <h1 className="text-4xl leading-[1.05] tracking-tight text-text-inverse md:text-5xl lg:text-6xl">
            <span className="font-display font-normal normal-case italic tracking-normal">
              Empower
            </span>{" "}
            every data professional
            <br />
            <span className="font-bold">with a community</span>
          </h1>

          <p className="mt-6 max-w-lg text-sm font-light normal-case leading-relaxed tracking-normal text-text-inverse/70">
            Fabric Belgium is where data professionals grow their Microsoft Fabric expertise from
            peers. Free meetups across the country, real sessions from people doing the work, and a
            network you can actually reach out to afterwards.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/events">Events</Button>
            <Button href="/partnerships" variant="inverse">
              Partnerships
            </Button>
            <Button href="/contact" variant="inverse">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </ShaderBackground>
  );
}
