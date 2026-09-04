/**
 * The frosted "glass" tint from the hero demo, used by the eyebrow pill.
 *
 * It lives here, rendered once from the root layout, rather than inside
 * ShaderBackground where the snippet had it: filter ids are global, and two
 * copies of the same id on one page is invalid markup.
 *
 * The demo's #gooey-filter was dropped along with the sliding arrow button it
 * existed for.
 */
export function SvgFilters() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0.02
                    0 1 0 0 0.02
                    0 0 1 0 0.05
                    0 0 0 0.9 0"
            result="tint"
          />
        </filter>
      </defs>
    </svg>
  );
}
