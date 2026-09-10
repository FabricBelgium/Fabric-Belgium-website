# Contact form → Outlook (Power Automate setup)

The website is static: it cannot send mail itself. `ContactForm` POSTs the
submission as JSON to an HTTP-triggered flow in the **Fabric Belgium** Microsoft
tenant, and that flow emails `team@fabricbelgium.be` through Outlook.

Deliberately not HubSpot: the only portal available is Plainsight's, and Fabric
Belgium enquiries must not land in another company's CRM.

Until `NEXT_PUBLIC_CONTACT_ENDPOINT` is set the form opens the visitor's own mail
client with the message pre-filled, so nothing is lost while this is being built.

## 1. Create the flow

At <https://make.powerautomate.com>, signed in on the **Fabric Belgium** tenant
(not Plainsight):

1. **Create → Instant cloud flow**, trigger **"When an HTTP request is
   received"**. This is a premium connector — it needs a Power Automate premium
   licence. (An Azure Logic App with the same trigger is the cheaper alternative
   if you have an Azure subscription; the steps are identical.)
2. Set **Request Body JSON Schema** to:

   ```json
   {
     "type": "object",
     "properties": {
       "firstName": { "type": "string" },
       "lastName": { "type": "string" },
       "email": { "type": "string" },
       "subject": { "type": "string" },
       "message": { "type": "string" },
       "sentFrom": { "type": "string" }
     }
   }
   ```

3. Under the trigger's **advanced options**, leave **Method** unset so the flow
   also answers the browser's `OPTIONS` preflight (see CORS below).
4. Add **Office 365 Outlook → Send an email (V2)**:
   - **To:** `team@fabricbelgium.be`
   - **Subject:** `Website enquiry: @{triggerBody()?['subject']}`
   - **Body:** the message, plus name, email and `sentFrom` so you can see which
     page it came from
   - **Advanced → Reply To:** `@{triggerBody()?['email']}` — replying in Outlook
     then goes straight back to the enquirer
5. **Save**, then copy the generated **HTTP POST URL**.

## 2. CORS — the part that is easy to miss

A browser will not let the page read a cross-origin response unless the flow
says so, and because we send `Content-Type: application/json` the browser first
sends an `OPTIONS` preflight. A flow that ignores this looks broken in exactly
one way: the visitor sees "Something went wrong sending that" with the mailto
fallback, while the flow run history shows nothing at all.

Add a **Response** action (and, for the preflight, a condition branch on
`OPTIONS` that returns 200 with an empty body) carrying these headers:

```text
Access-Control-Allow-Origin: https://www.fabricbelgium.be
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Return `200` from the POST branch once the mail action has run.

## 3. Wire the URL into the build

The trigger URL carries its own `sig` token, so treat it as a **public** value:
`NEXT_PUBLIC_*` variables are inlined into the client bundle and are readable by
anyone who views source. That is unavoidable when posting from a static page.
The protection is that the flow's only capability is "email the team" — keep it
that way, and rotate the URL from the flow if it ever attracts spam. The
honeypot field in `ContactForm` drops the cheapest bots.

In **Settings → Secrets and variables → Actions → Variables** (needs repo
admin), add:

| Name                           | Value                    |
| ------------------------------ | ------------------------ |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | the flow's HTTP POST URL |

Then re-run **Deploy site to GitHub Pages** (Actions → the workflow → _Run
workflow_). Until it re-runs, the live bundle still has the old empty value.

For local development, put the same line in `.env.local`.

## 4. Check it

Submit the form on <https://www.fabricbelgium.be/contact>. You should see
"Message sent", a run in the flow's history, and the mail in
`team@fabricbelgium.be`. If you get the error message with the mailto fallback
instead, open the browser console: a CORS complaint means step 2 is incomplete,
and a 4xx means the JSON schema in step 1 does not match what was posted.
