import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { CONTACT_STATUSES, hasActiveFilters, NO_FILTERS, type Filters, type Owner } from "@/lib/contacts";

interface Props {
  filters: Filters;
  owners: Owner[];
  onChange: (f: Filters) => void;
  disabled?: boolean;
}

/** Search, owner, status and a Clear action that appears only while a filter is active. */
export function FilterBar({ filters, owners, onChange, disabled }: Props) {
  const active = hasActiveFilters(filters);
  return (
    <div role="search" aria-label="Filter contacts" className="flex flex-wrap items-center gap-2 max-md:flex-col max-md:items-stretch">
      <div className="relative min-w-0 flex-1 basis-64 max-md:basis-auto">
        <Search size={16} strokeWidth={1.5} aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle-foreground" />
        <Input
          type="search"
          aria-label="Search contacts"
          placeholder="Search name, company or email"
          value={filters.query}
          disabled={disabled}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          className="pl-8 [&::-webkit-search-cancel-button]:hidden"
        />
      </div>
      <div className="flex gap-2 max-md:[&>*]:flex-1">
        <Select
          aria-label="Owner"
          value={String(filters.ownerId)}
          disabled={disabled}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ ...filters, ownerId: v === "all" || v === "none" ? v : Number(v) });
          }}
          className="min-w-[150px]"
        >
          <option value="all">All owners</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
          <option value="none">Unassigned</option>
        </Select>
        <Select
          aria-label="Status"
          value={filters.status}
          disabled={disabled}
          onChange={(e) => onChange({ ...filters, status: e.target.value as Filters["status"] })}
          className="min-w-[140px]"
        >
          <option value="all">All statuses</option>
          {CONTACT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>
      {active && (
        <Button variant="ghost" onClick={() => onChange(NO_FILTERS)} className="max-md:justify-center">
          <X size={16} strokeWidth={1.5} aria-hidden />
          Clear filters
        </Button>
      )}
    </div>
  );
}
