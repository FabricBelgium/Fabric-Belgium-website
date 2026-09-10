# Contact form → Outlook (Microsoft Forms + Power Automate)

The website is static: GitHub Pages serves fixed files and cannot run code, so
nothing on the page can send mail by itself. Something has to do the sending.

This is the free route, and it needs no premium licence and no outside company:

```text
visitor fills the Microsoft Form (embedded on /contact)
   ↓  automatic
Power Automate: "When a new response is submitted"   (standard connector)
   ↓
Office 365 Outlook: "Send an email (V2)"             (standard connector)
   ↓
team@fabricbelgium.be — full message in the body
```

Both connectors are **standard**, so the Power Automate use rights seeded with
Microsoft 365 cover this. The premium "When an HTTP request is received" trigger
is deliberately avoided.

Why the flow at all, when Forms can already email you? Because Forms' built-in
"Get email notification of each response" sends only a _view results_ link. The
flow is what puts the actual message in the mailbox.

Not HubSpot: the only portal available belongs to Plainsight, and Fabric Belgium
enquiries must not land in another company's CRM. Not a third-party form service
either: the cookie statement promises no third-party scripts.

## 1. Build the form

At <https://forms.office.com>, signed in on the **Fabric Belgium** tenant:

1. **New Form**, titled something like "Contact Fabric Belgium".
2. Add these questions, so the flow has the same fields the old form collected:

   | Question   | Type            | Required |
   | ---------- | --------------- | -------- |
   | First name | Text            | yes      |
   | Last name  | Text            | yes      |
   | Email      | Text            | yes      |
   | Subject    | Text            | no       |
   | Message    | Text, long form | yes      |

3. Create it in a **group** the whole team owns rather than under one personal
   account — otherwise the form and its responses disappear when that person
   leaves.
4. **Collect responses → Anyone can respond** (visitors are not signed in to
   your tenant, so this is required), then copy the link.

## 2. Build the flow

At <https://make.powerautomate.com>, same tenant:

1. **Create → Automated cloud flow**.
2. Trigger: **Microsoft Forms → "When a new response is submitted"**. Pick the
   form from step 1.
3. Add **Microsoft Forms → "Get response details"**, same form, with **Response
   Id** from the trigger. Without this step you only have a response id, not the
   answers.
4. Add **Office 365 Outlook → "Send an email (V2)"**:
   - **To:** `team@fabricbelgium.be`
   - **Subject:** `Website enquiry: ` then the _Subject_ field
   - **Body:** the _Message_ field, plus first name, last name and email so you
     can see who wrote
   - **Advanced options → Reply To:** the _Email_ field — replying in Outlook
     then goes straight back to the enquirer
5. **Save**, then use **Test → Manually** and submit the form once.

If the mail does not arrive, open the flow's **run history**: a failed "Get
response details" almost always means the form in step 3 is not the same form as
in step 2.

## 2b. Where responses are stored

Nothing extra to build: Microsoft Forms keeps every submission itself, in the
form's **Responses** tab, as a table with a one-click **Export to Excel**. So
there is a durable record even if the alert mail is deleted, missed, or the flow
was broken at the time — which is the main thing the old `mailto:` fallback could
not offer.

That means the mail is an **alert**, not the only copy. Two consequences:

- If the flow ever breaks, submissions are still being collected. Fix the flow
  and the backlog is sitting in the Responses tab.
- Someone has to clear old responses. The privacy notice promises contact
  messages are kept for a stated period "and then deleted", and that promise now
  covers the copy in Forms as well as the one in the mailbox. Deleting the mail
  alone does not honour it.

If "did anyone actually answer this?" becomes a problem, the flow can also post
each enquiry to a Teams channel, raise a Planner task, or append a row to a
shared Excel table — all standard connectors on the same free licence. Not set up
today, because email alone was the ask.

## 3. Put the form on the site

The site reads the form URL from a build-time variable. In **Settings → Secrets
and variables → Actions → Variables** (needs repo admin), add:

| Name                           | Value                       |
| ------------------------------ | --------------------------- |
| `NEXT_PUBLIC_CONTACT_FORM_URL` | the form link from step 1.4 |

Then re-run **Deploy site to GitHub Pages** (Actions → the workflow → _Run
workflow_). Until it re-runs, the live site still shows the fallback.

For local development, put the same line in `.env.local`.

## 4. What visitors see, and why it is gated

`ContactForm` swaps shape depending on that variable:

- **Set** → the click-to-load Microsoft Forms embed. The form does **not** load
  on page view. The cookie statement promises this site runs no third-party
  scripts and that we ask before adding anything that needs a cookie, so nothing
  reaches Microsoft until the visitor presses "Load the form". Anyone who only
  reads the page is still on a cookie-free site, and no banner is needed.
  Alongside the button there is a new-tab link and the plain mailbox address for
  people who would rather not load it at all.
- **Unset** → the hand-built form, which opens the visitor's own mail client with
  the message pre-filled. Not automatic, but nothing is lost while the form and
  flow are being built.

## 5. Keep the notices true

Two pages make specific promises that this route touches. Both were updated when
the embed landed — re-check them if the setup changes again:

- `src/app/cookies/page.tsx` — describes the embed as click-to-load and says
  Microsoft may set cookies once it is loaded.
- `src/app/privacy/page.tsx` — says responses are stored in Microsoft Forms in
  the Fabric Belgium tenant as well as arriving in the mailbox. The old wording
  said the message went to the mailbox "and nowhere else", which stopped being
  true once Forms held a copy.
