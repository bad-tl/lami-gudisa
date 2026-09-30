import { getPublishedCertificates } from "@/lib/public/certificates";
import CertificatesPageClient from "@/components/public/certificates/certificates-page-client";

export default async function CertificatesPage() {
  const certificates = await getPublishedCertificates();

  return (
    <CertificatesPageClient certificates={certificates} />
  );
}