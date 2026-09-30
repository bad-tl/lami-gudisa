"use client";

import * as React from "react";

import { CertificateForm } from "@/components/dashboard/certificates/certificate-form";
import { CertificateList } from "@/components/dashboard/certificates/certificate-list";

type CertificateItem = {
  id: string;
  title: string;
  issuer: string | null;
  issueDate: Date | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type CertificateManagerProps = {
  initialItems: CertificateItem[];
};

export function CertificateManager({
  initialItems,
}: CertificateManagerProps) {
  const [items, setItems] =
    React.useState<CertificateItem[]>(
      initialItems,
    );

  const [editingCertificate, setEditingCertificate] =
    React.useState<CertificateItem | null>(
      null,
    );

  const [showForm, setShowForm] =
    React.useState(false);

  function handleAdd() {
    setEditingCertificate(null);
    setShowForm(true);
  }

  function handleEdit(
    certificate: CertificateItem,
  ) {
    setEditingCertificate(certificate);
    setShowForm(true);
  }

  function handleSuccess(
    certificate: CertificateItem,
  ) {
    setItems((current) => {
      const exists = current.some(
        (item) =>
          item.id === certificate.id,
      );

      if (exists) {
        return current.map((item) =>
          item.id === certificate.id
            ? certificate
            : item,
        );
      }

      return [...current, certificate].sort(
        (a, b) =>
          a.sortOrder - b.sortOrder,
      );
    });

    setEditingCertificate(null);
    setShowForm(false);
  }

  function handleCancel() {
    setEditingCertificate(null);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Certificates
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage professional certificates,
            credentials, and qualifications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          Add Certificate
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold">
              {editingCertificate
                ? "Edit Certificate"
                : "Add Certificate"}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {editingCertificate
                ? "Update the certificate information below."
                : "Add a certificate to the portfolio."}
            </p>
          </div>

          <CertificateForm
            certificate={
              editingCertificate
            }
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </section>
      )}

      {/* List */}
      <CertificateList
        items={items}
        onEdit={handleEdit}
        onItemsChange={setItems}
      />
    </div>
  );
}