import ContactManager from "@/components/dashboard/contact/contact-manager";
import { getContactData } from "@/app/dashboard/contact/actions";

export default async function ContactPage() {
  const data = await getContactData();

  return <ContactManager initialData={data} />;
}