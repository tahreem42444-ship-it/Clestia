import { useState } from "react";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog.ts";
import { BookOpen, X } from "lucide-react";

export function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 space-y-4">
      <div>
        <h3 className="font-display text-xl text-gold">Celestial Wisdom</h3>
        <p className="text-xs text-muted-foreground">
          Deepen your understanding of astrology, signs, and birthstones.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-[oklch(1_0_0/0.02)] p-4 space-y-3 hover:bg-[oklch(1_0_0/0.03)] transition-colors"
          >
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-gold font-medium">
                {post.readTime}
              </span>
              <h4 className="font-display text-base text-ivory font-semibold leading-tight">
                {post.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <button
              onClick={() => setSelectedPost(post)}
              className="mt-2 inline-flex items-center gap-1.5 self-start text-[10px] font-semibold text-gold hover:underline cursor-pointer"
            >
              <BookOpen size={12} />
              Read Article
            </button>
          </div>
        ))}
      </div>

      {selectedPost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
        >
          <div className="glass w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden animate-reveal-up bg-[var(--background)]">
            <div className="flex justify-between items-center border-b border-border p-4 sm:p-5">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold font-medium">
                  {selectedPost.readTime} • Written by {selectedPost.author}
                </span>
                <h3
                  id="dialog-title"
                  className="font-display text-2xl gold-gradient mt-1 leading-tight"
                >
                  {selectedPost.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-full border border-border p-1.5 text-muted-foreground hover:text-gold transition-colors cursor-pointer"
                aria-label="Close article"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6 text-sm text-foreground/90 space-y-4 leading-relaxed font-sans scroll-smooth custom-scrollbar">
              {selectedPost.content.split("\n\n").map((para, i) => {
                if (para.startsWith("- **")) {
                  // Render as bullet points
                  return (
                    <ul key={i} className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                      {para.split("\n").map((item, idx) => {
                        const cleanItem = item.replace("- ", "");
                        const strongPart = cleanItem.match(/\*\*(.*?)\*\*/);
                        if (strongPart) {
                          const parts = cleanItem.split(strongPart[0]);
                          return (
                            <li key={idx}>
                              <strong>{strongPart[1]}</strong>
                              {parts[1]}
                            </li>
                          );
                        }
                        return <li key={idx}>{cleanItem}</li>;
                      })}
                    </ul>
                  );
                }
                return <p key={i}>{para}</p>;
              })}
            </div>

            <div className="border-t border-border p-4 bg-[oklch(1_0_0/0.02)] flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-full border border-[var(--gold)]/40 px-5 py-2 text-xs text-gold transition-colors hover:bg-[var(--gold)]/10 focus-visible:outline-none cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
