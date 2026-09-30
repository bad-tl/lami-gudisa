"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EducationForm } from "./education-form";
import { EducationList } from "./education-list";

type EducationRecord = {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  description: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type EducationManagerProps = {
  initialEducations: EducationRecord[];
};

export function EducationManager({
  initialEducations,
}: EducationManagerProps) {
  const [educations, setEducations] =
    React.useState<EducationRecord[]>(initialEducations);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingEducation, setEditingEducation] =
    React.useState<EducationRecord | null>(null);

  function handleAdd() {
    setEditingEducation(null);
    setIsFormOpen(true);
  }

  function handleEdit(education: EducationRecord) {
    setEditingEducation(education);
    setIsFormOpen(true);
  }

  function handleFormSuccess(education: EducationRecord) {
    setEducations((current) => {
      const exists = current.some((item) => item.id === education.id);

      if (exists) {
        return current.map((item) =>
          item.id === education.id ? education : item,
        );
      }

      return [...current, education].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );
    });

    setIsFormOpen(false);
    setEditingEducation(null);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingEducation(null);
  }

  return (
    <div className="space-y-6">
      {!isFormOpen && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleAdd}
            className="gap-2"
          >
            <Plus className="size-4" />
            Add Education
          </Button>
        </div>
      )}

      {isFormOpen ? (
        <EducationForm
          education={editingEducation}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <EducationList
          educations={educations}
          onEdit={handleEdit}
          onChange={setEducations}
        />
      )}
    </div>
  );
}