import { useCallback, useRef, useState } from "react";
import type { ContactDeskProps } from "@/components/contacts/contact-desk";
import {
  validateContactInput,
  type Contact,
  type ContactInput,
  type Owner,
} from "@/lib/contacts";

// Fictional data only.
export const DEMO_OWNERS: Owner[] = [
  { id: 1, name: "Mara Okafor" },
  { id: 2, name: "Jonas Weber" },
];

export const DEMO_CONTACTS: Contact[] = [
  { id: 1, name: "Priya Raman", email: "priya.raman@harborlane.example", company: "Harbor Lane Studio", ownerId: 1, status: "Active", notes: "Met at the spring design meetup. Prefers email over calls; interested in the team plan.", createdAt: "2026-09-12T09:14:00", updatedAt: "2026-10-05T16:40:00" },
  { id: 2, name: "Tomás Herrera", email: "tomas@copperkettle.example", company: "Copper Kettle Roasters", ownerId: 2, status: "New", notes: "Inbound request from the website form. Needs a quote for twelve seats.", createdAt: "2026-10-06T11:02:00", updatedAt: "2026-10-06T11:02:00" },
  { id: 3, name: "Linnea Åkesson", email: "linnea.akesson@northfjord.example", company: "North Fjord Logistics", ownerId: 1, status: "Active", notes: "Renewal due in November. Champion on the ops team.", createdAt: "2026-08-21T13:30:00", updatedAt: "2026-10-02T10:15:00" },
  { id: 4, name: "Ibrahim Nasser", email: "", company: "Saltmarsh Books", ownerId: 2, status: "Archived", notes: "Closed the shop in September. Keep for history.", createdAt: "2026-06-03T08:45:00", updatedAt: "2026-09-18T17:20:00" },
  { id: 5, name: "Chloe Bergmann", email: "chloe@lumenworks.example", company: "Lumen Works", ownerId: null, status: "New", notes: "", createdAt: "2026-10-07T08:05:00", updatedAt: "2026-10-07T08:05:00" },
  { id: 6, name: "Dev Patel", email: "dev.patel@quarrystone.example", company: "Quarry & Stone Architects", ownerId: 1, status: "Active", notes: "Second project kicking off in Q4. Send the updated brief template.", createdAt: "2026-07-15T14:10:00", updatedAt: "2026-09-29T09:55:00" },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

/** `?state=loading|error|empty` forces a data state for reference captures. */
export function useDemoController(): ContactDeskProps {
  const forced = new URLSearchParams(window.location.search).get("state");
  const [contacts, setContacts] = useState<Contact[]>(forced === "empty" ? [] : DEMO_CONTACTS);
  const [failLoad, setFailLoad] = useState(forced === "error");
  const nextId = useRef(DEMO_CONTACTS.length + 1);

  const onCreate = useCallback(async (input: ContactInput) => {
    await delay(350);
    const fields = validateContactInput(input);
    if (Object.keys(fields).length) return { ok: false as const, error: "Check the highlighted fields.", fields };
    const t = now();
    const contact: Contact = { id: nextId.current++, ...input, createdAt: t, updatedAt: t };
    setContacts((cs) => [contact, ...cs]);
    return { ok: true as const, contact };
  }, []);

  const onUpdate = useCallback(async (id: number, input: ContactInput) => {
    await delay(350);
    const fields = validateContactInput(input);
    if (Object.keys(fields).length) return { ok: false as const, error: "Check the highlighted fields.", fields };
    let updated: Contact | undefined;
    setContacts((cs) => cs.map((c) => (c.id === id ? (updated = { ...c, ...input, updatedAt: now() }) : c)));
    return updated ? { ok: true as const, contact: updated } : { ok: false as const, error: "This contact no longer exists." };
  }, []);

  const onDelete = useCallback(async (id: number) => {
    await delay(350);
    setContacts((cs) => cs.filter((c) => c.id !== id));
    return { ok: true as const };
  }, []);

  return {
    contacts,
    owners: DEMO_OWNERS,
    loadState: forced === "loading" ? "loading" : failLoad ? "error" : "ready",
    loadError: "The demo server is unreachable.",
    onRetry: () => setFailLoad(false),
    onCreate,
    onUpdate,
    onDelete,
  };
}
