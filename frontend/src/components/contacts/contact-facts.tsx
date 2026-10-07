import { formatTimestamp, type Contact } from "@/lib/contacts";

/** Side column of the detail page: key-value list, mono only for the id. */
export function ContactFacts({ contact }: { contact: Contact }) {
  const rows: [string, string, boolean?][] = [
    ["ID", String(contact.id), true],
    ["Created", formatTimestamp(contact.createdAt)],
    ["Updated", formatTimestamp(contact.updatedAt)],
  ];
  return (
    <section aria-label="Facts">
      <h2 className="mb-2.5 text-section text-foreground">Facts</h2>
      <dl className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-1.5">
        {rows.map(([k, v, mono]) => (
          <div key={k} className="contents">
            <dt className="text-meta leading-[22px] text-subtle-foreground">{k}</dt>
            <dd className={mono ? "font-mono text-data text-foreground" : "text-body text-foreground"}>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
