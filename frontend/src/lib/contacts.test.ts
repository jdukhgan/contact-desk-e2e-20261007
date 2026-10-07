import { describe, expect, it } from "vitest";
import { filterContacts, NO_FILTERS, validateContactInput, EMPTY_INPUT, type Contact } from "./contacts";

const base = { notes: "", createdAt: "2026-10-01T09:00:00Z", updatedAt: "2026-10-01T09:00:00Z" };
const contacts: Contact[] = [
  { id: 1, name: "Ada Quill", email: "ada@example.com", company: "Northwind", ownerId: 1, status: "Active", ...base },
  { id: 2, name: "Bo Lang", email: "", company: "Fabrikam", ownerId: null, status: "New", ...base },
];

describe("validateContactInput", () => {
  it("requires a name and allows an empty email", () => {
    expect(validateContactInput(EMPTY_INPUT).name).toBeTruthy();
    expect(validateContactInput({ ...EMPTY_INPUT, name: "Ada" })).toEqual({});
  });
  it("rejects a malformed email", () => {
    expect(validateContactInput({ ...EMPTY_INPUT, name: "Ada", email: "nope" }).email).toBeTruthy();
  });
});

describe("filterContacts", () => {
  it("searches name, company and email case-insensitively", () => {
    expect(filterContacts(contacts, { ...NO_FILTERS, query: "NORTH" })).toHaveLength(1);
    expect(filterContacts(contacts, { ...NO_FILTERS, query: "ada@" })).toHaveLength(1);
  });
  it("combines owner and status", () => {
    expect(filterContacts(contacts, { query: "", ownerId: "none", status: "New" })).toHaveLength(1);
    expect(filterContacts(contacts, { query: "", ownerId: 1, status: "New" })).toHaveLength(0);
  });
});
