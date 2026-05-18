'use client';

import { useMemo, useState } from "react";
import BlogCard from "@/app/components/resources/blog-card";
import { blogPosts, BlogCategory } from "@/lib/blog-posts";

const categories: ("All" | BlogCategory)[] = [
  "All",
  "Interview Tips",
  "Resume Writing",
  "Career Growth",
  "Tech Trends",
];

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<"All" | BlogCategory>("All");

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return blogPosts;
    }

    return blogPosts.filter(
      (post) =>
        post.category === selectedCategory
    );
  }, [selectedCategory]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070B14] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HERO */}
        <section className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Resources
          </p>

          <h1 className="mt-4 text-4xl font-black sm:text-6xl">
            Career Insights & Tech Trends
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/60">
            Explore interview strategies, resume tips, industry trends,
            and practical advice to grow your tech career.
          </p>
        </section>

        {/* FILTERS */}
        <section className="mt-10 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-cyan-400 text-black"
                  : "border border-white/10 bg-white/5 text-white hover:border-cyan-400/40"
              }`}
            >
              {category}
            </button>
          ))}
        </section>

        {/* POSTS */}
        <section className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
            />
          ))}
        </section>
      </div>
    </main>
  )
}

export default ResourcesPage