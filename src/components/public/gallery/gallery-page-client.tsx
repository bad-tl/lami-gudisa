"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Images,
  X,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

type GalleryItem = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  imageUrl: string;
  imagePublicId: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type GalleryPageClientProps = {
  items: GalleryItem[];
};

function GalleryPageClient({
  items,
}: GalleryPageClientProps) {
  const reducedMotion = useReducedMotion();

  const [selectedIndex, setSelectedIndex] =
    React.useState<number | null>(null);

  const selectedItem =
    selectedIndex !== null
      ? items[selectedIndex]
      : null;

  const closeViewer = React.useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showPrevious = React.useCallback(() => {
    if (items.length === 0) return;

    setSelectedIndex((current) => {
      if (current === null) return 0;

      return current === 0
        ? items.length - 1
        : current - 1;
    });
  }, [items.length]);

  const showNext = React.useCallback(() => {
    if (items.length === 0) return;

    setSelectedIndex((current) => {
      if (current === null) return 0;

      return current === items.length - 1
        ? 0
        : current + 1;
    });
  }, [items.length]);

  React.useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        originalOverflow;
    };
  }, [
    selectedIndex,
    closeViewer,
    showPrevious,
    showNext,
  ]);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#061311] text-white">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <Images className="size-7 text-emerald-300" />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Gallery
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            No gallery moments yet
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-white/55 sm:text-base">
            New professional moments and experiences
            will appear here when they are published.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#061311] text-white">
        {/* Background atmosphere */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0"
        >
          <div className="absolute -left-40 top-20 size-[32rem] rounded-full bg-emerald-500/10 blur-[140px]" />

          <div className="absolute -right-40 top-[35%] size-[32rem] rounded-full bg-teal-400/8 blur-[150px]" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-[1700px] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-32">
          {/* Header */}
          <motion.header
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 25 }
            }
            animate={
              reducedMotion
                ? undefined
                : { opacity: 1, y: 0 }
            }
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"
          >
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-emerald-400/70" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-300 sm:text-xs">
                Gallery
              </span>

              <span className="h-px w-8 bg-emerald-400/70" />
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Moments from the journey.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              A curated collection of professional moments,
              achievements, and experiences.
            </p>
          </motion.header>

          {/* Gallery grid */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {items.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                initial={
                  reducedMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 24,
                      }
                }
                whileInView={
                  reducedMotion
                    ? undefined
                    : {
                        opacity: 1,
                        y: 0,
                      }
                }
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.55,
                  delay: Math.min(
                    (index % 4) * 0.05,
                    0.15,
                  ),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/8 bg-[#0B211D] text-left shadow-lg shadow-black/10 outline-none transition-all duration-300 hover:border-emerald-300/30 hover:shadow-emerald-950/30 focus-visible:ring-2 focus-visible:ring-emerald-400/70 sm:rounded-2xl"
                aria-label={`Open ${item.title}`}
              >
                {/* Image frame */}
                <div className="absolute inset-0 p-2 sm:p-3">
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-[#071815] sm:rounded-xl">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-[1.025] sm:p-2"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="absolute bottom-2 left-2 right-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-4 sm:left-4 sm:right-4">
                      <p className="truncate text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-300 sm:text-[10px]">
                        {item.category || "Gallery"}
                      </p>

                      <p className="mt-1 truncate text-xs font-medium text-white sm:text-sm">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </main>

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {selectedItem && selectedIndex !== null && (
          <motion.div
            initial={
              reducedMotion
                ? false
                : { opacity: 0 }
            }
            animate={{ opacity: 1 }}
            exit={
              reducedMotion
                ? undefined
                : { opacity: 0 }
            }
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020807]/95 p-3 backdrop-blur-xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image viewer"
            onClick={closeViewer}
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeViewer}
              aria-label="Close image viewer"
              className="absolute right-3 top-3 z-20 flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white sm:right-6 sm:top-6"
            >
              <X className="size-5" />
            </button>

            {/* Previous */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white backdrop-blur-md transition-all hover:border-emerald-300/40 hover:bg-emerald-400/15 sm:left-6 sm:size-12"
              >
                <ArrowLeft className="size-5" />
              </button>
            )}

            {/* Next */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white backdrop-blur-md transition-all hover:border-emerald-300/40 hover:bg-emerald-400/15 sm:right-6 sm:size-12"
              >
                <ArrowRight className="size-5" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={selectedItem.id}
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, scale: 0.96 }
              }
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={
                reducedMotion
                  ? undefined
                  : {
                      opacity: 0,
                      scale: 0.96,
                    }
              }
              transition={{
                duration: 0.3,
              }}
              className="relative flex h-[82vh] w-[88vw] max-w-6xl items-center justify-center sm:h-[86vh]"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <Image
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Caption */}
            <div className="absolute bottom-4 left-1/2 z-20 w-[calc(100%-7rem)] -translate-x-1/2 text-center sm:bottom-6 sm:w-auto">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                {selectedItem.category || "Gallery"}
              </p>

              <p className="mt-1 truncate text-sm font-medium text-white sm:text-base">
                {selectedItem.title}
              </p>

              <p className="mt-1 text-xs text-white/45">
                {selectedIndex + 1} / {items.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default GalleryPageClient;