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
    <main className="min-h-screen bg-[#070B14] px-4 py-10 text-white sm:px-6 lg:px-8">
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
          <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            {post.category}
          </span>

          <h1 className="mt-6 text-4xl font-black sm:text-6xl">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-white/60">
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="prose prose-invert mt-12 max-w-none prose-headings:text-white prose-p:text-white/80 prose-li:text-white/70">
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
          <h2 className="text-3xl font-black">
            Related Posts
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/resources/${related.slug}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/40"
              >
                <p className="text-sm text-cyan-300">
                  {related.category}
                </p>

                <h3 className="mt-3 text-xl font-bold">
                  {related.title}
                </h3>

                <p className="mt-3 text-sm text-white/60">
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