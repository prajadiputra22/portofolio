"use client";

import { useEffect, useRef } from "react";

export function ArticleReadingProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const percentage = Math.min(100, Math.max(0, progress * 100));

        progressRef.current?.style.setProperty("transform", `scaleX(${percentage / 100})`);
        progressRef.current?.setAttribute("aria-valuenow", String(Math.round(percentage)));
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      aria-label="Article reading progress"
      aria-valuemax={100}
      aria-valuemin={0}
      className="fixed left-0 right-0 top-16 z-40 h-0.5 bg-surface-container-highest"
      role="progressbar"
    >
      <div
        ref={progressRef}
        className="h-full origin-left scale-x-0 bg-secondary will-change-transform"
      />
    </div>
  );
}

export function ArticleShareActions({ title }: { title: string }) {
  const statusRef = useRef<HTMLSpanElement>(null);

  async function copyArticleLink(destination: "link" | "instagram") {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (statusRef.current) {
        statusRef.current.textContent =
          destination === "instagram"
            ? "Link disalin. Tempel di Instagram."
            : "Link berhasil disalin.";
      }
    } catch {
      if (statusRef.current) {
        statusRef.current.textContent = "Link gagal disalin.";
      }
    }
  }

  function shareOnWhatsApp() {
    const shareUrl = new URL("https://wa.me/");
    shareUrl.searchParams.set("text", `${title} ${window.location.href}`);
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="rounded-lg border border-outline-variant/40 px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-secondary"
        onClick={() => copyArticleLink("link")}
        type="button"
      >
        Salin link
      </button>
      <button
        className="rounded-lg border border-outline-variant/40 px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-secondary"
        onClick={() => copyArticleLink("instagram")}
        type="button"
      >
        Salin ke IG
      </button>
      <button
        className="rounded-lg border border-outline-variant/40 px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-secondary"
        onClick={shareOnWhatsApp}
        type="button"
      >
        WhatsApp
      </button>
      <span
        ref={statusRef}
        aria-live="polite"
        className="w-full text-caption text-secondary"
      />
    </div>
  );
}
