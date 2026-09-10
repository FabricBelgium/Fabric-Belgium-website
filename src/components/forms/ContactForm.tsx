"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { MicrosoftFormEmbed } from "@/components/forms/MicrosoftFormEmbed";
import { site } from "@/lib/site";

type SubmitState = "idle" | "handoff";

/**
 * Two shapes, chosen at build time by whether the Microsoft Form exists yet.
 *
 * With `site.contactFormUrl` set, this renders the click-to-load
 * Microsoft Forms embed; a Power Automate flow on the free Microsoft 365 seeded
 * licence then emails each response to `site.email`. See
 * docs/contact-form-flow.md.
 *
 * Without it, the hand-built form below hands off to the visitor's own mail
 * client. That is the honest fallback for a static site: GitHub Pages cannot
 * run code, so nothing on this page can send mail by itself, and pretending a
 * submission succeeded would lose enquiries silently.
 *
 * Deliberately not HubSpot (the only portal available belongs to another
 * company) and deliberately no third-party form service (the cookie statement
 * promises no third-party scripts, and the privacy notice promises the message
 * goes to the team mailbox and nowhere else).
 */
const FIELD_CLASSES =
  "w-full rounded-button border border-surface-border bg-surface px-4 py-3 text-sm text-text " +
  "placeholder:text-text-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

const LABEL_CLASSES = "block text-xs font-semibold uppercase tracking-wider text-text-secondary";

interface ContactFormProps {
  /** Prefills the subject line, e.g. "Partnership" from the partnerships page */
  defaultSubject?: string;
}

/** Builds the mailto: handed to the visitor when no Microsoft Form is configured. */
function mailtoFor(payload: Record<string, string>) {
  const subject = payload.subject?.trim() || "Website enquiry";
  const body = [
    `Name: ${payload.firstName ?? ""} ${payload.lastName ?? ""}`.trim(),
    `Email: ${payload.email ?? ""}`,
    "",
    payload.message ?? "",
  ].join("\n");
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm({ defaultSubject = "" }: ContactFormProps) {
  const [state, setState] = useState<SubmitState>("idle");

  if (site.contactFormUrl) {
    return <MicrosoftFormEmbed url={site.contactFormUrl} />;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    window.location.href = mailtoFor(payload);
    setState("handoff");
  }

  if (state === "handoff") {
    return (
      <div
        role="status"
        className="rounded-card border border-brand-200 bg-brand-50 p-8 text-center"
      >
        <h3 className="text-lg">Almost there</h3>
        <p className="mt-2 text-sm normal-case tracking-normal text-text-secondary">
          Your mail app should have opened with the message ready — press send and it reaches us. If
          nothing opened, write to{" "}
          <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-2">
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASSES} htmlFor="firstName">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            className={`mt-2 ${FIELD_CLASSES}`}
          />
        </div>
        <div>
          <label className={LABEL_CLASSES} htmlFor="lastName">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            className={`mt-2 ${FIELD_CLASSES}`}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLASSES} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={`mt-2 ${FIELD_CLASSES}`}
        />
      </div>

      <div>
        <label className={LABEL_CLASSES} htmlFor="subject">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          defaultValue={defaultSubject}
          className={`mt-2 ${FIELD_CLASSES}`}
        />
      </div>

      <div>
        <label className={LABEL_CLASSES} htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`mt-2 ${FIELD_CLASSES}`}
        />
      </div>

      {/*
        GDPR Art. 13 wants this at the point of collection, not only linked from
        the footer. Deliberately a notice and not a consent checkbox: we rely on
        legitimate interest to answer an enquiry someone chose to send, and a
        tickbox would ask for a consent we are not actually relying on.
      */}
      <p className="text-xs normal-case leading-relaxed tracking-normal text-text-muted">
        We use what you send here only to reply to you, and we do not share it. See the{" "}
        <Link
          href="/privacy"
          className="font-semibold underline underline-offset-2 hover:text-brand-500"
        >
          privacy policy
        </Link>
        .
      </p>

      <Button type="submit" size="lg">
        Send message
      </Button>
    </form>
  );
}
