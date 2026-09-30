import { getPublishedGalleryItems } from "@/lib/public/gallery";
import GalleryPageClient from "@/components/public/gallery/gallery-page-client";

export default async function GalleryPage() {
  const items = await getPublishedGalleryItems();

  return <GalleryPageClient items={items} />;
}