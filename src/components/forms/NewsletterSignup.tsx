import Link from "next/link";
import { Button } from "@/components/common/Button";
import { site } from "@/lib/site";

/**
 * Newsletter signup that posts straight to the Mailchimp audience.
 *
 * A plain HTML form rather than Mailchimp's embed snippet: the snippet loads
 * Mailchimp's scripts on page view, and the cookie statement promises no
 * third-party scripts. Posting the form needs none of that — nothing reaches
 * Mailchimp until someone presses Subscribe, and Mailchimp's own confirmation
 * page opens in a new tab so the visitor keeps their place here.
 */
export function NewsletterSignup() {
  return (
    <form action={site.newsletter.action} method="post" target="_blank" className="mt-4">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id="newsletter-email"
          type="email"
          name="EMAIL"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="min-w-0 flex-1 basis-48 rounded-full border border-surface-border bg-surface px-4 py-2 text-sm text-text placeholder:text-text-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <Button type="submit" size="sm">
          Subscribe
        </Button>
      </div>

      {/* Mailchimp's bot trap, positioned off-screen as in its own embed code. */}
      <div aria-hidden="true" className="absolute -left-[5000px]">
        <input type="text" name={site.newsletter.honeypot} tabIndex={-1} defaultValue="" />
      </div>

      <p className="mt-3 max-w-xs text-xs leading-relaxed text-text-muted">
        Event announcements and community news by email. Unsubscribe from any email. See the{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-brand-500">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
