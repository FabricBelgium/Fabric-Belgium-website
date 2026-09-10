"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { site } from "@/lib/site";

/**
 * Click-to-load wrapper around the Microsoft Form that feeds the Power Automate
 * flow (see docs/contact-form-flow.md).
 *
 * The gate is not decoration. The cookie statement promises this site runs no
 * third-party scripts and that we ask before adding anything that needs a
 * cookie; an iframe that loads on page view would quietly break both. Nothing
 * reaches Microsoft until someone presses the button, so a visitor who only
 * reads the page is still in a no-cookie site — and the promise stays true
 * without a banner.
 *
 * The escape hatches matter too: not everyone will accept the embed, so the
 * form is also reachable in a new tab and the mailbox is offered directly.
 */
interface MicrosoftFormEmbedProps {
  /** The form's share URL, from Forms -> Collect responses. */
  url: string;
}

export function MicrosoftFormEmbed({ url }: MicrosoftFormEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={url}
        title="Fabric Belgium contact form"
        className="min-h-[720px] w-full rounded-card border border-surface-border bg-surface"
        allow=""
      />
    );
  }

  return (
    <div className="rounded-card border border-surface-border bg-surface-muted p-8">
      <h3 className="text-lg">Send us a message</h3>
      <p className="mt-2 text-sm normal-case leading-relaxed tracking-normal text-text-secondary">
        Our form is hosted by Microsoft Forms. We do not load it until you ask us to, so nothing is
        sent to Microsoft — and no cookies are set — just by reading this page. Press the button and
        the form opens right here.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="button" size="lg" onClick={() => setLoaded(true)}>
          Load the form
        </Button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold underline underline-offset-2 hover:text-brand-500"
        >
          Open it in a new tab
        </a>
      </div>

      <p className="mt-6 text-xs normal-case leading-relaxed tracking-normal text-text-muted">
        Would rather not use it at all? Email us at{" "}
        <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-2">
          {site.email}
        </a>
        .
      </p>
    </div>
  );
}
