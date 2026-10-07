import { useEffect, useState, useSyncExternalStore } from 'react';
import type { ContactDeskProps } from '../components/contacts/contact-desk';
import { ContactController } from './controller';
export function useContactController(): ContactDeskProps {
  const [controller]=useState(()=>new ContactController());
  const snapshot=useSyncExternalStore(controller.subscribe,controller.getSnapshot);
  useEffect(()=>{void controller.load();return controller.dispose;},[controller]);
  return {...snapshot,onRetry:controller.load,onCreate:input=>controller.save(null,input),onUpdate:controller.save,onDelete:controller.remove};
}
