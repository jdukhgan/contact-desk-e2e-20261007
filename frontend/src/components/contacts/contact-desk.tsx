import { useMemo, useRef, useState } from "react";
import { ChevronRight, Plus, Trash2, UserX } from "lucide-react";
import { AppShell, PageHeader } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { EmptyState } from "@/components/ui/states";
import {
  EMPTY_INPUT,
  filterContacts,
  NO_FILTERS,
  type Contact,
  type ContactInput,
  type DeleteResult,
  type FieldErrors,
  type Filters,
  type Owner,
  type SaveResult,
} from "@/lib/contacts";
import { ContactFacts } from "./contact-facts";
import { ContactForm } from "./contact-form";
import { ContactList, type ListState } from "./contact-list";
import { FilterBar } from "./filter-bar";

/**
 * The seam between UI and data. The demo controller implements it in memory; the Builder
 * implements it with fetch() against `{contacts}`, `{contact}`, `{owners}` and `{error, fields?}`.
 */
export interface ContactDeskProps {
  contacts: Contact[];
  owners: Owner[];
  loadState: ListState;
  loadError?: string;
  onRetry: () => void;
  onCreate: (input: ContactInput) => Promise<SaveResult>;
  onUpdate: (id: number, input: ContactInput) => Promise<SaveResult>;
  onDelete: (id: number) => Promise<DeleteResult>;
}

type View = { kind: "list" } | { kind: "new" } | { kind: "detail"; id: number };

const toInput = (c: Contact): ContactInput => ({
  name: c.name, email: c.email, company: c.company, ownerId: c.ownerId, status: c.status, notes: c.notes,
});

const clock = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export function ContactDesk({ contacts, owners, loadState, loadError, onRetry, onCreate, onUpdate, onDelete }: ContactDeskProps) {
  const [view, setView] = useState<View>({ kind: "list" });
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [saving, setSaving] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const visible = useMemo(() => filterContacts(contacts, filters), [contacts, filters]);

  const go = (v: View) => {
    setView(v);
    setServerErrors(undefined);
    setFormError(undefined);
    setSavedAt(null);
  };
  const home = () => go({ kind: "list" });
  const toNew = () => go({ kind: "new" });

  const submit = async (input: ContactInput) => {
    setSaving(true);
    setServerErrors(undefined);
    setFormError(undefined);
    try {
      const res = view.kind === "detail" ? await onUpdate(view.id, input) : await onCreate(input);
      if (res.ok) {
        if (view.kind === "new") go({ kind: "detail", id: res.contact.id });
        setSavedAt(clock());
      } else {
        setServerErrors(res.fields);
        setFormError(res.fields ? undefined : res.error);
        if (res.fields && !Object.keys(res.fields).length) setFormError(res.error);
      }
    } catch {
      setFormError("Could not reach the server. Your changes are still in the form; try saving again.");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async (c: Contact) => {
    setDeleting(true);
    setDeleteError(undefined);
    try {
      const res = await onDelete(c.id);
      if (res.ok) {
        setConfirmDelete(false);
        home();
      } else {
        setDeleteError(res.error);
      }
    } catch {
      setDeleteError("Could not reach the server. The contact was not deleted; try again.");
    } finally {
      setDeleting(false);
    }
  };

  const current = view.kind === "detail" ? contacts.find((c) => c.id === view.id) : undefined;

  const crumb = (last: string) => (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-body">
      <button type="button" onClick={home} className="rounded-sm text-muted-foreground hover-capable:hover:text-foreground">Contacts</button>
      <ChevronRight size={14} strokeWidth={1.5} aria-hidden className="shrink-0 text-subtle-foreground" />
      <span aria-current="page" className="truncate text-label text-foreground">{last}</span>
    </nav>
  );

  let body;
  if (view.kind === "list") {
    body = (
      <>
        <PageHeader
          left={<h1 className="text-display text-foreground">Contacts</h1>}
          right={
            <Button variant="default" onClick={toNew}>
              <Plus size={16} strokeWidth={1.5} aria-hidden />
              New contact
            </Button>
          }
        />
        <div className="min-h-0 flex-1 overflow-auto px-5 pb-24 pt-4 max-md:px-4 md:pb-5">
          <div className="grid gap-4">
            <FilterBar filters={filters} owners={owners} onChange={setFilters} disabled={loadState !== "ready"} />
            <p aria-live="polite" className="text-meta text-subtle-foreground">
              {loadState === "ready" ? `${visible.length} of ${contacts.length} ${contacts.length === 1 ? "contact" : "contacts"}` : " "}
            </p>
            <ContactList
              state={loadState}
              contacts={visible}
              totalCount={contacts.length}
              owners={owners}
              errorMessage={loadError}
              onOpen={(id) => go({ kind: "detail", id })}
              onRetry={onRetry}
              onClearFilters={() => setFilters(NO_FILTERS)}
              onCreate={toNew}
            />
          </div>
        </div>
      </>
    );
  } else if (view.kind === "detail" && !current) {
    body = (
      <>
        <PageHeader left={crumb("Not found")} />
        <EmptyState
          icon={<UserX size={20} strokeWidth={1.5} />}
          title="This contact no longer exists"
          description="It may have been deleted. Go back to the list to pick another contact."
          action={<Button onClick={home}>Back to contacts</Button>}
        />
      </>
    );
  } else {
    const isNew = view.kind === "new";
    body = (
      <>
        <PageHeader
          left={crumb(isNew ? "New contact" : current!.name)}
          right={
            !isNew && (
              <Button ref={deleteButtonRef} variant="destructive" onClick={() => { setDeleteError(undefined); setConfirmDelete(true); }}>
                <Trash2 size={16} strokeWidth={1.5} aria-hidden />
                Delete
              </Button>
            )
          }
        />
        <div className="min-h-0 flex-1 overflow-auto px-5 pb-24 pt-5 max-md:px-4 md:pb-5">
          <div className="mx-auto max-w-[1200px]">
            <h1 className="mb-6 truncate text-display text-foreground">{isNew ? "New contact" : current!.name}</h1>
            <div className="grid grid-cols-[minmax(0,1fr)_300px] gap-8 max-lg:grid-cols-1">
              <ContactForm
                initial={isNew ? EMPTY_INPUT : toInput(current!)}
                resetKey={isNew ? "new" : `${current!.id}:${current!.updatedAt}`}
                owners={owners}
                saving={saving}
                serverErrors={serverErrors}
                formError={formError}
                savedAt={savedAt}
                submitLabel={isNew ? "Create contact" : "Save changes"}
                workingLabel={isNew ? "Creating" : "Saving"}
                onSubmit={submit}
                onCancel={home}
              />
              {!isNew && <ContactFacts contact={current!} />}
            </div>
          </div>
        </div>
        {!isNew && (
          <ConfirmDeleteDialog
            returnFocusRef={deleteButtonRef}
            open={confirmDelete}
            name={current!.name}
            consequence="This permanently removes the contact and its notes. Other contacts are not affected."
            deleting={deleting}
            error={deleteError}
            onConfirm={() => doDelete(current!)}
            onCancel={() => setConfirmDelete(false)}
          />
        )}
      </>
    );
  }

  return (
    <AppShell contactCount={loadState === "ready" ? contacts.length : undefined} onHome={home} onNew={toNew}>
      {body}
    </AppShell>
  );
}
