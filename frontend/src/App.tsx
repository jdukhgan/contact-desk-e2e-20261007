import { ContactDesk } from "@/components/contacts/contact-desk";
import { useDemoController } from "@/demo/demo-controller";

// Builder: replace `useDemoController()` with the API-backed controller (same ContactDeskProps).
export default function App() {
  const controller = useDemoController();
  return <ContactDesk {...controller} />;
}
