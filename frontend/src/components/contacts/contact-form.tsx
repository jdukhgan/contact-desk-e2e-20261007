import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  CONTACT_STATUSES,
  validateContactInput,
  type ContactField,
  type ContactInput,
  type ContactStatus,
  type FieldErrors,
  type Owner,
} from "@/lib/contacts";

interface Props {
  /** Starting values. Re-initialised when `resetKey` changes (opening another contact). */
  initial: ContactInput;
  resetKey: string | number;
  owners: Owner[];
  saving?: boolean;
  /** Field errors returned by the server (`{ error, fields }`), merged with client validation. */
  serverErrors?: FieldErrors;
  /** Non-field failure from the last save. */
  formError?: string;
  /** Shows "Saved" confirmation after a successful save of an existing contact. */
  savedAt?: string | null;
  submitLabel: string;
  workingLabel: string;
  onSubmit: (input: ContactInput) => void;
  onCancel: () => void;
}

const ORDER: ContactField[] = ["name", "email"];

export function ContactForm({ initial, resetKey, owners, saving, serverErrors, formError, savedAt, submitLabel, workingLabel, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<ContactInput>(initial);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const refs = useRef<Partial<Record<ContactField, HTMLElement | null>>>({});

  useEffect(() => {
    setValues(initial);
    setClientErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const errors = { ...serverErrors, ...clientErrors };
  const set = <K extends ContactField>(k: K, v: ContactInput[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (clientErrors[k]) setClientErrors((e) => ({ ...e, [k]: undefined }));
  };

  // Move focus to the first server-reported invalid field.
  useEffect(() => {
    const first = ORDER.find((k) => serverErrors?.[k]);
    if (first) refs.current[first]?.focus();
  }, [serverErrors]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateContactInput(values);
    setClientErrors(found);
    const first = ORDER.find((k) => found[k]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }
    onSubmit({ ...values, name: values.name.trim(), email: values.email.trim(), company: values.company.trim() });
  };

  return (
    <form onSubmit={submit} noValidate className="max-w-[640px] [&_:is(input,textarea,select)]:scroll-mt-20">
      <div className="grid gap-5">
        <Field label="Name" required error={errors.name}>
          {(a) => <Input {...a} ref={(el) => { refs.current.name = el; }} value={values.name} onChange={(e) => set("name", e.target.value)} autoComplete="off" />}
        </Field>
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <Field label="Email" error={errors.email}>
            {(a) => <Input {...a} ref={(el) => { refs.current.email = el; }} type="email" inputMode="email" value={values.email} onChange={(e) => set("email", e.target.value)} placeholder="name@example.com" autoComplete="off" />}
          </Field>
          <Field label="Company" error={errors.company}>
            {(a) => <Input {...a} value={values.company} onChange={(e) => set("company", e.target.value)} autoComplete="off" />}
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <Field label="Owner" error={errors.ownerId}>
            {(a) => (
              <Select {...a} value={values.ownerId === null ? "" : String(values.ownerId)} onChange={(e) => set("ownerId", e.target.value === "" ? null : Number(e.target.value))}>
                <option value="">Unassigned</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </Select>
            )}
          </Field>
          <div>
            <span className="mb-1.5 block text-meta font-medium text-muted-foreground">Status</span>
            <Segmented
              label="Status"
              value={values.status}
              options={CONTACT_STATUSES.map((s) => ({ value: s, label: s }))}
              onChange={(s: ContactStatus) => set("status", s)}
            />
          </div>
        </div>
        <Field label="Notes" error={errors.notes}>
          {(a) => <Textarea {...a} rows={5} value={values.notes} onChange={(e) => set("notes", e.target.value)} />}
        </Field>
      </div>

      {formError && (
        <p role="alert" className="mt-4 text-body text-destructive-foreground">{formError}</p>
      )}

      <div className="mt-8 flex items-center gap-2 border-t border-border pt-4 max-md:flex-col-reverse max-md:items-stretch">
        <p aria-live="polite" className="mr-auto flex items-center gap-1.5 text-meta text-subtle-foreground max-md:mr-0 max-md:justify-center">
          {savedAt && !saving && (
            <>
              <Check size={14} strokeWidth={1.5} aria-hidden />
              Saved at {savedAt}
            </>
          )}
        </p>
        <Button variant="secondary" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button type="submit" variant="default" working={saving} className="min-w-[96px]">
          {saving ? workingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
