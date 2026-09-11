/**
 * Identification and data-protection details for the legal pages.
 *
 * `null` means "not confirmed yet", and it is load-bearing rather than a
 * placeholder style: every legal page renders an unmissable draft notice while
 * any required field is still null, so this content cannot quietly go live
 * naming the wrong controller. Fill the fields in and the notices disappear on
 * their own.
 *
 * Getting the controller identity right is the one thing a privacy notice
 * cannot be vague about — GDPR Art. 13(1)(a) requires the identity and contact
 * details of the controller, and a notice naming the wrong party does not
 * discharge the obligation.
 */
export interface LegalEntity {
  /** Registered legal name, e.g. "Fabric Belgium VZW" — not the brand name. */
  name: string | null;
  /** Registered/geographic address. Required by Belgian CEL Art. XII.6. */
  address: string | null;
  /** KBO/BCE enterprise number, if the entity is registered. */
  enterpriseNumber: string | null;
  /** VAT number, if VAT-registered. */
  vatNumber: string | null;
  /** How long contact-form messages are kept before deletion. */
  contactRetention: string | null;
}

export const legalEntity: LegalEntity = {
  name: "Fabric Belgium VZW",
  address: "Doorniksesteenweg 133, 8580 Avelgem, Belgium",
  enterpriseNumber: "1019.431.693",
  vatNumber: "BE1019.431.693",
  contactRetention: "12 months",
};

/** Fields that must be filled before these pages are fit to publish. */
const REQUIRED_FIELDS = ["name", "address", "contactRetention"] as const;

export const unconfirmedFields = REQUIRED_FIELDS.filter((field) => legalEntity[field] === null);

export const hasUnconfirmedDetails = unconfirmedFields.length > 0;

/** Date these texts were last substantively changed. Update when you edit them. */
export const lastUpdated = "2026-09-11";

/**
 * The Belgian supervisory authority. A privacy notice has to name the
 * authority a visitor can complain to (GDPR Art. 13(2)(d)).
 */
export const supervisoryAuthority = {
  name: "Gegevensbeschermingsautoriteit / Autorité de protection des données",
  address: "Drukpersstraat 35, 1000 Brussels, Belgium",
  email: "contact@apd-gba.be",
  url: "https://www.gegevensbeschermingsautoriteit.be",
} as const;

export const legalNavigation = [
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Legal notice", href: "/legal" },
] as const;
