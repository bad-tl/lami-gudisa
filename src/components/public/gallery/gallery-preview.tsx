"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Images,
  MoveUpRight,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type GalleryItem = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  imageUrl: string;
  imagePublicId: string;
  sortOrder: number;
};

type GalleryPreviewProps = {
  item: GalleryItem | null;
};

export function GalleryPreview({
  item,
}: GalleryPreviewProps) {
  const reducedMotion = useReducedMotion();

  if (!item) {
    return null;
  }

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-[#071A17] py-20 text-white sm:py-24 lg:py-32"
    >
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-teal-400/10 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Content */}
          <motion.div
            initial={
              reducedMotion
                ? false
                : { opacity: 0, x: -35 }
            }
            whileInView={
              reducedMotion
                ? undefined
                : { opacity: 1, x: 0 }
            }
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-emerald-400" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300">
                Gallery
              </span>
            </div>

            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              A closer look at the journey.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Explore selected professional moments, achievements,
              and experiences captured throughout the journey.
            </p>

            <Link
              href="/gallery"
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3.5 text-sm font-semibold text-emerald-100 transition-all duration-300 hover:border-emerald-300/60 hover:bg-emerald-400/15 hover:text-white"
            >
              <Images className="size-4" />

              <span>Explore Gallery</span>

              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Featured image */}
          <motion.div
            initial={
              reducedMotion
                ? false
                : { opacity: 0, x: 35, scale: 0.97 }
            }
            whileInView={
              reducedMotion
                ? undefined
                : { opacity: 1, x: 0, scale: 1 }
            }
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative"
          >
            {/* Glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2rem] bg-emerald-400/10 opacity-60 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
            />

            <Link
              href="/gallery"
              aria-label={`Explore gallery — ${item.title}`}
              className="relative block overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30"
            >
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

                {/* Image label */}
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                  <div className="min-w-0">
                    {item.category && (
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                        {item.category}
                      </p>
                    )}

                    <h3 className="truncate text-lg font-semibold text-white sm:text-xl">
                      {item.title}
                    </h3>
                  </div>

                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition-all duration-300 group-hover:border-emerald-300/50 group-hover:bg-emerald-400/20">
                    <MoveUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}