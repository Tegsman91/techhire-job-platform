'use client';

import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/blog-posts";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({
  post,
}: BlogCardProps) {
  return (
    <Link
      href={`/resources/${post.slug}`}
      className="group"
    >
      <article
        className="
          h-full flex flex-col overflow-hidden rounded-[2rem]
          border border-zinc-200 dark:border-white/10
          bg-white dark:bg-white/[0.03]
          shadow-sm dark:shadow-none transition-all duration-300
          hover:-translate-y-1 hover:border-cyan-400/30
          hover:shadow-[0_10px_30px_rgba(6,182,212,0.08)]
          dark:hover:shadow-none
        "
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
              {post.category}
            </span>

            <span className="text-sm text-zinc-500 dark:text-white/50">
              {post.date}
            </span>
          </div>

          <h2 className="line-clamp-2 text-2xl font-black text-zinc-900 dark:text-white">
            {post.title}
          </h2>

          <p className="mt-3 line-clamp-3 text-zinc-600 dark:text-white/60">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-6 flex items-center justify-between">
            <p className="text-sm text-zinc-600 dark:text-white/70">
              By {post.author}
            </p>

            <div
              className="
                flex items-center gap-2 text-sm font-medium
                text-cyan-700 dark:text-cyan-300/80 transition
                group-hover:text-cyan-500
                dark:group-hover:text-cyan-200
              "
            >
              <span>Read article</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}