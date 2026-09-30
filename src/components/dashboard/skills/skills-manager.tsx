"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SkillForm } from "./skill-form";
import { SkillsList } from "./skills-list";

type SkillRecord = {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
  level: number | null;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type SkillsManagerProps = {
  initialSkills: SkillRecord[];
};

export function SkillsManager({
  initialSkills,
}: SkillsManagerProps) {
  const [skills, setSkills] =
    React.useState<SkillRecord[]>(initialSkills);

  const [isFormOpen, setIsFormOpen] =
    React.useState(false);

  const [editingSkill, setEditingSkill] =
    React.useState<SkillRecord | null>(null);

  function handleAdd() {
    setEditingSkill(null);
    setIsFormOpen(true);
  }

  function handleEdit(skill: SkillRecord) {
    setEditingSkill(skill);
    setIsFormOpen(true);
  }

  function handleFormSuccess(skill: SkillRecord) {
    setSkills((current) => {
      const exists = current.some(
        (item) => item.id === skill.id,
      );

      if (exists) {
        return current.map((item) =>
          item.id === skill.id ? skill : item,
        );
      }

      return [...current, skill].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );
    });

    setIsFormOpen(false);
    setEditingSkill(null);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingSkill(null);
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
            Add Skill
          </Button>
        </div>
      )}

      {isFormOpen ? (
        <SkillForm
          skill={editingSkill}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <SkillsList
          skills={skills}
          onEdit={handleEdit}
          onChange={setSkills}
        />
      )}
    </div>
  );
}