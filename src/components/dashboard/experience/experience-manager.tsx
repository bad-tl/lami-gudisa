"use client";

import { useState } from "react";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";

import { ExperienceForm } from "./experience-form";
import { ExperienceList } from "./experience-list";

type Experience = {
  id: string;
  position: string;
  company: string;
  employmentType: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
  achievements: string | null;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type ExperienceManagerProps = {
  experiences: Experience[];
};

export function ExperienceManager({
  experiences,
}: ExperienceManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<Experience | null>(null);

  function handleAdd() {
    setEditingExperience(null);
    setShowForm(true);
  }

  function handleEdit(experience: Experience) {
    setEditingExperience(experience);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setEditingExperience(null);
  }

  function handleSuccess() {
    window.location.reload();
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to Professional Journey
        </button>

        <ExperienceForm
          experience={editingExperience}
          onSuccess={handleSuccess}
          onCancel={handleClose}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Career Timeline
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
            Professional Experience
          </h2>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
        >
          <BriefcaseBusiness className="size-4" />
          Add Experience
        </button>
      </div>

      <ExperienceList
        experiences={experiences}
        onEdit={handleEdit}
      />
    </div>
  );
}