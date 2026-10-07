import { ContactDesk } from "@/components/contacts/contact-desk";
import { useContactController } from "@/api/use-contact-controller";

export default function App() {
  const controller = useContactController();
  return <ContactDesk {...controller} />;
}
