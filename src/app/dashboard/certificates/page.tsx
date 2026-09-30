import {
  Award,
  CheckCircle2,
  FileBadge,
  FileClock,
} from "lucide-react";

import { getCertificateItems } from "@/app/dashboard/certificates/actions";
import { CertificateManager } from "@/components/dashboard/certificates/certificate-manager";

export default async function CertificatesPage() {
  const certificates =
    await getCertificateItems();

  const total = certificates.length;

  const published = certificates.filter(
    (certificate) =>
      certificate.status === "PUBLISHED",
  ).length;

  const drafts = certificates.filter(
    (certificate) =>
      certificate.status === "DRAFT",
  ).length;

  const withCredentials =
    certificates.filter(
      (certificate) =>
        Boolean(
          certificate.credentialId ||
            certificate.credentialUrl,
        ),
    ).length;

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <Award className="size-4" />
            Credentials
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Certificates
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage professional certificates,
            qualifications, and verifiable
            credentials displayed on the portfolio.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total
              </p>

              <FileBadge className="size-5 text-muted-foreground" />
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {total}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              All certificates
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Published
              </p>

              <CheckCircle2 className="size-5 text-emerald-600" />
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {published}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Visible publicly
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Drafts
              </p>

              <FileClock className="size-5 text-amber-600" />
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {drafts}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Not published
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Verified
              </p>

              <Award className="size-5 text-blue-600" />
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {withCredentials}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              With credential information
            </p>
          </div>
        </div>

        {/* Manager */}
        <CertificateManager
          initialItems={certificates}
        />
      </div>
    </div>
  );
}