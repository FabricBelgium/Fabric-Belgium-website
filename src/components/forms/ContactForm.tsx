"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { site } from "@/lib/site";

type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Posts to the Azure Function fallback described in PROJECT-PLAN.md §4. The
 * backend decision (HubSpot portal vs. this endpoint) is still open — if it
 * lands on HubSpot, swap the body of `handleSubmit` for the embed and keep
 * the markup. Any failure falls back to a plain mailto so a message is never
 * silently lost.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "/api/contact-submission";

const FIELD_CLASSES =
  "w-full rounded-button border border-surface-border bg-surface px-4 py-3 text-sm text-text " +
  "placeholder:text-text-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

const LABEL_CLASSES = "block text-xs font-semibold uppercase tracking-wider text-text-secondary";

interface ContactFormProps {
  /** Prefills the subject line, e.g. "Partnership" from the partnerships page */
  defaultSubject?: string;
}

export function ContactForm({ defaultSubject = "" }: ContactFormProps) {
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    // Captured before the await: React nulls out currentTarget once the
    // synthetic event has been handled.
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        className="rounded-card border border-brand-200 bg-brand-50 p-8 text-center"
      >
        <h3 className="text-lg">Thanks — message sent</h3>
        <p className="mt-2 text-sm normal-case tracking-normal text-text-secondary">
          We read everything that comes in and will get back to you at the address you gave us.
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

      {state === "error" && (
        <p
          role="alert"
          className="rounded-button border border-surface-border bg-surface-muted px-4 py-3 text-sm text-text"
        >
          Something went wrong sending that. Email us directly at{" "}
          <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-2">
            {site.email}
          </a>
          .
        </p>
      )}

      <Button type="submit" size="lg" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
