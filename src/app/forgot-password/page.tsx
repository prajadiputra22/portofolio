"use client";

import { useState } from "react";

type SubmitStatus = "idle" | "validating" | "success" | "error";

export default function ForgotPassword() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitStatus === "validating" || submitStatus === "success") return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    setSubmitStatus("validating");
    setErrorMessage("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setSubmitStatus("error");
      setErrorMessage(body.error ?? "Terjadi kesalahan. Coba lagi.");
      setTimeout(() => setSubmitStatus("idle"), 2500);
      return;
    }

    setSubmitStatus("success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(123, 208, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(123, 208, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-tr from-background via-transparent to-primary-container/20 pointer-events-none z-0" />

      <main className="flex-grow flex items-center justify-center relative z-10 px-margin-mobile md:px-0">
        <div className="w-full max-w-[440px] rounded-xl p-8 md:p-12 transition-all duration-500 hover:border-secondary/40 shadow-2xl border border-[rgba(69,70,77,0.4)] bg-[rgba(16,20,21,0.7)] backdrop-blur-md">
          <div className="text-center mb-10">
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight mb-2">
              ARCHITECT.DEV
            </h1>
            <p className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest">
              Reset Access
            </p>
          </div>

          {submitStatus === "success" ? (
            <div className="text-center space-y-4">
              <span className="material-symbols-outlined text-secondary text-[48px]">mark_email_read</span>
              <p className="text-on-surface">
                Jika email terdaftar, instruksi reset password sudah dikirim. Cek inbox kamu.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  className="font-label-mono text-caption text-on-surface-variant uppercase ml-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors">
                    mail
                  </span>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all placeholder:text-on-surface-variant/40"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    type="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>
              </div>

              {submitStatus === "error" && (
                <p className="text-caption text-red-400 text-center">{errorMessage}</p>
              )}

              <button
                className="w-full font-bold py-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 hover:shadow-[0_0_20px_rgba(123,208,255,0.3)] bg-secondary text-on-secondary"
                disabled={submitStatus === "validating"}
                type="submit"
              >
                {submitStatus === "validating" ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    Submit
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}