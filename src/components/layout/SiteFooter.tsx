import Image from "next/image";
import Link from "next/link";
import { navigation, site } from "@/lib/site";

/**
 * Light footer on the same `surface` as the last story panel, with no fade and
 * no top border: the page's final card runs straight into it as one surface.
 */
export function SiteFooter() {
  return (
    <footer className="bg-surface text-text">
      <div className="container-site grid gap-10 py-16 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-mark.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-sm font-bold uppercase leading-tight tracking-wider">
              {site.name}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
            A community for every data professional in Belgium working with Microsoft Fabric.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-xs text-text-muted">Site</h2>
          <ul className="mt-4 space-y-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-text-secondary transition-colors hover:text-brand-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs text-text-muted">Get in touch</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-text-secondary transition-colors hover:text-brand-500"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex text-text-secondary transition-colors hover:text-brand-500"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href={site.winterfestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary transition-colors hover:text-brand-500"
              >
                Fabric Winterfest
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-border/60">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. Run by the community, for the community.
          </p>
          <p>Not affiliated with or endorsed by Microsoft.</p>
        </div>
      </div>
    </footer>
  );
}
