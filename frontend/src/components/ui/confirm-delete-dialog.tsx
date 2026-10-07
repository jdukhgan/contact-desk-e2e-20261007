import { useEffect, useState, type RefObject } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "./button";
import { Input } from "./field";

interface Props {
  open: boolean;
  /** Name typed to enable the destructive button. */
  name: string;
  /** What is lost and what is kept, one sentence. */
  consequence: string;
  deleting?: boolean;
  /** Failure message from the last attempt, shown inside the dialog. */
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}

/** Destructive confirm: title asks the question with the name, type-the-name enables the button, Enter never confirms. */
export function ConfirmDeleteDialog({ open, name, consequence, deleting, error, onConfirm, onCancel, returnFocusRef }: Props) {
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (open) setTyped("");
  }, [open]);
  const matches = typed.trim() === name.trim();

  return (
    <AlertDialog.Root open={open} onOpenChange={(o) => !o && !deleting && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="animate-fade-in fixed inset-0 z-50 bg-black/35" />
        <AlertDialog.Content
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusRef.current?.focus();
          }}
          className="animate-dialog-in fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-raised p-6 shadow-pop outline-none"
        >
          <AlertDialog.Title className="text-section text-foreground">Delete {name}?</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-body text-muted-foreground">{consequence}</AlertDialog.Description>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4"
          >
            <label htmlFor="confirm-name" className="mb-1.5 block text-meta font-medium text-muted-foreground">
              Type <span className="font-medium text-foreground">{name}</span> to confirm
            </label>
            <Input
              id="confirm-name"
              value={typed}
              autoComplete="off"
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            />
            {error && (
              <p role="alert" className="mt-1.5 text-meta text-destructive-foreground">
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2 max-md:flex-col-reverse">
              <AlertDialog.Cancel asChild>
                <Button variant="secondary" disabled={deleting}>Cancel</Button>
              </AlertDialog.Cancel>
              <Button variant="destructive" disabled={!matches} working={deleting} onClick={onConfirm}>
                {deleting ? "Deleting" : "Delete contact"}
              </Button>
            </div>
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
