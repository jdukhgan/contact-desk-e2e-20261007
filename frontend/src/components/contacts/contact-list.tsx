import { Plus, SearchX, Users } from "lucide-react";
import { Banner, EmptyState, Skeleton } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { cn } from "@/design-system/cn";
import { formatTimestamp, ownerName, type Contact, type Owner } from "@/lib/contacts";
import { ContactStatusLabel } from "./contact-status";

export type ListState = "loading" | "error" | "ready";

interface Props {
  state: ListState;
  /** Contacts after filtering. */
  contacts: Contact[];
  /** Total contacts before filtering; 0 means "none yet". */
  totalCount: number;
  owners: Owner[];
  errorMessage?: string;
  onOpen: (id: number) => void;
  onRetry: () => void;
  onClearFilters: () => void;
  onCreate: () => void;
}

const COLS = "grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_90px_120px] xl:grid-cols-[minmax(200px,1.4fr)_minmax(140px,1fr)_minmax(130px,0.8fr)_110px_120px]";

export function ContactList({ state, contacts, totalCount, owners, errorMessage, onOpen, onRetry, onClearFilters, onCreate }: Props) {
  if (state === "error") {
    return (
      <Banner
        title="Contacts could not be loaded."
        description={`${errorMessage ?? "The server did not respond."} Your contacts are unchanged; try again.`}
        action={<Button onClick={onRetry}>Retry</Button>}
      />
    );
  }

  if (state === "loading") {
    return (
      <div role="status" aria-label="Loading contacts" className="overflow-hidden rounded-lg border border-border">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex h-11 items-center gap-6 border-b border-border px-4 last:border-b-0 max-md:h-[68px]">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3.5 w-28 max-md:hidden" />
            <Skeleton className="h-3.5 w-24 max-md:hidden" />
            <Skeleton className="ml-auto h-3.5 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <EmptyState
        icon={<Users size={20} strokeWidth={1.5} />}
        title="No contacts yet"
        description="Add your first contact to start tracking who owns each relationship."
        action={<Button variant="default" onClick={onCreate}><Plus size={16} strokeWidth={1.5} aria-hidden />New contact</Button>}
      />
    );
  }

  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={<SearchX size={20} strokeWidth={1.5} />}
        title="No contacts match these filters"
        description="Try a different search, or clear the filters to see all contacts."
        action={<Button onClick={onClearFilters}>Clear filters</Button>}
      />
    );
  }

  return (
    <>
      {/* Table from 768 px */}
      <div role="table" aria-label="Contacts" className="hidden overflow-hidden rounded-lg border border-border md:block">
        <div role="row" className={cn("grid h-[38px] items-center gap-4 border-b border-border px-4 text-meta text-muted-foreground", COLS)}>
          <div role="columnheader">Name</div>
          <div role="columnheader">Company</div>
          <div role="columnheader">Owner</div>
          <div role="columnheader">Status</div>
          <div role="columnheader" className="text-right">Updated</div>
        </div>
        {contacts.map((c) => (
          <div
            key={c.id}
            role="row"
            onClick={() => onOpen(c.id)}
            className={cn(
              "group grid h-11 cursor-pointer items-center gap-4 border-b border-border px-4 last:border-b-0 hover-capable:hover:bg-raised",
              COLS,
              c.status === "Archived" && "opacity-70",
            )}
          >
            <div role="cell" className="min-w-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onOpen(c.id); }}
                className="block max-w-full truncate rounded-sm text-left text-label text-foreground"
                aria-label={`Open ${c.name}`}
              >
                {c.name}
              </button>
            </div>
            <div role="cell" className="truncate text-muted-foreground">{c.company || "—"}</div>
            <div role="cell" className="truncate text-muted-foreground">{ownerName(owners, c.ownerId)}</div>
            <div role="cell"><ContactStatusLabel status={c.status} /></div>
            <div role="cell" className="text-right text-meta text-subtle-foreground">{formatTimestamp(c.updatedAt)}</div>
          </div>
        ))}
      </div>

      {/* Row list below 768 px */}
      <ul aria-label="Contacts" className="overflow-hidden rounded-lg border border-border md:hidden">
        {contacts.map((c) => (
          <li key={c.id} className="border-b border-border last:border-b-0">
            <button
              type="button"
              onClick={() => onOpen(c.id)}
              className={cn("flex min-h-[64px] w-full items-center gap-3 px-4 py-2.5 text-left", c.status === "Archived" && "opacity-70")}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-label text-foreground">{c.name}</span>
                <span className="block truncate text-meta text-subtle-foreground">
                  {[c.company, ownerName(owners, c.ownerId)].filter(Boolean).join(" · ")}
                </span>
              </span>
              <ContactStatusLabel status={c.status} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
