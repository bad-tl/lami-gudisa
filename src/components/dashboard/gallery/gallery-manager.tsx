"use client";

import * as React from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { GalleryForm } from "./gallery-form";
import { GalleryList } from "./gallery-list";

type GalleryRecord = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  imageUrl: string;
  imagePublicId: string;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type GalleryManagerProps = {
  initialItems: GalleryRecord[];
};

export function GalleryManager({
  initialItems,
}: GalleryManagerProps) {
  const [items, setItems] =
    React.useState<GalleryRecord[]>(
      initialItems,
    );

  const [isFormOpen, setIsFormOpen] =
    React.useState(false);

  const [editingItem, setEditingItem] =
    React.useState<GalleryRecord | null>(null);

  function handleAdd() {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  function handleEdit(
    item: GalleryRecord,
  ) {
    setEditingItem(item);
    setIsFormOpen(true);
  }

  function handleFormSuccess(
    item: GalleryRecord,
  ) {
    setItems((current) => {
      const exists = current.some(
        (existing) =>
          existing.id === item.id,
      );

      if (exists) {
        return current.map((existing) =>
          existing.id === item.id
            ? item
            : existing,
        );
      }

      return [...current, item].sort(
        (a, b) =>
          a.sortOrder - b.sortOrder,
      );
    });

    setIsFormOpen(false);
    setEditingItem(null);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
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
            Add Gallery Item
          </Button>
        </div>
      )}

      {isFormOpen ? (
        <GalleryForm
          item={editingItem}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <GalleryList
          items={items}
          onEdit={handleEdit}
          onChange={setItems}
        />
      )}
    </div>
  );
}