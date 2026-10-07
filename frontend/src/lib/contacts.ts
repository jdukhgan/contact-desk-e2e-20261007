export type ContactStatus = "New" | "Active" | "Archived";
export const CONTACT_STATUSES: ContactStatus[] = ["New", "Active", "Archived"];

export interface Owner {
  id: number;
  name: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  ownerId: number | null;
  status: ContactStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/** Editable fields. Same shape the API accepts for create and update. */
export type ContactInput = Pick<Contact, "name" | "email" | "company" | "ownerId" | "status" | "notes">;

export type ContactField = keyof ContactInput;
export type FieldErrors = Partial<Record<ContactField, string>>;

/** Mirrors the API error body `{ error, fields? }`. */
export interface ApiError {
  error: string;
  fields?: FieldErrors;
}

export type SaveResult = { ok: true; contact: Contact } | ({ ok: false } & ApiError);
export type DeleteResult = { ok: true } | ({ ok: false } & ApiError);

export const EMPTY_INPUT: ContactInput = {
  name: "",
  email: "",
  company: "",
  ownerId: null,
  status: "New",
  notes: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Required name, valid optional email. The server must enforce the same rules. */
export function validateContactInput(input: ContactInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.name.trim()) errors.name = "Enter a name for this contact.";
  const email = input.email.trim();
  if (email && !EMAIL_RE.test(email)) errors.email = "Enter an email like name@example.com, or leave it empty.";
  return errors;
}

export interface Filters {
  query: string;
  ownerId: "all" | "none" | number;
  status: "all" | ContactStatus;
}
export const NO_FILTERS: Filters = { query: "", ownerId: "all", status: "all" };

export function hasActiveFilters(f: Filters) {
  return f.query.trim() !== "" || f.ownerId !== "all" || f.status !== "all";
}

/** Search matches name, company and email; owner and status filters combine with it. */
export function filterContacts(contacts: Contact[], f: Filters): Contact[] {
  const q = f.query.trim().toLowerCase();
  return contacts.filter((c) => {
    if (f.status !== "all" && c.status !== f.status) return false;
    if (f.ownerId === "none" && c.ownerId !== null) return false;
    if (typeof f.ownerId === "number" && c.ownerId !== f.ownerId) return false;
    if (!q) return true;
    return [c.name, c.company, c.email].some((v) => v.toLowerCase().includes(q));
  });
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "7 Oct, 14:32" in 24-hour time. */
export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${hh}:${mm}`;
}

export function ownerName(owners: Owner[], id: number | null): string {
  if (id === null) return "Unassigned";
  return owners.find((o) => o.id === id)?.name ?? "Unassigned";
}
