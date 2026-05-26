import { blogPosts } from "@/lib/blog-posts";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({
  params,
}: Props) {
  const { slug } = await params;

  const post = blogPosts.find(
    (p) => p.slug === slug
  );

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter(
      (p) =>
        p.category === post.category &&
        p.slug !== post.slug
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] px-4 py-10 text-zinc-900 dark:text-white sm:px-6 lg:px-8 transition-colors duration-300">
      <article className="mx-auto max-w-4xl">
        {/* COVER */}
        <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        {/* META */}
        <div className="mt-8">
          <span className="rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 px-4 py-2 text-sm text-cyan-700 dark:text-cyan-300">
            {post.category}
          </span>

          <h1 className="mt-6 text-4xl font-black text-zinc-900 dark:text-white sm:text-6xl">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-zinc-500 dark:text-white/60">
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div
          className="
            prose dark:prose-invert mt-12 max-w-none
            prose-headings:text-zinc-900
            dark:prose-headings:text-white prose-p:text-zinc-700
            dark:prose-p:text-white/80 prose-li:text-zinc-600
            dark:prose-li:text-white/70 prose-strong:text-zinc-900
            dark:prose-strong:text-white prose-a:text-cyan-600
            dark:prose-a:text-cyan-300
          "
        >
          {post.content
            .split("\n")
            .map((line, index) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={index}>
                    {line.replace("# ", "")}
                  </h1>
                );
              }

              if (line.startsWith("## ")) {
                return (
                  <h2 key={index}>
                    {line.replace("## ", "")}
                  </h2>
                );
              }

              if (line.startsWith("- ")) {
                return (
                  <li key={index}>
                    {line.replace("- ", "")}
                  </li>
                );
              }

              return line ? (
                <p key={index}>{line}</p>
              ) : null;
            })}
        </div>

        {/* RELATED POSTS */}
        <section className="mt-20">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
            Related Posts
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/resources/${related.slug}`}
                className="
                  rounded-2xl border border-zinc-200 dark:border-white/10
                  bg-white dark:bg-white/[0.03] p-5 shadow-sm dark:shadow-none transition-all duration-300
                  hover:border-cyan-400/40 hover:-translate-y-1
                  hover:shadow-[0_10px_30px_rgba(6,182,212,0.08)]
                  dark:hover:shadow-none
                "
              >
                <p className="text-sm text-cyan-700 dark:text-cyan-300">
                  {related.category}
                </p>

                <h3 className="mt-3 text-xl font-bold">
                  {related.title}
                </h3>

                <p className="mt-3 text-sm text-zinc-600 dark:text-white/60">
                  {related.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}