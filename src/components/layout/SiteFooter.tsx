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
                  className="text-sm text-text-secondary transition-colors hover:text-brand-600"
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
                className="text-sm text-text-secondary transition-colors hover:text-brand-600"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary transition-colors hover:text-brand-600"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={site.winterfestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary transition-colors hover:text-brand-600"
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
