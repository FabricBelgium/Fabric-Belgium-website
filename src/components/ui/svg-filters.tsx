/**
 * The two SVG filters the 1.txt hero demo defines: a frosted "glass" tint for
 * pill labels and a gooey blur/threshold for the sliding button group.
 *
 * They live here, rendered once from the root layout, rather than inside
 * ShaderBackground where the snippet had them. Filter ids are global: the
 * header uses #gooey-filter on every page, not just the one page that happens
 * to render a shader, and two copies of the same id on one page is invalid.
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
        <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="gooey"
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
