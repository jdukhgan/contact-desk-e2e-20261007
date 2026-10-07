import { Status } from "@/components/ui/status";
import type { ContactStatus } from "@/lib/contacts";

const KIND = { New: "new", Active: "running", Archived: "stopped" } as const;

export function ContactStatusLabel({ status }: { status: ContactStatus }) {
  return <Status kind={KIND[status]}>{status}</Status>;
}
